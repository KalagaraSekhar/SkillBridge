import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInternships } from '../context/InternshipContext';
import StatusBadge from '../components/StatusBadge';
import InternshipCard from '../components/InternshipCard';
import ApplyModal from '../components/ApplyModal';
import {
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  UploadCloud,
  ChevronRight,
  Award,
  AlertCircle,
  Eye,
  MessageSquare
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { applications, internships, openLiveChat } = useInternships();
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'APPLIED', 'SHORTLISTED', 'SELECTED'

  // Student specific applications (matches by studentId or logged-in studentEmail)
  const myApplications = applications.filter(
    (app) => app.studentId === (user?.id || 'usr-1') || (user?.email && app.studentEmail?.toLowerCase() === user.email.toLowerCase())
  );

  const selectedOffers = myApplications.filter((a) => a.status === 'SELECTED');

  // Calculate profile completion
  const profileChecks = [
    { label: 'Account Email Verified', completed: user?.emailVerified ?? true },
    { label: 'Resume Uploaded', completed: !!user?.resumeUrl },
    { label: 'University & Major Set', completed: !!user?.university },
    { label: 'Skills Tagged (3+ skills)', completed: (user?.skills?.length || 0) >= 3 }
  ];
  const completedCount = profileChecks.filter((c) => c.completed).length;
  const completionPercentage = Math.round((completedCount / profileChecks.length) * 100);

  // Filter applications by tab
  const filteredApps = myApplications.filter((app) => {
    if (activeTab === 'ALL') return true;
    return app.status === activeTab;
  });

  // Recommended Internships
  const recommendedInternships = internships.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. TOP GREETING & PROFILE BANNER */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* User Info */}
          <div className="lg:col-span-7 flex items-center gap-5">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-accent shadow-soft"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="mono-badge bg-white/10 text-accent border border-white/20">
                  Student Portal
                </span>
                <span className="flex items-center gap-1 text-xs font-mono text-tealSuccess">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live Synced
                </span>
              </div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight">
                Welcome back, {user?.name || 'Alex'}!
              </h1>
              <p className="text-xs sm:text-sm text-primary-200">
                {user?.university || 'Stanford University'} • {user?.major || 'Computer Science & Design'}
              </p>
            </div>
          </div>

          {/* Profile Completion Meter */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-primary-200">Profile Strength</span>
              <span className="font-bold text-accent">{completionPercentage}% Completed</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-primary-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-tealSuccess to-accent rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-primary-200 pt-1">
              <span>{completedCount} of {profileChecks.length} checklist items finished</span>
              <Link to="/profile" className="text-accent hover:underline font-semibold flex items-center gap-0.5">
                <span>Update Profile</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Offer Alert Banner if candidate was SELECTED */}
      {selectedOffers.length > 0 && (
        <div className="bg-tealSuccess-light/80 border border-tealSuccess/40 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-tealSuccess text-white flex items-center justify-center font-heading font-bold text-xl shadow-soft shrink-0">
              🎉
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-charcoal">
                Offer Received for {selectedOffers[0].internshipTitle}!
              </h3>
              <p className="text-xs text-slateSub">
                {selectedOffers[0].companyName} has officially marked your application as SELECTED. Open chat with recruiter to confirm onboarding.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openLiveChat()}
            className="px-5 py-2.5 rounded-xl bg-tealSuccess text-white text-xs font-bold shadow-soft hover:brightness-105 transition-all shrink-0 flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Hiring Team</span>
          </button>
        </div>
      )}

      {/* 2. STATS QUICK ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-soft p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slateSub">Applied</span>
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <p className="font-heading font-bold text-2xl text-charcoal">{myApplications.length}</p>
        </div>

        <div className="card-soft p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slateSub">Shortlisted</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-heading font-bold text-2xl text-amber-600">
            {myApplications.filter((a) => a.status === 'SHORTLISTED').length}
          </p>
        </div>

        <div className="card-soft p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slateSub">Selected / Offers</span>
            <Award className="w-4 h-4 text-tealSuccess" />
          </div>
          <p className="font-heading font-bold text-2xl text-tealSuccess">
            {myApplications.filter((a) => a.status === 'SELECTED').length}
          </p>
        </div>

        <div className="card-soft p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slateSub">Resume File</span>
            <FileText className="w-4 h-4 text-accent" />
          </div>
          <p className="font-mono text-xs font-semibold text-charcoal truncate pt-1">
            {user?.resumeUrl || 'Alex_Rivera_Resume_2026.pdf'}
          </p>
        </div>
      </div>

      {/* 3. APPLICATION TRACKER SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-xl text-charcoal">
              My Internship Applications
            </h2>
            <p className="text-xs text-slateSub">
              Live status updates direct from verified company hiring teams.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded-2xl border border-surface-border text-xs font-mono font-semibold">
            {['ALL', 'APPLIED', 'SHORTLISTED', 'SELECTED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-primary shadow-soft-sm'
                    : 'text-slateSub hover:text-charcoal'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredApps.length === 0 ? (
          <div className="card-soft p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-muted text-slateSub mx-auto flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-charcoal">
              No applications in "{activeTab}" status
            </h3>
            <p className="text-xs text-slateSub max-w-sm mx-auto">
              Explore open internship positions and submit your application with one click.
            </p>
            <Link to="/internships" className="btn-primary text-xs py-2.5 px-5">
              Browse Openings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="card-soft p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 category-strip-tech transition-all"
              >
                {/* Left: Role & Company Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={app.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                    alt={app.companyName}
                    className="w-12 h-12 rounded-xl object-cover border border-surface-border p-0.5 bg-white shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slateSub font-semibold">
                        {app.companyName}
                      </span>
                      <span className="text-xs text-slateSub">•</span>
                      <span className="text-xs font-mono text-slateSub">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                      <span className="mono-badge bg-tealSuccess-light text-tealSuccess font-bold">
                        {app.matchScore || 92}% Match
                      </span>
                    </div>
                    <Link
                      to={`/internships/${app.internshipId}`}
                      className="font-heading font-bold text-base text-charcoal hover:text-primary transition-colors line-clamp-1"
                    >
                      {app.internshipTitle}
                    </Link>
                    <p className="text-xs text-slateSub line-clamp-1 italic">
                      "{app.coverNote || 'Application submitted with profile resume'}"
                    </p>
                  </div>
                </div>

                {/* Right: Status Pill & Recruiter Chat CTA */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-surface-border">
                  <div className="text-right">
                    <StatusBadge status={app.status} />
                    <p className="text-[10px] font-mono text-slateSub mt-1">
                      {app.stipend}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openLiveChat()}
                    className="p-2.5 rounded-full bg-surface-muted hover:bg-primary-50 text-slateSub hover:text-primary transition-colors"
                    title="Chat with Recruiter"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <Link
                    to={`/internships/${app.internshipId}`}
                    className="p-2.5 rounded-full bg-surface-muted hover:bg-primary-50 text-slateSub hover:text-primary transition-colors"
                    title="View Listing Details"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. RECOMMENDED INTERNSHIPS FOR YOU */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-xl text-charcoal">
              Recommended for Your Skills
            </h2>
            <p className="text-xs text-slateSub">
              Matched based on your profile tags and verified coursework.
            </p>
          </div>
          <Link
            to="/internships"
            className="text-xs font-semibold text-primary hover:text-accent flex items-center gap-1"
          >
            <span>See all matches</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedInternships.map((item) => (
            <InternshipCard
              key={item.id}
              internship={item}
              onApply={(selected) => setSelectedInternship(selected)}
            />
          ))}
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        internship={selectedInternship}
        isOpen={!!selectedInternship}
        onClose={() => setSelectedInternship(null)}
      />

    </div>
  );
};

export default StudentDashboard;
