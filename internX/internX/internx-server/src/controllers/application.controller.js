import { store } from '../data/store.js';

export const apply = async (req, res) => {
  try {
    const { internshipId, studentId, studentName, studentEmail, studentUniversity, resumeUrl, coverNote } = req.body;
    const effectiveStudentId = req.userId || studentId || 'usr-1';
    const effectiveStudentEmail = req.user?.email || studentEmail || 'student@internx.dev';
    const effectiveStudentName = req.user?.name || studentName || 'Alex Rivera';

    if (!internshipId) {
      return res.status(400).json({ success: false, message: 'Internship ID is required.' });
    }

    const internship = store.internships.find((i) => i.id === internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }

    // Check capacity limit
    if (internship.filledPositions >= internship.maxPositions) {
      return res.status(409).json({
        success: false,
        message: 'Capacity full (409 Conflict): All positions for this internship have already been filled.'
      });
    }

    // Check duplicate application
    const existing = store.applications.find(
      (a) => (a.studentId === effectiveStudentId || a.studentEmail.toLowerCase() === effectiveStudentEmail.toLowerCase()) && a.internshipId === internshipId
    );
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already submitted an application for this role.' });
    }

    // Calculate match score based on student skills and requirements
    const user = store.users.find((u) => u.id === effectiveStudentId || u.email.toLowerCase() === effectiveStudentEmail.toLowerCase());
    const userSkills = user?.skills || ['React', 'TypeScript', 'Node.js'];
    const requiredSkills = internship.skillsRequired || [];
    const matched = requiredSkills.filter((s) => userSkills.some((us) => us.toLowerCase() === s.toLowerCase()));
    const matchRatio = requiredSkills.length > 0 ? (matched.length / requiredSkills.length) : 0.85;
    const matchScore = Math.min(99, Math.max(70, Math.round(matchRatio * 95 + Math.random() * 5)));

    const newApp = {
      id: `app-${Date.now()}`,
      studentId: effectiveStudentId,
      studentName: effectiveStudentName,
      studentEmail: effectiveStudentEmail,
      studentUniversity: studentUniversity || user?.university || 'Stanford University',
      internshipId: internship.id,
      internshipTitle: internship.title,
      companyId: internship.companyId,
      companyName: internship.companyName,
      companyLogo: internship.companyLogo,
      category: internship.category,
      stipend: internship.stipend,
      appliedAt: new Date().toISOString(),
      status: 'APPLIED',
      resumeUrl: resumeUrl || user?.resumeUrl || 'Resume_Uploaded.pdf',
      coverNote: coverNote || '',
      matchScore
    };

    store.applications.unshift(newApp);
    store.save();

    // Real-Time WebSocket Alerts
    if (req.io) {
      // Notify the company recruiter room
      req.io.to(`company:${internship.companyId}`).emit('application:new', newApp);
      req.io.emit('live_feed:application', {
        studentName: effectiveStudentName.split(' ')[0],
        internshipTitle: internship.title,
        companyName: internship.companyName,
        time: new Date().toISOString()
      });
    }

    return res.status(201).json(newApp);
  } catch (err) {
    console.error('apply error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
};

export const getAll = async (req, res) => {
  try {
    const { companyId, studentId, internshipId, status } = req.query;
    let list = [...store.applications];

    if (companyId) {
      list = list.filter((a) => a.companyId === companyId);
    }
    if (studentId) {
      list = list.filter((a) => a.studentId === studentId || a.studentEmail.toLowerCase() === studentId.toLowerCase());
    }
    if (internshipId) {
      list = list.filter((a) => a.internshipId === internshipId);
    }
    if (status && status !== 'ALL') {
      list = list.filter((a) => a.status === status);
    }

    return res.json(list);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve applications.' });
  }
};

export const getByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const companyListings = store.internships.filter((i) => i.companyId === companyId).map((i) => i.id);
    const list = store.applications.filter((a) => a.companyId === companyId || companyListings.includes(a.internshipId));
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve company applications.' });
  }
};

export const getByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const list = store.applications.filter(
      (a) => a.studentId === studentId || a.studentEmail.toLowerCase() === studentId.toLowerCase()
    );
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve student applications.' });
  }
};

export const getByInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const list = store.applications.filter((a) => a.internshipId === internshipId);
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve internship applicants.' });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status value.' });
    }

    const app = store.applications.find((a) => a.id === id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const internship = store.internships.find((i) => i.id === app.internshipId);

    // Concurrency / Capacity safety check inside Pessimistic Lock!
    const result = await store.acquireLock(`lock:internship:${app.internshipId}`, async () => {
      const currentInternship = store.internships.find((i) => i.id === app.internshipId);

      if (status === 'SELECTED' && app.status !== 'SELECTED') {
        if (currentInternship && currentInternship.filledPositions >= currentInternship.maxPositions) {
          const err = new Error('Capacity limit exceeded (409 Conflict): All accepted positions have been filled.');
          err.statusCode = 409;
          throw err;
        }
        if (currentInternship) {
          currentInternship.filledPositions += 1;
        }
      } else if (app.status === 'SELECTED' && status !== 'SELECTED') {
        if (currentInternship && currentInternship.filledPositions > 0) {
          currentInternship.filledPositions -= 1;
        }
      }

      app.status = status;
      store.save();
      return { app, internship: currentInternship };
    });

    // Create In-App & Push Notification for the student
    let notifTitle = `Application ${status}`;
    let notifMsg = `Your application for "${app.internshipTitle}" at ${app.companyName} is now ${status}.`;
    let notifType = 'info';

    if (status === 'SELECTED') {
      notifTitle = `🎉 Offer Letter: You're Selected!`;
      notifMsg = `Congratulations! ${app.companyName} has officially selected you for the "${app.internshipTitle}" role. Check your inbox for next steps!`;
      notifType = 'success';
    } else if (status === 'SHORTLISTED') {
      notifTitle = `🌟 You've Been Shortlisted!`;
      notifMsg = `${app.companyName} has advanced your application for "${app.internshipTitle}" to the shortlist round.`;
      notifType = 'info';
    } else if (status === 'REJECTED') {
      notifTitle = `Application Status Update`;
      notifMsg = `Your application for "${app.internshipTitle}" at ${app.companyName} was not selected this time.`;
      notifType = 'error';
    }

    const newNotif = {
      id: `notif-${Date.now()}`,
      studentEmail: app.studentEmail,
      studentId: app.studentId,
      title: notifTitle,
      message: notifMsg,
      type: notifType,
      applicationId: app.id,
      internshipTitle: app.internshipTitle,
      companyName: app.companyName,
      createdAt: new Date().toISOString(),
      read: false
    };

    store.notifications.unshift(newNotif);
    store.save();

    // Broadcast live WebSocket events!
    if (req.io) {
      // 1. Direct to student
      req.io.to(`user:${app.studentId}`).to(`email:${app.studentEmail}`).emit('application:status_updated', {
        applicationId: app.id,
        status,
        app,
        notification: newNotif
      });

      // 2. Global capacity update for this internship
      if (result.internship) {
        req.io.emit('capacity:updated', {
          internshipId: result.internship.id,
          filledPositions: result.internship.filledPositions,
          maxPositions: result.internship.maxPositions
        });
      }
    }

    return res.json(app);
  } catch (err) {
    console.error('updateStatus error:', err);
    const code = err.statusCode || 500;
    return res.status(code).json({ success: false, message: err.message });
  }
};
