import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useInternships } from '../context/InternshipContext';
import { useSocket } from '../context/SocketContext';
import ApplyModal from '../components/ApplyModal';
import AtsMatcherModal from '../components/AtsMatcherModal';
import InternshipCard from '../components/InternshipCard';
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Share2,
  Bookmark,
  ShieldCheck,
  Globe,
  Award,
  Zap,
  MessageSquare,
  Activity
} from 'lucide-react';

export const InternshipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { internships, openLiveChat } = useInternships();
  const { isConnected } = useSocket();

  const [internship, setInternship] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [atsModalOpen, setAtsModalOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [liveViewers, setLiveViewers] = useState(3);

  useEffect(() => {
    const found = internships.find((i) => i.id === id);
    if (found) {
      setInternship(found);
    }
  }, [id, internships]);

  useEffect(() => {
    // Generate realistic live viewers count
    setLiveViewers(Math.floor(3 + Math.random() * 4));
  }, [id]);

  if (!internship) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-heading font-bold text-2xl text-charcoal">
          Internship Listing Not Found
        </h2>
        <p className="text-xs text-slateSub">
          This internship may have closed or expired.
        </p>
        <Link to="/internships" className="btn-primary text-xs py-2.5 px-5">
          Browse All Internships
        </Link>
      </div>
    );
  }

  const isFull = internship.filledPositions >= internship.maxPositions;
  const slotsRemaining = Math.max(0, internship.maxPositions - internship.filledPositions);

  // Similar internships
  const similarListings = internships
    .filter((i) => i.id !== internship.id && i.category === internship.category)
    .slice(0, 2);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation & Live Telemetry Row */}
      <div className="flex items-center justify-between">
        <Link
          to="/internships"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slateSub hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all internships</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>🔥 {liveViewers} candidates viewing right now</span>
          </span>
        </div>
      </div>

      {/* Top Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-surface-border space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Company & Role Header */}
          <div className="flex items-start gap-4 sm:gap-5">
            <img
              src={internship.companyLogo}
              alt={internship.companyName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-surface-border p-1 bg-white shadow-soft shrink-0"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-semibold text-slateSub uppercase">
                  {internship.companyName}
                </span>
                <span className="mono-badge bg-indigo-50 text-primary border border-indigo-200">
                  {internship.category}
                </span>
                {internship.remote && (
                  <span className="mono-badge bg-tealSuccess-light text-tealSuccess-dark border border-tealSuccess/30">
                    Remote Eligible
                  </span>
                )}
                <span className="mono-badge bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Enterprise
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal tracking-tight">
                {internship.title}
              </h1>
              <p className="text-xs font-mono text-slateSub">
                Posted {new Date(internship.postedAt || Date.now()).toLocaleDateString()} • Real-Time Concurrency Guarded
              </p>
            </div>
          </div>

          {/* Top Actions: AI ATS Analyzer, Share, Bookmark, Apply */}
          <div className="flex flex-wrap items-center gap-3">
            {/* AI ATS Analyzer CTA */}
            <button
              onClick={() => setAtsModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-primary to-indigo-700 text-white text-xs font-semibold shadow-soft hover:shadow-indigo-glow transition-all flex items-center gap-2"
              title="Test Resume Compatibility"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>AI ATS Match Score</span>
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl border border-surface-border hover:bg-surface-muted text-slateSub hover:text-charcoal transition-colors relative"
              title="Share Listing"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-charcoal text-white text-[10px] font-mono rounded shadow">
                  Link Copied!
                </span>
              )}
            </button>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-3 rounded-2xl border transition-colors ${
                bookmarked
                  ? 'border-accent bg-accent-light text-accent'
                  : 'border-surface-border hover:bg-surface-muted text-slateSub hover:text-charcoal'
              }`}
              title="Save for Later"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => setApplyModalOpen(true)}
              disabled={isFull}
              className={`btn-primary px-8 py-3 text-sm font-semibold shadow-soft ${
                isFull ? 'bg-gray-300 cursor-not-allowed opacity-60' : ''
              }`}
            >
              {isFull ? 'Positions Filled' : 'Apply for this Role'}
            </button>
          </div>
        </div>

        {/* Highlight Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-surface-border">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-slateSub">Monthly Stipend</span>
            <div className="flex items-center gap-1.5 font-heading font-bold text-lg text-tealSuccess">
              <DollarSign className="w-4 h-4" />
              <span>{internship.stipend}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-slateSub">Duration</span>
            <div className="flex items-center gap-1.5 font-heading font-bold text-lg text-primary">
              <Clock className="w-4 h-4" />
              <span>{internship.durationText || `${internship.durationWeeks} Weeks`}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-slateSub">Location</span>
            <div className="flex items-center gap-1.5 font-heading font-bold text-lg text-charcoal">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{internship.location}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-slateSub">Live Capacity Status</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-base text-charcoal">
              <Users className="w-4 h-4 text-slateSub" />
              <span className={isFull ? 'text-red-500' : 'text-primary'}>
                {internship.filledPositions} of {internship.maxPositions} accepted
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Job Description & Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-surface-border space-y-4">
            <h3 className="font-heading font-bold text-lg text-charcoal">
              About the Internship
            </h3>
            <p className="text-sm text-slateSub leading-relaxed">
              {internship.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {internship.responsibilities && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-surface-border space-y-4">
              <h3 className="font-heading font-bold text-lg text-charcoal">
                Key Responsibilities
              </h3>
              <ul className="space-y-3">
                {internship.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slateSub">
                    <CheckCircle2 className="w-4 h-4 text-tealSuccess shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Skills */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-surface-border space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-charcoal">
                Skills & Requirements
              </h3>
              <button
                onClick={() => setAtsModalOpen(true)}
                className="text-xs font-mono font-semibold text-primary hover:text-accent flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Check ATS Match</span>
              </button>
            </div>
            
            {/* JetBrains Mono Skills Badges */}
            <div className="flex flex-wrap gap-2">
              {internship.skillsRequired?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-surface border border-surface-border text-xs font-mono font-semibold text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>

            {internship.requirements && (
              <ul className="space-y-2.5 pt-2">
                {internship.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slateSub">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Perks & Benefits */}
          {internship.perks && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-surface-border space-y-4">
              <h3 className="font-heading font-bold text-lg text-charcoal">
                Perks & Growth Opportunities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {internship.perks.map((perk, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-surface-muted/60 border border-surface-border flex items-center gap-3 text-xs font-medium text-charcoal"
                  >
                    <Award className="w-4 h-4 text-accent shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Company Snapshot & Floating Apply Card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Company Card */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-surface-border space-y-4">
            <h3 className="font-heading font-bold text-base text-charcoal">
              About {internship.companyName}
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={internship.companyLogo}
                alt={internship.companyName}
                className="w-12 h-12 rounded-xl object-cover border border-surface-border p-0.5"
              />
              <div>
                <p className="font-heading font-bold text-sm text-charcoal">{internship.companyName}</p>
                <p className="text-xs font-mono text-slateSub">{internship.location}</p>
              </div>
            </div>

            <p className="text-xs text-slateSub leading-relaxed">
              Leading innovator dedicated to mentoring high-potential student interns with hands-on project ownership.
            </p>

            <button
              type="button"
              onClick={() => openLiveChat()}
              className="w-full py-2.5 px-4 rounded-xl border border-primary/20 bg-primary-50 hover:bg-primary-100 text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-accent" />
              <span>Ask Recruiter a Question</span>
            </button>
          </div>

          {/* Capacity Safeguard Pill */}
          <div className="bg-primary-50 rounded-3xl p-6 border border-primary-200 space-y-3">
            <h4 className="font-heading font-bold text-sm text-primary">
              Real-Time Capacity Guarantee
            </h4>
            <p className="text-xs text-primary-700 leading-relaxed">
              InternX ensures fair selection through concurrency-safe capacity locking. Once all positions are filled, submissions are locked to protect student effort.
            </p>
            <div className="flex items-center justify-between text-xs font-mono font-bold pt-1 text-primary">
              <span>Remaining Openings:</span>
              <span className="text-accent">{slotsRemaining} Slots</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-primary-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${(internship.filledPositions / internship.maxPositions) * 100}%` }}
              />
            </div>
          </div>

          {/* Sticky Bottom Apply CTA */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-surface-border space-y-3">
            <button
              onClick={() => setApplyModalOpen(true)}
              disabled={isFull}
              className={`btn-primary w-full py-3.5 text-sm font-semibold shadow-soft ${
                isFull ? 'bg-gray-300 cursor-not-allowed opacity-60' : ''
              }`}
            >
              {isFull ? 'Capacity Full' : 'Apply with Profile Resume'}
            </button>
            <p className="text-[11px] text-center font-mono text-slateSub">
              Takes less than 60 seconds • Track status in live dashboard
            </p>
          </div>

        </div>

      </div>

      {/* Similar Internships Section */}
      {similarListings.length > 0 && (
        <div className="space-y-4 pt-6">
          <h2 className="font-heading font-bold text-xl text-charcoal">
            Similar Openings in {internship.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {similarListings.map((item) => (
              <InternshipCard
                key={item.id}
                internship={item}
                onApply={() => {
                  setInternship(item);
                  setApplyModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      <ApplyModal
        internship={internship}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />

      {/* ATS Matcher Modal */}
      <AtsMatcherModal
        internship={internship}
        isOpen={atsModalOpen}
        onClose={() => setAtsModalOpen(false)}
        onProceedToApply={() => setApplyModalOpen(true)}
      />

    </div>
  );
};

export default InternshipDetailPage;
