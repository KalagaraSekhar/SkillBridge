import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInternships } from '../context/InternshipContext';
import { promptGoogleAccountChooser } from '../services/googleAuth';
import {
  Briefcase,
  ArrowRight,
  AlertCircle,
  Building2,
  Loader2,
  Lock,
  Mail
} from 'lucide-react';

export const CompanyLogin = () => {
  const { loginCompany, loginWithGoogle } = useAuth();
  const { showToast } = useInternships();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginCompany({
        email: formData.email.trim(),
        password: formData.password
      });

      if (showToast) {
        showToast(`Welcome back, ${res.user?.name || 'Recruiter'}!`, 'success');
      }
      navigate('/company/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid employer credentials or unauthorized portal.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const googleAccount = await promptGoogleAccountChooser();
      if (!googleAccount?.email) {
        throw new Error('No email returned from Google account picker.');
      }

      const res = await loginWithGoogle(
        'COMPANY',
        googleAccount.idToken || googleAccount.token,
        googleAccount.email,
        googleAccount.name
      );

      if (showToast) {
        showToast(`Welcome, ${res.user?.name || googleAccount.email}!`, 'success');
      }
      navigate('/company/dashboard');
    } catch (err) {
      console.error('[Company Google Login Error]:', err);
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-xs font-semibold border border-emerald-200">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Employer & Recruiter Portal</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight">
            Company Login
          </h1>
          <p className="text-xs sm:text-sm text-slateSub">
            Post internships, manage applicants, and hire top student talent.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-surface-border space-y-6">
          
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-600 font-medium animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In */}
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-2xl border border-surface-border hover:border-emerald-500/40 bg-white hover:bg-surface-muted text-xs font-semibold text-charcoal flex items-center justify-center gap-3 transition-all shadow-soft-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Connecting with Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Company Google</span>
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-surface-border w-full" />
            <span className="bg-white px-3 text-[11px] font-mono text-slateSub uppercase">
              Or with work email
            </span>
            <div className="border-t border-surface-border w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="floating-group">
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                className="floating-input"
              />
              <label htmlFor="email" className="floating-label">
                Work Email Address
              </label>
            </div>

            <div className="floating-group">
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="floating-input"
              />
              <label htmlFor="password" className="floating-label">
                Password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-soft flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Company Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Portal Switcher & Register Links */}
          <div className="pt-2 border-t border-surface-border space-y-2 text-center">
            <p className="text-xs text-slateSub">
              Need to register your organization?{' '}
              <Link to="/register" className="font-semibold text-emerald-700 hover:underline">
                Create company account
              </Link>
            </p>
            <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-slateSub font-mono">
              <Link to="/login/student" className="hover:text-primary transition-colors">
                &larr; Student Login
              </Link>
              <span>•</span>
              <Link to="/login/admin" className="hover:text-primary transition-colors">
                Admin Login &rarr;
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CompanyLogin;
