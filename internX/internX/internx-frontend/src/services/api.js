import axios from 'axios';

// Create Axios client pointing to /api (proxied to port 8080 or live server)
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Inject Auth Bearer Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('internx_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error normalization
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Server request failed.';
    return Promise.reject(new Error(customMessage));
  }
);

/**
 * 1. Authentication Services
 */
export const authService = {
  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },

  sendOtp: async (email) => {
    const res = await apiClient.post('/auth/send-otp', { email });
    return res.data;
  },

  verifyOtp: async (email, otp) => {
    const res = await apiClient.post('/auth/verify-otp', { email, otp });
    return res.data;
  },

  resendOtp: async (email) => {
    const res = await apiClient.post('/auth/resend-otp', { email });
    return res.data;
  },

  loginStudent: async (credentials) => {
    const res = await apiClient.post('/auth/student/login', credentials);
    return res.data;
  },

  loginCompany: async (credentials) => {
    const res = await apiClient.post('/auth/company/login', credentials);
    return res.data;
  },

  loginAdmin: async (credentials) => {
    const res = await apiClient.post('/auth/admin/login', credentials);
    return res.data;
  },

  loginGoogleRole: async (role, token, email, name, avatar) => {
    const res = await apiClient.post(`/auth/google/${role.toLowerCase()}`, { token, email, name, avatar });
    return res.data;
  },

  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data?.user || res.data;
  },

  updateProfile: async (profileData) => {
    const res = await apiClient.put('/auth/profile', profileData);
    return res.data?.user || res.data;
  }
};

/**
 * 2. Internship Catalog Services
 */
export const internshipService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/internships', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/internships/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await apiClient.post('/internships', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/internships/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/internships/${id}`);
    return res.data;
  }
};

/**
 * 3. Student Application & Capacity Services
 */
export const applicationService = {
  apply: async (applicationData) => {
    const res = await apiClient.post('/applications', applicationData);
    return res.data;
  },

  getAll: async (params = {}) => {
    const res = await apiClient.get('/applications', { params });
    return res.data;
  },

  getByCompany: async (companyId) => {
    const res = await apiClient.get(`/applications/company/${companyId}`);
    return res.data;
  },

  getByStudent: async (studentId) => {
    const res = await apiClient.get(`/applications/student/${studentId}`);
    return res.data;
  },

  getByInternship: async (internshipId) => {
    const res = await apiClient.get(`/applications/internship/${internshipId}`);
    return res.data;
  },

  updateStatus: async (applicationId, status) => {
    const res = await apiClient.patch(`/applications/${applicationId}/status`, { status });
    return res.data;
  }
};

/**
 * 4. Real-Time Chat & Recruiter Messaging
 */
export const chatService = {
  getConversations: async (params = {}) => {
    const res = await apiClient.get('/chat/conversations', { params });
    return res.data;
  },

  getMessages: async (conversationId) => {
    const res = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
    return res.data;
  },

  createOrGetConversation: async (data) => {
    const res = await apiClient.post('/chat/conversations', data);
    return res.data;
  },

  sendMessage: async (conversationId, messageData) => {
    const res = await apiClient.post(`/chat/conversations/${conversationId}/messages`, messageData);
    return res.data;
  }
};

/**
 * 5. AI ATS Matching Service
 */
export const aiService = {
  calculateMatch: async (data) => {
    const res = await apiClient.post('/ai/match', data);
    return res.data;
  }
};

/**
 * 6. Notifications Service
 */
export const notificationService = {
  getNotifications: async (params = {}) => {
    const res = await apiClient.get('/notifications', { params });
    return res.data;
  },

  markAllAsRead: async (studentEmail) => {
    const res = await apiClient.post('/notifications/read-all', { studentEmail });
    return res.data;
  },

  markSingleAsRead: async (id) => {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data;
  }
};

/**
 * 7. Admin & Platform Governance Services
 */
export const adminService = {
  getStats: async () => {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  getCompanies: async () => {
    const res = await apiClient.get('/admin/companies');
    return res.data;
  },

  approveCompany: async (companyId, approved) => {
    const res = await apiClient.patch(`/admin/companies/${companyId}`, {
      approvedStatus: approved ? 'APPROVED' : 'REJECTED'
    });
    return res.data;
  }
};

export default apiClient;
