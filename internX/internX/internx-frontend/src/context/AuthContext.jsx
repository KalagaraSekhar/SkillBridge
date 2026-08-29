import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpFlow, setOtpFlow] = useState({
    pendingEmail: '',
    userData: null
  });

  useEffect(() => {
    // Check saved session
    const savedToken = localStorage.getItem('internx_jwt_token');
    const savedUser = localStorage.getItem('internx_current_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('internx_jwt_token');
        localStorage.removeItem('internx_current_user');
      }
    } else {
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const saveSession = (res) => {
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('internx_jwt_token', res.token);
      localStorage.setItem('internx_current_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    return saveSession(res);
  };

  const verifyOtp = async (email, otpCode) => {
    const res = await authService.verifyOtp(email, otpCode);
    saveSession(res);
    setOtpFlow({ pendingEmail: '', userData: null });
    return res;
  };

  const resendOtp = async (email) => {
    return await authService.resendOtp(email);
  };

  const sendOtp = async (email) => {
    const res = await authService.sendOtp(email);
    setOtpFlow((prev) => ({
      ...prev,
      pendingEmail: email
    }));
    return res;
  };

  const loginStudent = async (credentials) => {
    const res = await authService.loginStudent(credentials);
    return saveSession(res);
  };

  const loginCompany = async (credentials) => {
    const res = await authService.loginCompany(credentials);
    return saveSession(res);
  };

  const loginAdmin = async (credentials) => {
    const res = await authService.loginAdmin(credentials);
    return saveSession(res);
  };

  const loginWithGoogle = async (role, token, email, name) => {
    const res = await authService.loginGoogleRole(role, token, email, name);
    return saveSession(res);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('internx_jwt_token');
    localStorage.removeItem('internx_current_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        otpFlow,
        setOtpFlow,
        isAuthenticated: !!user && !!token,
        role: user?.role || 'GUEST',
        register,
        verifyOtp,
        sendOtp,
        resendOtp,
        loginStudent,
        loginCompany,
        loginAdmin,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
