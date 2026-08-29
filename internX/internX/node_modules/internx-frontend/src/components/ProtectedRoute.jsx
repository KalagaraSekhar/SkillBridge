import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

/**
 * Route Guard enforcing JWT-authenticated role-based access control.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected page component
 * @param {Array<string>} props.allowedRoles - Allowed roles (e.g. ['STUDENT'], ['COMPANY'], ['ADMIN'])
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xs font-mono text-slateSub">Verifying authentication session...</span>
      </div>
    );
  }

  // 1. Unauthenticated users are redirected to the appropriate portal login
  if (!isAuthenticated || !user) {
    let targetLogin = '/login/student';
    if (allowedRoles.includes('COMPANY') && !allowedRoles.includes('STUDENT')) {
      targetLogin = '/login/company';
    } else if (allowedRoles.includes('ADMIN') && !allowedRoles.includes('STUDENT')) {
      targetLogin = '/login/admin';
    }
    return <Navigate to={targetLogin} state={{ from: location }} replace />;
  }

  // 2. Role-based check
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    console.warn(`Unauthorized access attempt to ${location.pathname} by user with role: ${role}`);
    
    // Redirect to the user's authentic authorized dashboard
    let authorizedRoute = '/student/dashboard';
    if (role === 'COMPANY') authorizedRoute = '/company/dashboard';
    else if (role === 'ADMIN') authorizedRoute = '/admin/dashboard';

    return <Navigate to={authorizedRoute} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
