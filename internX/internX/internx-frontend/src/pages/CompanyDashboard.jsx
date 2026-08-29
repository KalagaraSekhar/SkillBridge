import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInternships } from '../context/InternshipContext';
import StatusBadge from '../components/StatusBadge';
import {
  PlusCircle,
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  DollarSign,
  MapPin,
  FileText,
  AlertTriangle,
  X,
  ArrowRight,
  TrendingUp,
  Layers,
  MessageSquare
} from 'lucide-react';

export const CompanyDashboard = () => {
  const { user } = useAuth();
  const { internships, applications, createInternship, updateStatus, openLiveChat } = useInternships();

  const [activeTab, setActiveTab] = useState('LISTINGS'); // 'LISTINGS', 'APPLICANTS'
  const [selectedInternshipId, setSelectedInternshipId] = useState('ALL');
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);

  // New Internship Form State
  const [newRole, setNewRole] = useState({
    title: '',
    category: 'Tech',
    stipend: '$3,500 / mo',
    stipendAmount: 3500,
    durationWeeks: 12,
    durationText: '12 Weeks (Summer 2026)',
    location: 'San Francisco, CA',
    remote: true,
    maxPositions: 3,
    skillsRequired: 'React, TypeScript, Node.js',
    description: 'We are seeking an ambitious student intern to join our core engineering team to build scalable full-stack features.'
  });

  const [formLoading, setFormLoading] = useState(false);

  // Filter company's own listings
  const companyListings = internships.filter((i) => {
    if (user?.companyId) return i.companyId === user.companyId;
    if (user?.companyName) return i.companyName.toLowerCase().includes(user.companyName.toLowerCase());
    return i.companyId === 'comp-1' || i.companyName === 'NovaScale AI';
  });

  // Applications for this company's internships
  const relevantApplications = applications.filter((app) => {
    const isCompanyApp =
      (user?.companyId && app.companyId === user.companyId) ||
      companyListings.some((l) => l.id === app.internshipId) ||
      (user?.companyName && app.companyName?.toLowerCase() === user.companyName?.toLowerCase());

    if (selectedInternshipId === 'ALL') {
      return isCompanyApp;
    }
    return isCompanyApp && app.internshipId === selectedInternshipId;
  });

  // Handle Post Internship
  const handlePostInternship = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const skillsArray = newRole.skillsRequired
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await createInternship({
        ...newRole,
        companyId: user?.companyId || 'comp-1',
        companyName: user?.companyName || 'NovaScale AI',
        companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
        skillsRequired: skillsArray,
        stipendAmount: Number(newRole.stipendAmount),
        maxPositions: Number(newRole.maxPositions),
        durationWeeks: Number(newRole.durationWeeks),
        responsibilities: [
          'Design and build high-performance product components',
          'Participate in sprint retrospectives and team architecture reviews'
        ],
        requirements: [
          'Strong foundational problem-solving skills',
          'Curiosity and eagerness to learn modern production stacks'
        ],
        perks: ['1-on-1 mentorship', 'Full-time conversion pipeline', 'Hardware allowance']
      });

      setIsPostingModalOpen(false);
      setNewRole({
        title: '',
        category: 'Tech',
        stipend: '$3,500 / mo',
        stipendAmount: 3500,
        durationWeeks: 12,
        durationText: '12 Weeks (Summer 2026)',
        location: 'San Francisco, CA',
        remote: true,
        maxPositions: 3,
        skillsRequired: 'React, TypeScript, Node.js',
        description: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  // Status Action handler with pessimistic locking
  const handleAction = async (applicationId, status) => {
    try {
      await updateStatus(applicationId, status);
    } catch (err) {
      // Toast handles error display
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Company Header Card */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-heading font-extrabold text-2xl text-accent shadow-soft">
            {user?.companyName?.charAt(0) || 'N'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="mono-badge bg-white/10 text-accent border border-white/20">
                Employer Dashboard
              </span>
              <span className="flex items-center gap-1 text-xs font-mono text-tealSuccess">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Enterprise
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight">
              {user?.companyName || 'NovaScale AI'}
            </h1>
            <p className="text-xs text-primary-200">
              Manage internship pipelines, evaluate candidate submissions in real-time, and allocate capacity.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 z-10">
          <button
            type="button"
            onClick={() => openLiveChat()}
            className="btn-secondary py-3 px-5 text-xs sm:text-sm font-semibold flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-primary" />
            <span>Applicant Messages</span>
          </button>

          <button
            onClick={() => setIsPostingModalOpen(true)}
            className="btn-primary py-3 px-6 text-xs sm:text-sm font-semibold shadow-soft flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Internship</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-soft p-5 space-y-1">
          <span className="text-xs font-mono uppercase text-slateSub">Active Listings</span>
          <p className="font-heading font-bold text-2xl text-charcoal">{companyListings.length}</p>
        </div>

        <div className="card-soft p-5 space-y-1">
          <span className="text-xs font-mono uppercase text-slateSub">Total Applicants</span>
          <p className="font-heading font-bold text-2xl text-primary">{relevantApplications.length}</p>
        </div>

        <div className="card-soft p-5 space-y-1">
          <span className="text-xs font-mono uppercase text-slateSub">Shortlisted</span>
          <p className="font-heading font-bold text-2xl text-amber-600">
            {relevantApplications.filter((a) => a.status === 'SHORTLISTED').length}
          </p>
        </div>

        <div className="card-soft p-5 space-y-1">
          <span className="text-xs font-mono uppercase text-slateSub">Positions Filled</span>
          <p className="font-heading font-bold text-2xl text-tealSuccess">
            {companyListings.reduce((acc, curr) => acc + curr.filledPositions, 0)}
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-surface-border pb-1">
        <button
          onClick={() => setActiveTab('LISTINGS')}
          className={`pb-3 px-2 text-sm font-heading font-bold transition-all relative ${
            activeTab === 'LISTINGS'
              ? 'text-primary'
              : 'text-slateSub hover:text-charcoal'
          }`}
        >
          <span>Posted Internships ({companyListings.length})</span>
          {activeTab === 'LISTINGS' && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('APPLICANTS')}
          className={`pb-3 px-2 text-sm font-heading font-bold transition-all relative ${
            activeTab === 'APPLICANTS'
              ? 'text-primary'
              : 'text-slateSub hover:text-charcoal'
          }`}
        >
          <span>Candidate Pipeline ({relevantApplications.length})</span>
          {activeTab === 'APPLICANTS' && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: LISTINGS VIEW */}
      {activeTab === 'LISTINGS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {companyListings.map((listing) => {
              const isFull = listing.filledPositions >= listing.maxPositions;
              return (
                <div
                  key={listing.id}
                  className="card-soft p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 category-strip-tech"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="mono-badge bg-indigo-50 text-primary border border-indigo-200">
                        {listing.category}
                      </span>
                      {listing.remote && (
                        <span className="mono-badge bg-tealSuccess-light text-tealSuccess-dark border border-tealSuccess/30">
                          Remote
                        </span>
                      )}
                      <span className="text-xs font-mono text-slateSub">
                        {listing.durationText}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-charcoal">
                      {listing.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs font-mono text-slateSub">
                      <span>Stipend: <strong className="text-tealSuccess">{listing.stipend}</strong></span>
                      <span>•</span>
                      <span>Location: {listing.location}</span>
                    </div>
                  </div>

                  {/* Capacity Meter & Candidate Review CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-surface-border">
                    
                    {/* Capacity pill */}
                    <div className="space-y-1.5 w-44">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slateSub">Capacity</span>
                        <span className={`font-bold ${isFull ? 'text-red-500' : 'text-primary'}`}>
                          {listing.filledPositions} / {listing.maxPositions} filled
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isFull ? 'bg-red-500' : 'bg-tealSuccess'
                          }`}
                          style={{
                            width: `${(listing.filledPositions / listing.maxPositions) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* View Applicants button */}
                    <button
                      onClick={() => {
                        setSelectedInternshipId(listing.id);
                        setActiveTab('APPLICANTS');
                      }}
                      className="btn-secondary text-xs py-2 px-4 shrink-0"
                    >
                      Review Candidates
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE APPLICANTS VIEW */}
      {activeTab === 'APPLICANTS' && (
        <div className="space-y-4">
          
          {/* Filter by Internship */}
          <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-surface-border">
            <span className="text-xs font-mono uppercase font-semibold text-slateSub">
              Filter by Role:
            </span>
            <select
              value={selectedInternshipId}
              onChange={(e) => setSelectedInternshipId(e.target.value)}
              className="bg-surface font-mono text-xs px-3 py-2 rounded-xl border border-surface-border text-charcoal"
            >
              <option value="ALL">All Company Listings</option>
              {companyListings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>

          {/* Applicant Cards / Pipeline Table */}
          {relevantApplications.length === 0 ? (
            <div className="card-soft p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slateSub mx-auto" />
              <h3 className="font-heading font-bold text-base text-charcoal">
                No applicants yet for this selection
              </h3>
              <p className="text-xs text-slateSub">
                Applications will appear here immediately in real-time as students apply.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {relevantApplications.map((app) => (
                <div
                  key={app.id}
                  className="card-soft p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Student Info */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-3">
                      <h4 className="font-heading font-bold text-base text-charcoal">
                        {app.studentName}
                      </h4>
                      <StatusBadge status={app.status} />
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-tealSuccess-light text-tealSuccess">
                        {app.matchScore || 92}% Match
                      </span>
                    </div>

                    <p className="text-xs font-mono text-slateSub">
                      {app.studentUniversity} • {app.studentEmail}
                    </p>

                    <div className="p-3 rounded-xl bg-surface text-xs text-slateSub italic leading-relaxed">
                      "{app.coverNote || 'No cover note provided.'}"
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-primary pt-1">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-accent" />
                        <span className="font-semibold underline cursor-pointer">
                          {app.resumeUrl || 'Resume.pdf'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => openLiveChat()}
                        className="text-xs font-semibold text-primary hover:text-accent flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message Candidate</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions: Shortlist / Reject / Select with Capacity Logic */}
                  <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-surface-border">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(app.id, 'SHORTLISTED')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                          app.status === 'SHORTLISTED'
                            ? 'bg-amber-500 text-white'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        Shortlist
                      </button>

                      <button
                        onClick={() => handleAction(app.id, 'REJECTED')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                          app.status === 'REJECTED'
                            ? 'bg-red-500 text-white'
                            : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        }`}
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handleAction(app.id, 'SELECTED')}
                        className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                          app.status === 'SELECTED'
                            ? 'bg-tealSuccess text-white shadow-soft'
                            : 'bg-tealSuccess-light text-tealSuccess-dark border border-tealSuccess/30 hover:bg-tealSuccess hover:text-white'
                        }`}
                      >
                        {app.status === 'SELECTED' ? '✓ Selected' : 'Mark Selected (Offer)'}
                      </button>
                    </div>

                    <p className="text-[10px] font-mono text-slateSub">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* POST NEW INTERNSHIP MODAL */}
      {isPostingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-soft-lg border border-surface-border max-h-[90vh] overflow-y-auto">
            
            <div className="px-6 py-5 border-b border-surface-border flex items-center justify-between bg-surface sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-accent" />
                <h3 className="font-heading font-bold text-lg text-charcoal">
                  Post New Internship Opening
                </h3>
              </div>
              <button
                onClick={() => setIsPostingModalOpen(false)}
                className="p-1.5 rounded-full text-slateSub hover:text-charcoal hover:bg-surface-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostInternship} className="p-6 sm:p-8 space-y-5">
              
              <div className="floating-group">
                <input
                  type="text"
                  id="title"
                  required
                  value={newRole.title}
                  onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
                  placeholder=" "
                  className="floating-input"
                />
                <label htmlFor="title" className="floating-label">
                  Internship Title (e.g. Frontend Engineering Intern)
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-semibold text-slateSub mb-1.5">
                    Category
                  </label>
                  <select
                    value={newRole.category}
                    onChange={(e) => setNewRole({ ...newRole, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-surface-border rounded-xl text-sm"
                  >
                    <option value="Tech">Tech & Engineering</option>
                    <option value="Design">Design (UI/UX)</option>
                    <option value="Marketing">Marketing & Growth</option>
                    <option value="Data">Data & AI</option>
                    <option value="Finance">Finance & Strategy</option>
                  </select>
                </div>

                <div className="floating-group">
                  <input
                    type="number"
                    id="maxPositions"
                    required
                    min={1}
                    value={newRole.maxPositions}
                    onChange={(e) => setNewRole({ ...newRole, maxPositions: Number(e.target.value) })}
                    placeholder=" "
                    className="floating-input"
                  />
                  <label htmlFor="maxPositions" className="floating-label">
                    Max Capacity / Accepted Positions
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="floating-group">
                  <input
                    type="text"
                    id="stipend"
                    required
                    value={newRole.stipend}
                    onChange={(e) => setNewRole({ ...newRole, stipend: e.target.value })}
                    placeholder=" "
                    className="floating-input"
                  />
                  <label htmlFor="stipend" className="floating-label">
                    Monthly Stipend (e.g. $3,500 / mo)
                  </label>
                </div>

                <div className="floating-group">
                  <input
                    type="text"
                    id="durationText"
                    required
                    value={newRole.durationText}
                    onChange={(e) => setNewRole({ ...newRole, durationText: e.target.value })}
                    placeholder=" "
                    className="floating-input"
                  />
                  <label htmlFor="durationText" className="floating-label">
                    Duration (e.g. 12 Weeks)
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="floating-group">
                  <input
                    type="text"
                    id="location"
                    required
                    value={newRole.location}
                    onChange={(e) => setNewRole({ ...newRole, location: e.target.value })}
                    placeholder=" "
                    className="floating-input"
                  />
                  <label htmlFor="location" className="floating-label">
                    Location (e.g. San Francisco, CA)
                  </label>
                </div>

                <label className="flex items-center gap-3 p-3 bg-surface border border-surface-border rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRole.remote}
                    onChange={(e) => setNewRole({ ...newRole, remote: e.target.checked })}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-xs font-semibold text-charcoal">
                    Remote Work Allowed
                  </span>
                </label>
              </div>

              <div className="floating-group">
                <input
                  type="text"
                  id="skillsRequired"
                  required
                  value={newRole.skillsRequired}
                  onChange={(e) => setNewRole({ ...newRole, skillsRequired: e.target.value })}
                  placeholder=" "
                  className="floating-input"
                />
                <label htmlFor="skillsRequired" className="floating-label">
                  Skills Required (comma separated, e.g. React, TypeScript, Figma)
                </label>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase font-semibold text-slateSub mb-1.5">
                  Job Description & Scope
                </label>
                <textarea
                  rows={4}
                  required
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  className="w-full px-4 py-3 bg-surface border border-surface-border rounded-xl text-xs sm:text-sm leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostingModalOpen(false)}
                  className="btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-primary text-xs py-3 px-6 shadow-soft"
                >
                  {formLoading ? 'Publishing...' : 'Publish Internship'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default CompanyDashboard;
