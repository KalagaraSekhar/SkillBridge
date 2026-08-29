import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  KeyRound,
  Mail,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

export const OtpVerification = ({
  email,
  title = 'Verify Your Email',
  subtitle = 'We have sent a 6-digit verification code to',
  onSuccess,
  onBack,
  showBackToLogin = false
}) => {
  const { otpFlow, verifyOtp, resendOtp, user } = useAuth();
  const navigate = useNavigate();

  const emailToVerify = email || otpFlow.pendingEmail || user?.email || 'student@internx.dev';

  // 6-digit boxes always start empty - user enters code from their email
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  const inputRefs = useRef([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // 60-second countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle single digit changes & auto-advance
  const handleDigitChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError('');

    // Advance focus if digit is entered and not last box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste support (splits 6 digits across boxes)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const splitDigits = pastedData.split('');
      setDigits(splitDigits);
      inputRefs.current[5]?.focus();
    }
  };

  // Handle submit
  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = digits.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await verifyOtp(emailToVerify, fullOtp);
      if (onSuccess) {
        onSuccess(res);
      } else {
        // Default Role-based routing
        const userRole = res.user?.role || 'STUDENT';
        if (userRole === 'COMPANY') {
          navigate('/company/dashboard');
        } else if (userRole === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code. Please check your inbox and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    if (!canResend) return;
    try {
      await resendOtp(emailToVerify);
      setTimer(60);
      setCanResend(false);
      setResendSuccess(true);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      console.error('[InternX OTP UI Error] Resend OTP failed:', err);
      setError(err.message || 'Failed to resend OTP. Please check email provider configuration.');
    }
  };

  const isComplete = digits.every((d) => d !== '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary mx-auto flex items-center justify-center shadow-soft">
          <KeyRound className="w-7 h-7 text-accent" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-charcoal tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slateSub">
          {subtitle}
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-surface-border text-xs font-mono font-bold text-primary">
          <Mail className="w-3.5 h-3.5 text-accent" />
          <span>Code sent to {emailToVerify}</span>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-600 font-medium animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {resendSuccess && (
        <div className="p-3.5 rounded-2xl bg-tealSuccess-light border border-tealSuccess/30 flex items-center gap-2.5 text-xs text-tealSuccess-dark font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-tealSuccess" />
          <span>A fresh 6-digit code has been dispatched to your email.</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        {/* 6 Digit Split Input Boxes */}
        <div>
          <label className="block text-center text-xs font-mono uppercase font-semibold text-slateSub mb-3">
            Enter 6-Digit Code
          </label>
          <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-mono font-bold text-primary bg-surface border-2 border-surface-border rounded-2xl focus:bg-white focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all"
              />
            ))}
          </div>
          <p className="text-[11px] text-center text-slateSub mt-2">
            Please check your inbox (and spam folder) for your 6-digit code.
          </p>
        </div>

        {/* Resend Cooldown Countdown */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slateSub">Didn't receive the code?</span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-accent hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Resend Code</span>
            </button>
          ) : (
            <span className="text-slateSub">
              Resend in <span className="font-bold text-primary">00:{timer < 10 ? `0${timer}` : timer}</span>
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isComplete || loading}
          className={`btn-primary w-full py-3.5 text-sm gap-2 ${
            !isComplete ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span>Verifying Code...</span>
          ) : (
            <>
              <span>Verify & Complete Login</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Back navigation */}
        {onBack && (
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onBack}
              className="text-xs text-slateSub hover:text-primary transition-colors inline-flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login Options</span>
            </button>
          </div>
        )}

        {showBackToLogin && (
          <div className="text-center pt-1">
            <Link to="/login" className="text-xs text-slateSub hover:text-primary transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Login</span>
            </Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default OtpVerification;
