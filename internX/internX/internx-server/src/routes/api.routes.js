import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import * as internshipController from '../controllers/internship.controller.js';
import * as applicationController from '../controllers/application.controller.js';
import * as chatController from '../controllers/chat.controller.js';
import * as aiController from '../controllers/ai.controller.js';
import * as notificationController from '../controllers/notification.controller.js';
import * as adminController from '../controllers/admin.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// 1. Authentication Routes
router.post('/auth/register', authController.register);
router.post('/auth/send-otp', authController.sendOtp);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/auth/resend-otp', authController.resendOtp);
router.post('/auth/student/login', authController.loginStudent);
router.post('/auth/company/login', authController.loginCompany);
router.post('/auth/admin/login', authController.loginAdmin);
router.post('/auth/google/:role', authController.loginGoogleRole);
router.get('/auth/me', authenticateToken, authController.getMe);
router.put('/auth/profile', authenticateToken, authController.updateProfile);

// 2. Internship Routes
router.get('/internships', internshipController.getAllInternships);
router.get('/internships/:id', internshipController.getInternshipById);
router.post('/internships', internshipController.createInternship);
router.put('/internships/:id', internshipController.updateInternship);
router.delete('/internships/:id', internshipController.deleteInternship);

// 3. Application Routes
router.post('/applications', applicationController.apply);
router.get('/applications', applicationController.getAll);
router.get('/applications/company/:companyId', applicationController.getByCompany);
router.get('/applications/student/:studentId', applicationController.getByStudent);
router.get('/applications/internship/:internshipId', applicationController.getByInternship);
router.patch('/applications/:id/status', applicationController.updateStatus);

// 4. Real-Time Chat Routes
router.get('/chat/conversations', chatController.getConversations);
router.get('/chat/conversations/:id/messages', chatController.getMessages);
router.post('/chat/conversations', chatController.createOrGetConversation);
router.post('/chat/conversations/:id/messages', chatController.sendMessage);

// 5. AI ATS Matching Engine
router.post('/ai/match', aiController.calculateMatch);

// 6. Notifications
router.get('/notifications', notificationController.getNotifications);
router.post('/notifications/read-all', notificationController.markAllRead);
router.patch('/notifications/:id/read', notificationController.markSingleRead);

// 7. Admin & Governance
router.get('/admin/stats', adminController.getStats);
router.get('/admin/companies', adminController.getCompanies);
router.patch('/admin/companies/:id', adminController.updateCompanyStatus);

// 8. Health & Telemetry Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'InternX Real-Time Zenith Backend Engine',
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime()
  });
});

export default router;
