import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInternships } from '../context/InternshipContext';
import confetti from 'canvas-confetti';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ApplyModal = ({ internship, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { applyForInternship } = useInternships();

  const [resumeFileName, setResumeFileName] = useState(user?.resumeUrl || 'Alex_Rivera_Resume_2026.pdf');
  const [coverNote, setCoverNote] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('https://github.com/alexrivera');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !internship) return null;

  const isFull = internship.filledPositions >= internship.maxPositions;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      await applyForInternship({
        internshipId: internship.id,
        internshipTitle: internship.title,
        companyId: internship.companyId || 'comp-1',
        companyName: internship.companyName,
        companyLogo: internship.companyLogo,
        category: internship.category,
        stipend: internship.stipend,
        studentId: user?.id || 'usr-1',
        studentName: user?.name || 'Alex Rivera',
        studentEmail: user?.email || 'student@internx.dev',
        studentUniversity: user?.university || 'Stanford University',
        resumeUrl: resumeFileName,
        coverNote: coverNote,
        portfolioUrl: portfolioUrl
      });

      // Confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSubmittedSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedSuccess(false);
    setCoverNote('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-soft-lg border border-surface-border overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-surface-border flex items-center justify-between bg-surface">
          <div className="flex items-center gap-3">
            <img
              src={internship.companyLogo}
              alt={internship.companyName}
              className="w-10 h-10 rounded-xl object-cover border border-surface-border p-0.5 bg-white"
            />
            <div>
              <h3 className="font-heading font-bold text-base text-charcoal">
                Apply for Internship
              </h3>
              <p className="text-xs text-slateSub">
                {internship.title} • {internship.companyName}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full text-slateSub hover:text-charcoal hover:bg-surface-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-tealSuccess-light text-tealSuccess mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-heading font-bold text-xl text-charcoal">
              Application Submitted!
            </h4>
            <p className="text-sm text-slateSub max-w-sm mx-auto leading-relaxed">
              Your application for <span className="font-semibold text-primary">{internship.title}</span> at {internship.companyName} has been received. You can track real-time status changes in your dashboard.
            </p>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="btn-primary w-full py-3 text-sm"
              >
                Done & View Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Capacity notice if applicable */}
            {isFull ? (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-700">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>This position has reached its maximum accepted applicant capacity.</span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-between text-xs text-primary">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tealSuccess" />
                  Verified Internship • Real-time Status Tracking
                </span>
                <span className="font-mono font-semibold">
                  {internship.maxPositions - internship.filledPositions} seats left
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {errorMessage}
              </div>
            )}

            {/* Resume Upload Box */}
            <div>
              <label className="block text-xs font-semibold uppercase font-mono text-slateSub mb-2">
                Resume Document (PDF/DOCX)
              </label>
              <div className="relative border-2 border-dashed border-surface-border hover:border-primary/40 rounded-2xl p-4 text-center transition-colors bg-surface/50">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <UploadCloud className="w-6 h-6 text-primary" />
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-charcoal">
                    <FileText className="w-4 h-4 text-accent" />
                    <span>{resumeFileName}</span>
                  </div>
                  <span className="text-[11px] text-slateSub">
                    Click to browse or drop a new file
                  </span>
                </div>
              </div>
            </div>

            {/* Portfolio / GitHub Link */}
            <div>
              <label className="block text-xs font-semibold uppercase font-mono text-slateSub mb-1.5">
                Portfolio / GitHub / LinkedIn
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2.5 text-sm bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary"
              />
            </div>

            {/* Cover Note */}
            <div>
              <label className="block text-xs font-semibold uppercase font-mono text-slateSub mb-1.5">
                Why are you a strong fit? (Cover Note)
              </label>
              <textarea
                rows={3}
                required
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Share a brief overview of relevant projects, skills, and why this role excites you..."
                className="w-full px-4 py-2.5 text-sm bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary leading-relaxed resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isFull || submitting}
                className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Submitting Application...</span>
                ) : (
                  <>
                    <span>Confirm & Submit Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default ApplyModal;
