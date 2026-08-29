import React from 'react';
import { useInternships } from '../context/InternshipContext';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = () => {
  const { toastMessage, dismissToast } = useInternships();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div
        className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-soft-lg border backdrop-blur-md text-sm font-medium ${
          isSuccess
            ? 'bg-white/95 text-charcoal border-tealSuccess/40'
            : 'bg-white/95 text-charcoal border-red-200'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-tealSuccess shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-accent shrink-0" />
        )}
        <span className="max-w-xs">{toastMessage.message}</span>
        <button
          onClick={dismissToast}
          className="ml-2 text-slateSub hover:text-charcoal transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
