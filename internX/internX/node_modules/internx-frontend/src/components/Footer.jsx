import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Twitter, Linkedin, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-12 border-t border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-primary-700/60">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-accent font-heading font-extrabold text-base">SB</span>
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-white flex items-center gap-1.5">
                Skill<span className="text-accent">Bridge</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono font-bold">India</span>
              </span>
            </div>
            <p className="text-primary-200 text-sm leading-relaxed max-w-sm">
              India's premier career launching platform connecting ambitious students and college talent with high-impact internships and leading tech companies.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-accent transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Students Col */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-sm text-accent uppercase tracking-wider">
              For Students
            </h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link to="/internships" className="hover:text-white transition-colors">Explore All Internships</Link></li>
              <li><Link to="/internships?category=Tech" className="hover:text-white transition-colors">Tech & Engineering</Link></li>
              <li><Link to="/internships?category=Design" className="hover:text-white transition-colors">Design & UI/UX</Link></li>
              <li><Link to="/internships?category=Data" className="hover:text-white transition-colors">AI & Data Science</Link></li>
              <li><Link to="/student/dashboard" className="hover:text-white transition-colors">Application Tracker</Link></li>
            </ul>
          </div>

          {/* Companies Col */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-sm text-accent uppercase tracking-wider">
              For Companies
            </h4>
            <ul className="space-y-2 text-sm text-primary-200">
              <li><Link to="/company/dashboard" className="hover:text-white transition-colors">Post an Internship</Link></li>
              <li><Link to="/company/dashboard" className="hover:text-white transition-colors">Candidate Pipeline</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Employer Verification</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Hiring Solutions</a></li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-sm text-white">
              Stay in the Loop
            </h4>
            <p className="text-xs text-primary-200">
              Get notified when new high-stipend internships launch each Monday.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to InternX weekly dispatch!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="student@university.edu"
                className="w-full px-3.5 py-2 text-xs bg-primary-800/80 border border-primary-600 rounded-xl text-white placeholder-primary-300 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="w-full py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-300">
          <p>© {new Date().getFullYear()} SkillBridge India Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security & OTP</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
