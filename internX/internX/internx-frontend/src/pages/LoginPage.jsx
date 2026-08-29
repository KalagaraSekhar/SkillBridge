import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Legacy LoginPage redirect to the Student Login portal.
 * Authentication has been divided into /login/student, /login/company, and /login/admin.
 */
export const LoginPage = () => {
  return <Navigate to="/login/student" replace />;
};

export default LoginPage;
