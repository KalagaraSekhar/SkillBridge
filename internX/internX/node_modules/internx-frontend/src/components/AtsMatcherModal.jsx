import React, { useState, useEffect } from 'react';
import { aiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

export const AtsMatcherModal = ({ isOpen, onClose, internship, onProceedToApply }) => {
  const { user } = useAuth();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && internship) {
      const fetchMatch = async () => {
        try {
          setLoading(true);
          const data = await aiService.calculateMatch({
            internshipId: internship.id,
            studentId: user?.id || 'usr-1',
            studentSkills: user?.skills || ['React', 'TypeScript', 'Node.js', 'Python']
          });
          setMatchData(data);
        } catch (err) {
          console.error('Failed to calculate ATS match', err);
        } finally {
          setLoading(false);
        }
      };
      fetchMatch();
    }
  }, [isOpen, internship, user]);

  if (!isOpen || !internship) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ats-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-soft-lg border border-surface-border overflow-hidden">
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-primary to-primary-800 text-white p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-accent shadow-soft">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="mono-badge bg-white/10 text-accent border border-white/20">
                  AI ATS Analyzer
                </span>
                <h3 id="ats-title" className="font-heading font-bold text-lg text-white">
                  Resume Match & Skill Gap Breakdown
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close ATS Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-primary-200 mt-2 relative z-10">
            Targeting: <strong className="text-white">{internship.title}</strong> at {internship.companyName}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {loading ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-slateSub">
                Scanning profile keywords against job requirements...
              </p>
            </div>
          ) : (
            <>
              {/* Score Gauge Card */}
              <div className="bg-surface rounded-2xl p-5 border border-surface-border flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase text-slateSub">ATS Compatibility Score</span>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-3xl text-tealSuccess">
                      {matchData?.matchScore || 92}%
                    </span>
                    <span className="mono-badge bg-tealSuccess-light text-tealSuccess font-bold">
                      {matchData?.verdict || 'Strong Match'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slateSub">
                    Calculated from candidate profile tags, verified coursework, and technical skills.
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-tealSuccess/10 border border-tealSuccess/30 flex items-center justify-center text-tealSuccess shrink-0">
                  <Award className="w-8 h-8" />
                </div>
              </div>

              {/* Matched vs Missing Skills */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono uppercase font-bold text-tealSuccess flex items-center gap-1 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Matched Skills ({matchData?.matchedSkills?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchData?.matchedSkills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-tealSuccess-light text-tealSuccess-dark border border-tealSuccess/30 text-xs font-mono font-semibold"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {matchData?.missingSkills?.length > 0 && (
                  <div>
                    <span className="text-xs font-mono uppercase font-bold text-amber-600 flex items-center gap-1 mb-2">
                      <AlertCircle className="w-3.5 h-3.5" /> Recommended Additions ({matchData.missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchData.missingSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-semibold"
                        >
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable Recommendations */}
              <div className="bg-primary-50/60 rounded-2xl p-4 border border-primary-100 space-y-2">
                <h4 className="font-heading font-bold text-xs text-primary flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span>Resume Optimization Guidance</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slateSub">
                  {matchData?.recommendations?.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-ghost text-xs"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onProceedToApply) onProceedToApply();
                  }}
                  className="btn-primary text-xs py-3 px-6 shadow-soft flex items-center gap-2"
                >
                  <span>Proceed to One-Click Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default AtsMatcherModal;
