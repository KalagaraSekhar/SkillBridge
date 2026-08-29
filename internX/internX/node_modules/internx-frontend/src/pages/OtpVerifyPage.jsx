import React from 'react';
import { useAuth } from '../context/AuthContext';
import { OtpVerification } from '../components/OtpVerification';

export const OtpVerifyPage = () => {
  const { otpFlow, user } = useAuth();
  const emailToVerify = otpFlow.pendingEmail || user?.email || 'student@internx.dev';

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-surface-border">
          <OtpVerification
            email={emailToVerify}
            title="Verify Your Email"
            subtitle="We have sent a 6-digit verification code to"
            showBackToLogin={true}
          />
        </div>
      </div>
    </div>
  );
};

export default OtpVerifyPage;
