import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { promptGoogleAccountChooser } from '../services/googleAuth';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
  Briefcase,
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

export const RegisterPage = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'STUDENT', // STUDENT or COMPANY
    university: '',
    major: ''
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(formData);
      // Direct Navigation to Role Dashboard
      if (formData.role === 'COMPANY') {
        navigate('/company/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.');
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
        throw new Error('No email returned from Google.');
      }

      await loginWithGoogle(
        formData.role || 'STUDENT',
        googleAccount.idToken || googleAccount.token,
        googleAccount.email,
        googleAccount.name
      );

      if (formData.role === 'COMPANY') {
        navigate('/company/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Google Sign-In was cancelled or failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary font-mono text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Join SkillBridge India Today</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slateSub">
            Get instant access to top internships and transparent status tracking.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-surface-border space-y-6">
          
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-600 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 p-1 bg-surface-muted rounded-2xl border border-surface-border text-xs font-semibold font-mono">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                formData.role === 'STUDENT'
                  ? 'bg-white text-primary shadow-soft-sm'
                  : 'text-slateSub hover:text-charcoal'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>I'm a Student</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'COMPANY' })}
              className={`py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                formData.role === 'COMPANY'
                  ? 'bg-white text-primary shadow-soft-sm'
                  : 'text-slateSub hover:text-charcoal'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>I'm an Employer</span>
            </button>
          </div>

          {/* Google One-Click OAuth Button */}
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-2xl border border-surface-border hover:border-primary/40 bg-white hover:bg-surface-muted text-xs font-semibold text-charcoal flex items-center justify-center gap-3 transition-colors shadow-soft-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span>Signing in with Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-surface-border w-full" />
            <span className="bg-white px-3 text-[11px] font-mono text-slateSub uppercase">
              Or with email & password
            </span>
            <div className="border-t border-surface-border w-full" />
          </div>

          {/* Registration Form with Floating Labels */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="floating-group">
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                className="floating-input"
              />
              <label htmlFor="name" className="floating-label">
                Full Name
              </label>
            </div>

            {/* Email Address */}
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
                University / Professional Email
              </label>
            </div>

            {/* Phone Number */}
            <div className="floating-group">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=" "
                className="floating-input"
              />
              <label htmlFor="phone" className="floating-label">
                Phone Number
              </label>
            </div>

            {/* Password */}
            <div className="floating-group">
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="floating-input"
              />
              <label htmlFor="password" className="floating-label">
                Create Password (min 6 characters)
              </label>
            </div>

            {/* Student Specific Fields */}
            {formData.role === 'STUDENT' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="floating-group">
                  <input
                    type="text"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder=" "
                    className="floating-input"
                  />
                  <label htmlFor="university" className="floating-label">
                    University
                  </label>
                </div>

                <div className="floating-group">
                  <input
                    type="text"
                    id="major"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    placeholder=" "
                    className="floating-input"
                  />
                  <label htmlFor="major" className="floating-label">
                    Major / Branch
                  </label>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm gap-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slateSub">
                Already have an account?{' '}
                <Link to="/login/student" className="font-semibold text-primary hover:text-accent">
                  Log in
                </Link>
              </p>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
