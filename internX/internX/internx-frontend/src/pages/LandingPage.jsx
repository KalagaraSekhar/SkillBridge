import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInternships } from '../context/InternshipContext';
import InternshipCard from '../components/InternshipCard';
import ApplyModal from '../components/ApplyModal';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Briefcase,
  Users,
  Compass,
  FileCheck,
  Zap,
  Star,
  Layers,
  Search
} from 'lucide-react';

export const LandingPage = () => {
  const { internships } = useInternships();
  const navigate = useNavigate();
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [heroSearch, setHeroSearch] = useState('');

  const featuredInternships = internships.slice(0, 3);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/internships?search=${encodeURIComponent(heroSearch)}`);
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. ASYMMETRIC HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-24">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-accent-light/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Bold Asymmetric Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-xs font-mono font-semibold text-primary">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Next-Gen Student Internship Portal</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              </div>

              {/* H1 Heading (Sora) */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.15]">
                Where Students Meet{' '}
                <span className="text-primary relative inline-block">
                  Real Experience
                  <svg className="absolute left-0 -bottom-2 w-full h-3 text-accent" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 15 Q50 0 100 15" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
                .
              </h1>

              {/* Subheading */}
              <p className="text-slateSub text-base sm:text-lg max-w-xl leading-relaxed font-normal">
                Discover hand-vetted internships at high-growth tech companies, design studios, and innovators. Verified OTP security, zero spam, and instant status tracking.
              </p>

              {/* Hero Search Box */}
              <form onSubmit={handleHeroSearch} className="max-w-lg relative">
                <div className="flex items-center bg-white p-2 rounded-2xl shadow-soft border border-surface-border hover:border-primary/40 transition-colors">
                  <Search className="w-5 h-5 text-slateSub ml-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Try 'React', 'Product Design', 'Machine Learning'..."
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-charcoal bg-transparent focus:outline-none placeholder:text-slateSub/70"
                  />
                  <button
                    type="submit"
                    className="btn-primary text-xs py-2.5 px-5 shrink-0"
                  >
                    Find Roles
                  </button>
                </div>
              </form>

              {/* CTA Group & Social Proof */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/internships"
                  className="btn-dark gap-2 text-sm"
                >
                  <span>Explore All Internships</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/register"
                  className="btn-secondary text-sm"
                >
                  Create Student Account
                </Link>
              </div>

              {/* Mini trust row */}
              <div className="flex items-center gap-6 pt-4 text-xs font-mono text-slateSub">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-tealSuccess" />
                  <span>100% Verified Stipends</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-accent" />
                  <span>Real-Time Status Updates</span>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Animated Card Stack */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                
                {/* Floating Metric Badge 1 */}
                <div className="absolute -top-6 -left-6 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-soft border border-surface-border flex items-center gap-3 animate-float-slow">
                  <div className="w-10 h-10 rounded-xl bg-tealSuccess-light text-tealSuccess flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slateSub">Average Stipend</p>
                    <p className="font-heading font-bold text-sm text-charcoal">$3,400 / month</p>
                  </div>
                </div>

                {/* Floating Metric Badge 2 */}
                <div className="absolute -bottom-6 -right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-soft border border-surface-border flex items-center gap-3 animate-float-delayed">
                  <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slateSub">Selection Rate</p>
                    <p className="font-heading font-bold text-sm text-charcoal">94% Response in 7 Days</p>
                  </div>
                </div>

                {/* Primary Highlighted Internship Card in Hero */}
                <div className="bg-white rounded-3xl p-6 shadow-soft-lg border border-surface-border relative z-10 category-strip-tech">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary text-accent font-heading font-bold text-xl flex items-center justify-center">
                        N
                      </div>
                      <div>
                        <span className="text-xs font-mono text-slateSub uppercase font-semibold">NovaScale AI</span>
                        <h3 className="font-heading font-bold text-base text-charcoal">Frontend Engineering Intern</h3>
                      </div>
                    </div>
                    <span className="mono-badge bg-indigo-50 text-primary border border-indigo-200">Tech</span>
                  </div>

                  <p className="text-xs text-slateSub leading-relaxed mb-4">
                    Build real-time WebGL dashboards and distributed UI state systems with React & TypeScript.
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {['React', 'TypeScript', 'Three.js', 'Tailwind'].map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-surface-muted text-[11px] font-mono text-slateSub">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-surface-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slateSub">Stipend</span>
                      <p className="font-heading font-bold text-sm text-tealSuccess">$3,500 / mo</p>
                    </div>
                    <button
                      onClick={() => setSelectedInternship(internships[0])}
                      className="btn-primary text-xs py-2 px-4 shadow-soft"
                    >
                      Quick Apply
                    </button>
                  </div>
                </div>

                {/* Background Card Layer 2 (Stacked illusion) */}
                <div className="absolute top-4 -right-3 w-full h-full bg-primary/5 rounded-3xl border border-primary/10 -z-0 rotate-2 pointer-events-none" />
                <div className="absolute top-8 -right-6 w-full h-full bg-accent/5 rounded-3xl border border-accent/10 -z-10 rotate-4 pointer-events-none" />

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS TICKER SECTION */}
      <section className="bg-primary text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="font-heading font-extrabold text-3xl sm:text-4xl text-accent">14,200+</p>
              <p className="text-xs font-mono uppercase tracking-wider text-primary-200">Active Students</p>
            </div>
            <div className="space-y-1">
              <p className="font-heading font-extrabold text-3xl sm:text-4xl text-white">840+</p>
              <p className="text-xs font-mono uppercase tracking-wider text-primary-200">Internship Roles</p>
            </div>
            <div className="space-y-1">
              <p className="font-heading font-extrabold text-3xl sm:text-4xl text-tealSuccess">320+</p>
              <p className="text-xs font-mono uppercase tracking-wider text-primary-200">Vetted Companies</p>
            </div>
            <div className="space-y-1">
              <p className="font-heading font-extrabold text-3xl sm:text-4xl text-white">$2.4M+</p>
              <p className="text-xs font-mono uppercase tracking-wider text-primary-200">Student Stipends Paid</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED INTERNSHIPS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="mono-badge bg-primary-50 text-primary border border-primary-200">
              Curated Openings
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-charcoal mt-2">
              Featured Opportunities This Week
            </h2>
            <p className="text-sm text-slateSub mt-1">
              High-stipend internships with active mentors and fast application review.
            </p>
          </div>
          <Link
            to="/internships"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            <span>View all 840+ openings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredInternships.map((item) => (
            <InternshipCard
              key={item.id}
              internship={item}
              onApply={(selected) => setSelectedInternship(selected)}
            />
          ))}
        </div>
      </section>

      {/* 4. "HOW IT WORKS" 3-STEP SECTION */}
      <section className="bg-surface-muted/60 py-20 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="mono-badge bg-accent-light text-accent border border-accent/30">
              Simple 3-Step Journey
            </span>
            <h2 className="font-heading font-bold text-3xl text-charcoal">
              How SkillBridge India Fast-Tracks Your Career
            </h2>
            <p className="text-slateSub text-sm leading-relaxed">
              No black-hole resume submissions. Experience transparent recruitment from verification to selection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-soft border border-surface-border space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-bold text-xl shadow-soft">
                01
              </div>
              <h3 className="font-heading font-bold text-lg text-charcoal">
                Verified Student Signup
              </h3>
              <p className="text-xs text-slateSub leading-relaxed">
                Register in seconds with Google or your university email. Instant 6-digit OTP verification ensures a trusted, authentic community.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-primary font-semibold">
                <CheckCircle2 className="w-4 h-4 text-tealSuccess" />
                <span>Instant OTP Delivery</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-soft border border-surface-border space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-accent text-white flex items-center justify-center font-heading font-bold text-xl shadow-soft">
                02
              </div>
              <h3 className="font-heading font-bold text-lg text-charcoal">
                1-Click Apply with Live Capacity
              </h3>
              <p className="text-xs text-slateSub leading-relaxed">
                Filter by stipend, remote status, or tech stack. Apply directly with your uploaded resume and see remaining position slots in real time.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-accent font-semibold">
                <CheckCircle2 className="w-4 h-4 text-tealSuccess" />
                <span>Capacity-Safe Slot Tracking</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-soft border border-surface-border space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-tealSuccess text-white flex items-center justify-center font-heading font-bold text-xl shadow-soft">
                03
              </div>
              <h3 className="font-heading font-bold text-lg text-charcoal">
                Track Status & Get Selected
              </h3>
              <p className="text-xs text-slateSub leading-relaxed">
                Watch your application journey through Applied, Shortlisted, and Selected status chips. Receive immediate feedback directly from mentors.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-mono text-tealSuccess font-semibold">
                <CheckCircle2 className="w-4 h-4 text-tealSuccess" />
                <span>Transparent Decision Pipeline</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. STUDENT TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-charcoal">
            Loved by Students & Founders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-soft p-6 space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slateSub italic leading-relaxed">
              "The registration was seamless and I received an offer for the Frontend role at NovaScale AI within two weeks. SkillBridge India eliminates all the spam of typical job boards."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-surface-border">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Alex"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-charcoal">Alex Rivera</p>
                <p className="text-[11px] font-mono text-slateSub">CS Student @ Stanford</p>
              </div>
            </div>
          </div>

          <div className="card-soft p-6 space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slateSub italic leading-relaxed">
              "As a design agency founder, we filled our UI/UX intern positions with exceptional candidates. The candidate pipeline and capacity locking features saved us hours."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-surface-border">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Elena"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-charcoal">Elena Rostova</p>
                <p className="text-[11px] font-mono text-slateSub">Talent Lead @ Aura Studio</p>
              </div>
            </div>
          </div>

          <div className="card-soft p-6 space-y-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slateSub italic leading-relaxed">
              "Clear stipend tags, direct skills breakdown, and actual response tracking. SkillBridge India is by far the most modern internship platform out there."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-surface-border">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Marcus"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-charcoal">Marcus Vance</p>
                <p className="text-[11px] font-mono text-slateSub">Data Science Student @ MIT</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-soft-lg">
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">
              Ready to Launch Your Internship Journey?
            </h2>
            <p className="text-primary-200 text-sm sm:text-base leading-relaxed">
              Create your account in under 60 seconds. Verify via OTP, upload your resume, and apply to top internships today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="btn-primary text-sm px-8 py-3.5"
              >
                Get Started Free
              </Link>
              <Link
                to="/company/dashboard"
                className="btn-secondary text-sm px-8 py-3.5 border-white text-white hover:bg-white/10"
              >
                For Employers: Post a Role
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <ApplyModal
        internship={selectedInternship}
        isOpen={!!selectedInternship}
        onClose={() => setSelectedInternship(null)}
      />

    </div>
  );
};

export default LandingPage;
