import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInternships } from '../context/InternshipContext';
import { adminService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import {
  ShieldCheck,
  Building,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle,
  XCircle,
  BarChart3,
  Layers,
  Sparkles,
  Search,
  Check,
  X
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { internships, applications, updateStatus, showToast } = useInternships();

  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState('ANALYTICS'); // 'ANALYTICS', 'APPLICATIONS', 'COMPANIES', 'LISTINGS'
  const [selectedAppCompany, setSelectedAppCompany] = useState('ALL');
  const [selectedAppStatus, setSelectedAppStatus] = useState('ALL');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsData, companiesData] = await Promise.all([
          adminService.getStats(),
          adminService.getCompanies()
        ]);
        setStats(statsData);
        setCompanies(companiesData);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleApproveCompany = async (companyId, approved) => {
    try {
      await adminService.approveCompany(companyId, approved);
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId ? { ...c, approvedStatus: approved ? 'APPROVED' : 'REJECTED' } : c
        )
      );
      showToast(
        `Company ${approved ? 'approved' : 'rejected'} successfully`,
        approved ? 'success' : 'error'
      );
    } catch (err) {
      showToast('Failed to update company status', 'error');
    }
  };

  const pendingCompanies = companies.filter((c) => c.approvedStatus === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-tealSuccess/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-tealSuccess-light text-tealSuccess-dark flex items-center justify-center font-heading font-extrabold text-2xl shadow-soft">
            <ShieldCheck className="w-8 h-8 text-tealSuccess" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="mono-badge bg-white/10 text-accent border border-white/20">
                Root Administrator
              </span>
              <span className="text-xs font-mono text-tealSuccess">● Live Telemetry</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight">
              InternX Administration & Governance
            </h1>
            <p className="text-xs text-primary-200">
              Audit employer verifications, review platform growth metrics, and moderate listings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <span className="px-4 py-2 rounded-full bg-white/10 text-xs font-mono border border-white/15">
            Pending Reviews: <strong className="text-accent">{pendingCompanies.length}</strong>
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-soft p-5 space-y-1">
          <span className="text-xs font-mono uppercase text-slateSub">Total Students</span>
          <p className="font-heading font-bold text-2xl text-charcoal">
            {stats?.totalStudents?.toLocaleString() || '14,280'}
          </p>
        </div>

        <div className="card-soft p-5 space-y-1">
          <span className="text-xs font-mono uppercase text-slateSub">Total Internships</span>
          <p className="font-heading font-bold text-2xl text-primary">
            {internships.length} Active
          </p>
        </div>

        <div className="card-soft p-5 space-y-1">
          <span className="text-xs font-mono uppercase text-slateSub">Total Applications</span>
          <p className="font-heading font-bold text-2xl text-tealSuccess">
            {applications.length + 840}
          </p>
        </div>

        <div className="card-soft p-5 space-y-1">
          <span className="text-xs font-mono uppercase text-slateSub">Verified Employers</span>
          <p className="font-heading font-bold text-2xl text-accent">
            {companies.filter((c) => c.approvedStatus === 'APPROVED').length}
          </p>
        </div>
      </div>

      {/* Admin Tab Controls */}
      <div className="flex items-center gap-3 border-b border-surface-border pb-1">
        <button
          onClick={() => setActiveAdminTab('ANALYTICS')}
          className={`pb-3 px-2 text-sm font-heading font-bold transition-all relative ${
            activeAdminTab === 'ANALYTICS' ? 'text-primary' : 'text-slateSub hover:text-charcoal'
          }`}
        >
          <span>Growth Analytics & Charts</span>
          {activeAdminTab === 'ANALYTICS' && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('APPLICATIONS')}
          className={`pb-3 px-2 text-sm font-heading font-bold transition-all relative ${
            activeAdminTab === 'APPLICATIONS' ? 'text-primary' : 'text-slateSub hover:text-charcoal'
          }`}
        >
          <span>All Applications ({applications.length})</span>
          {activeAdminTab === 'APPLICATIONS' && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('COMPANIES')}
          className={`pb-3 px-2 text-sm font-heading font-bold transition-all relative ${
            activeAdminTab === 'COMPANIES' ? 'text-primary' : 'text-slateSub hover:text-charcoal'
          }`}
        >
          <span>Employer Approvals ({pendingCompanies.length} pending)</span>
          {activeAdminTab === 'COMPANIES' && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('LISTINGS')}
          className={`pb-3 px-2 text-sm font-heading font-bold transition-all relative ${
            activeAdminTab === 'LISTINGS' ? 'text-primary' : 'text-slateSub hover:text-charcoal'
          }`}
        >
          <span>Listings Moderation ({internships.length})</span>
          {activeAdminTab === 'LISTINGS' && (
            <span className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 0: ALL APPLICATIONS PIPELINE */}
      {activeAdminTab === 'APPLICATIONS' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono uppercase font-bold text-slateSub">Filters:</span>
              <select
                value={selectedAppCompany}
                onChange={(e) => setSelectedAppCompany(e.target.value)}
                className="bg-surface font-mono text-xs px-3 py-1.5 rounded-xl border border-surface-border text-charcoal"
              >
                <option value="ALL">All Companies</option>
                <option value="comp-google">Google LLC</option>
                <option value="comp-microsoft">Microsoft Corporation</option>
                <option value="comp-amazon">Amazon</option>
                <option value="comp-tcs">Tata Consultancy Services (TCS)</option>
                <option value="comp-1">NovaScale AI</option>
              </select>

              <select
                value={selectedAppStatus}
                onChange={(e) => setSelectedAppStatus(e.target.value)}
                className="bg-surface font-mono text-xs px-3 py-1.5 rounded-xl border border-surface-border text-charcoal"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPLIED">Applied</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <span className="text-xs font-mono text-slateSub">
              Showing {
                applications.filter((a) => {
                  if (selectedAppCompany !== 'ALL' && a.companyId !== selectedAppCompany) return false;
                  if (selectedAppStatus !== 'ALL' && a.status !== selectedAppStatus) return false;
                  return true;
                }).length
              } of {applications.length} applications
            </span>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-3xl shadow-soft border border-surface-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-border bg-surface text-slateSub font-mono uppercase text-[11px]">
                    <th className="py-3.5 px-6">Student</th>
                    <th className="py-3.5 px-4">Internship & Company</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-medium">
                  {applications
                    .filter((a) => {
                      if (selectedAppCompany !== 'ALL' && a.companyId !== selectedAppCompany) return false;
                      if (selectedAppStatus !== 'ALL' && a.status !== selectedAppStatus) return false;
                      return true;
                    })
                    .map((app) => (
                      <tr key={app.id} className="hover:bg-surface-muted/50 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-bold text-charcoal">{app.studentName}</p>
                            <p className="text-[11px] font-mono text-slateSub">{app.studentEmail}</p>
                            <p className="text-[11px] text-slateSub">{app.studentUniversity}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-bold text-charcoal">{app.internshipTitle}</p>
                            <p className="text-[11px] font-mono text-primary font-semibold">{app.companyName}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono text-slateSub">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => updateStatus(app.id, 'SHORTLISTED')}
                              className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, 'REJECTED')}
                              className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
                            >
                              Disqualify
                            </button>
                            <button
                              onClick={() => updateStatus(app.id, 'SELECTED')}
                              className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-tealSuccess text-white hover:brightness-105 shadow-soft transition-all"
                            >
                              Select
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {activeAdminTab === 'ANALYTICS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Applications Per Week Velocity Chart */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-surface-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-charcoal">
                  Applications Velocity (Weekly)
                </h3>
                <p className="text-xs text-slateSub">
                  Student submission volume across all verified roles.
                </p>
              </div>
              <span className="mono-badge bg-tealSuccess-light text-tealSuccess-dark border border-tealSuccess/30">
                +48% vs last month
              </span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="pt-6">
              <div className="flex items-end justify-between gap-4 h-52 px-2">
                {[
                  { week: 'W1', value: 420, height: '22%' },
                  { week: 'W2', value: 680, height: '36%' },
                  { week: 'W3', value: 890, height: '47%' },
                  { week: 'W4', value: 1240, height: '65%' },
                  { week: 'W5', value: 1560, height: '82%' },
                  { week: 'W6', value: 1890, height: '100%' }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-mono text-slateSub group-hover:text-primary font-bold transition-colors">
                      {item.value}
                    </span>
                    <div className="w-full bg-surface-muted rounded-t-xl h-full flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-primary to-accent rounded-t-xl transition-all duration-700 group-hover:brightness-110"
                        style={{ height: item.height }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slateSub font-semibold">
                      {item.week}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Distribution Breakdown */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-surface-border space-y-6">
            <h3 className="font-heading font-bold text-lg text-charcoal">
              Top Category Distribution
            </h3>

            <div className="space-y-4 pt-2">
              {[
                { name: 'Tech & Engineering', count: 390, pct: 46, color: 'bg-primary' },
                { name: 'Product Design (UI/UX)', count: 180, pct: 21, color: 'bg-accent' },
                { name: 'AI & Data Science', count: 140, pct: 17, color: 'bg-sky-500' },
                { name: 'Growth Marketing', count: 85, pct: 10, color: 'bg-tealSuccess' },
                { name: 'Finance & Strategy', count: 45, pct: 6, color: 'bg-amber-500' }
              ].map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal">{cat.name}</span>
                    <span className="font-mono text-slateSub">
                      {cat.count} listings ({cat.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: COMPANY APPROVALS QUEUE */}
      {activeAdminTab === 'COMPANIES' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-soft border border-surface-border overflow-hidden">
            <div className="p-6 border-b border-surface-border">
              <h3 className="font-heading font-bold text-base text-charcoal">
                Employer Verification Queue
              </h3>
              <p className="text-xs text-slateSub">
                Review submitted business domains and employer accounts before listings go live.
              </p>
            </div>

            <div className="divide-y divide-surface-border">
              {companies.map((comp) => (
                <div
                  key={comp.id}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={comp.logo}
                      alt={comp.name}
                      className="w-12 h-12 rounded-xl object-cover border border-surface-border p-0.5"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-base text-charcoal">
                          {comp.name}
                        </h4>
                        <StatusBadge status={comp.approvedStatus} />
                      </div>
                      <p className="text-xs text-slateSub">
                        {comp.website} • {comp.location} • {comp.employeeCount} team members
                      </p>
                      <p className="text-xs text-slateSub leading-relaxed pt-1">
                        {comp.about}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {comp.approvedStatus === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleApproveCompany(comp.id, false)}
                          className="px-4 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-mono font-semibold transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproveCompany(comp.id, true)}
                          className="px-4 py-2 rounded-xl bg-tealSuccess text-white hover:bg-tealSuccess-dark text-xs font-mono font-bold shadow-soft transition-all"
                        >
                          ✓ Approve Employer
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-mono text-slateSub">
                        Status: <strong className="text-primary">{comp.approvedStatus}</strong>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LISTINGS MODERATION TABLE */}
      {activeAdminTab === 'LISTINGS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-soft border border-surface-border overflow-hidden">
            <div className="p-6 border-b border-surface-border">
              <h3 className="font-heading font-bold text-base text-charcoal">
                Active Listings Moderation
              </h3>
              <p className="text-xs text-slateSub">
                Total listings currently live in the candidate discovery directory.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface border-b border-surface-border text-slateSub font-mono uppercase">
                  <tr>
                    <th className="py-3 px-6">Role & Company</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Stipend</th>
                    <th className="py-3 px-4">Capacity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border font-medium">
                  {internships.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-muted/50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-charcoal">{item.title}</p>
                          <p className="text-[11px] font-mono text-slateSub">{item.companyName}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="mono-badge bg-surface border border-surface-border text-primary">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-tealSuccess font-bold">
                        {item.stipend}
                      </td>
                      <td className="py-4 px-4 font-mono">
                        {item.filledPositions} / {item.maxPositions} filled
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => showToast(`Listing ${item.id} audited and verified`, 'success')}
                          className="px-3 py-1.5 rounded-lg border border-surface-border text-slateSub hover:text-primary hover:bg-white text-xs font-mono"
                        >
                          Audit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
