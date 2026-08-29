import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { internshipService, applicationService, notificationService } from '../services/api';
import { useSocket } from './SocketContext';

const InternshipContext = createContext(null);

export const InternshipProvider = ({ children }) => {
  const { subscribe, isConnected } = useSocket();

  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [activeChatThreadId, setActiveChatThreadId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const openLiveChat = (threadId = null) => {
    setActiveChatThreadId(threadId);
    setLiveChatOpen(true);
  };

  const closeLiveChat = () => {
    setLiveChatOpen(false);
    setActiveChatThreadId(null);
  };

  const loadData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const [intList, appList, notifList] = await Promise.all([
        internshipService.getAll({ category: activeCategory, search: searchQuery }),
        applicationService.getAll(),
        notificationService.getNotifications()
      ]);
      setInternships(intList || []);
      setApplications(appList || []);
      setNotifications(notifList || []);
    } catch (err) {
      console.error('Failed to load shared internship/application state', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  // Initial load
  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Real-time Event Subscriptions via WebSocket / SSE!
  useEffect(() => {
    if (!subscribe) return;

    // 1. Live Application Status Update
    const unsubApp = subscribe('application:status_updated', (data) => {
      console.log('⚡ [RealTime Event] application:status_updated', data);
      if (data?.applicationId && data?.status) {
        setApplications((prev) =>
          prev.map((app) => (app.id === data.applicationId ? { ...app, status: data.status } : app))
        );
        if (data.notification) {
          setNotifications((prev) => [data.notification, ...prev]);
          showToast(data.notification.title, data.notification.type || 'info');
        }
      }
    });

    // 2. Live Capacity Update
    const unsubCap = subscribe('capacity:updated', (data) => {
      console.log('⚡ [RealTime Event] capacity:updated', data);
      if (data?.internshipId) {
        setInternships((prev) =>
          prev.map((int) =>
            int.id === data.internshipId
              ? { ...int, filledPositions: data.filledPositions, maxPositions: data.maxPositions }
              : int
          )
        );
      }
    });

    // 3. Live New Internship Listing
    const unsubInt = subscribe('internship:new', (newInt) => {
      console.log('⚡ [RealTime Event] internship:new', newInt);
      if (newInt?.id) {
        setInternships((prev) => [newInt, ...prev.filter((i) => i.id !== newInt.id)]);
        showToast(`New opening posted: ${newInt.title} at ${newInt.companyName}`, 'info');
      }
    });

    // 4. Live New Application (For Recruiters)
    const unsubNewApp = subscribe('application:new', (newApp) => {
      console.log('⚡ [RealTime Event] application:new', newApp);
      if (newApp?.id) {
        setApplications((prev) => [newApp, ...prev.filter((a) => a.id !== newApp.id)]);
        showToast(`New applicant: ${newApp.studentName} applied for ${newApp.internshipTitle}`, 'info');
      }
    });

    // 5. Live Incoming Chat Message
    const unsubChat = subscribe('chat:new_message', (data) => {
      console.log('⚡ [RealTime Event] chat:new_message', data);
      if (data?.message) {
        showToast(`💬 New message from ${data.message.senderName}`, 'info');
      }
    });

    return () => {
      unsubApp();
      unsubCap();
      unsubInt();
      unsubNewApp();
      unsubChat();
    };
  }, [subscribe]);

  const applyForInternship = async (appData) => {
    try {
      const result = await applicationService.apply(appData);
      setApplications((prev) => [result, ...prev]);
      showToast(`Application successfully submitted for ${result.internshipTitle}!`, 'success');
      await loadData(true);
      return result;
    } catch (err) {
      const msg = err.message || 'Application submission failed';
      showToast(msg, 'error');
      throw err;
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const updated = await applicationService.updateStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? updated : app))
      );

      let toastMsg = `Application status updated to "${newStatus}"`;
      if (newStatus === 'SELECTED') {
        toastMsg = `🎉 Candidate SELECTED! Notification & offer sent to student.`;
      } else if (newStatus === 'REJECTED') {
        toastMsg = `Candidate status updated to REJECTED.`;
      } else if (newStatus === 'SHORTLISTED') {
        toastMsg = `Candidate moved to SHORTLIST.`;
      }

      showToast(toastMsg, newStatus === 'SELECTED' ? 'success' : 'info');
      await loadData(true);
      return updated;
    } catch (err) {
      const msg = err.message || 'Status update failed';
      showToast(msg, 'error');
      throw err;
    }
  };

  const createInternship = async (data) => {
    try {
      const created = await internshipService.create(data);
      setInternships((prev) => [created, ...prev]);
      showToast('Internship successfully posted!', 'success');
      await loadData(true);
      return created;
    } catch (err) {
      showToast(err.message || 'Failed to post internship', 'error');
      throw err;
    }
  };

  const markAllNotificationsAsRead = async (studentEmail) => {
    try {
      await notificationService.markAllAsRead(studentEmail);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <InternshipContext.Provider
      value={{
        internships,
        applications,
        notifications,
        unreadNotifCount,
        markAllNotificationsAsRead,
        loading,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        applyForInternship,
        updateStatus,
        createInternship,
        refreshData: () => loadData(true),
        showToast,
        toastMessage,
        dismissToast: () => setToastMessage(null),
        liveChatOpen,
        openLiveChat,
        closeLiveChat,
        activeChatThreadId
      }}
    >
      {children}
    </InternshipContext.Provider>
  );
};

export const useInternships = () => {
  const context = useContext(InternshipContext);
  if (!context) throw new Error('useInternships must be used within an InternshipProvider');
  return context;
};

export default InternshipContext;
