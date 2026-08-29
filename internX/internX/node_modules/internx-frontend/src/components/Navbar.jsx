import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInternships } from '../context/InternshipContext';
import { useSocket } from '../context/SocketContext';
import {
  Search,
  Sparkles,
  LogOut,
  ChevronDown,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  MessageSquare,
  Activity,
  ShieldCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotifCount,
    markAllNotificationsAsRead,
    openLiveChat
  } = useInternships();
  const { isConnected, pingLatency, activeUsersCount } = useSocket();

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/internships') {
      navigate('/internships');
    }
  };

  const getDashboardLink = () => {
    if (role === 'COMPANY') return '/company/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/student/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-surface-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group focus-visible:ring-2 focus-visible:ring-primary rounded-2xl p-1">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <span className="text-accent font-heading font-extrabold text-lg">IX</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl tracking-tight text-primary flex items-center gap-1">
                Intern<span className="text-accent">X</span>
              </span>
              <span className="text-[9px] font-mono text-tealSuccess font-bold -mt-1 tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tealSuccess animate-pulse" /> Real-Time Platform
              </span>
            </div>
          </Link>

          {/* Real-time Telemetry Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-surface-border text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-tealSuccess animate-ping' : 'bg-amber-500'}`} />
            <span className="text-slateSub">
              {isConnected ? `Backend Connected (${pingLatency})` : 'Reconnecting to Server...'}
            </span>
            <span className="text-slateSub">•</span>
            <span className="font-bold text-primary">{activeUsersCount} Online</span>
          </div>

          {/* Centered Pill Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="hidden md:flex flex-1 max-w-md mx-2 relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search skills, roles (e.g. React, Cloud, Python)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search internships by skill or role"
                className="w-full pl-11 pr-14 py-2.5 bg-surface-muted hover:bg-surface-border/40 focus:bg-white text-sm text-charcoal rounded-full border border-transparent focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <Search className="w-4 h-4 text-slateSub absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-primary-100 text-primary font-mono text-[10px] font-semibold"
              >
                ↵ GO
              </button>
            </div>
          </form>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Quick Navigation */}
            <nav className="flex items-center gap-1 text-sm font-medium" aria-label="Main Navigation">
              <Link
                to="/internships"
                className={`px-3.5 py-2 rounded-full transition-colors ${
                  location.pathname === '/internships'
                    ? 'text-primary bg-primary-50 font-semibold'
                    : 'text-slateSub hover:text-primary hover:bg-surface-muted'
                }`}
              >
                Browse Internships
              </Link>
            </nav>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                
                {/* Live Chat Launcher */}
                <button
                  type="button"
                  onClick={() => openLiveChat()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface-muted hover:bg-surface-border/50 text-charcoal text-xs font-semibold transition-colors relative"
                  aria-label="Open Direct Hiring Chat"
                  title="Direct Hiring Messages"
                >
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>Live Chat</span>
                  <span className="w-2 h-2 rounded-full bg-tealSuccess animate-pulse" />
                </button>

                {role === 'COMPANY' && (
                  <Link
                    to="/company/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold shadow-soft hover:bg-accent-hover transition-all"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Post Internship
                  </Link>
                )}

                <Link
                  to={getDashboardLink()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary-50 text-primary text-xs font-semibold hover:bg-primary-100 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-accent" />
                  <span>Dashboard</span>
                </Link>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="relative p-2.5 rounded-full bg-surface-muted hover:bg-surface-border/60 text-charcoal transition-colors"
                    aria-label={`Notifications ${unreadNotifCount > 0 ? `(${unreadNotifCount} unread)` : ''}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-soft-lg border border-surface-border p-4 z-50 animate-fade-in"
                      onMouseLeave={() => setNotifDropdownOpen(false)}
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading font-bold text-sm text-charcoal">Real-Time Alerts</span>
                          {unreadNotifCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-accent-light text-accent text-[10px] font-mono font-bold">
                              {unreadNotifCount} new
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => markAllNotificationsAsRead(user?.email)}
                          className="text-[11px] font-mono text-primary hover:text-accent font-semibold"
                        >
                          Mark all read
                        </button>
                      </div>

                      <div className="divide-y divide-surface-border max-h-72 overflow-y-auto pt-1">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slateSub text-center py-6">No notifications yet</p>
                        ) : (
                          notifications.slice(0, 6).map((notif) => (
                            <div
                              key={notif.id}
                              className={`py-3 px-2 rounded-xl transition-colors ${
                                !notif.read ? 'bg-primary-50/50' : 'hover:bg-surface-muted/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-heading font-bold text-xs text-charcoal">{notif.title}</p>
                                <span className="text-[10px] font-mono text-slateSub shrink-0">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-slateSub mt-1 leading-relaxed">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Pill */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-surface-border hover:border-primary/40 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                    aria-expanded={profileDropdownOpen}
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={user?.name}
                      className="w-7 h-7 rounded-full object-cover border border-primary/20"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-charcoal max-w-[100px] truncate leading-tight">
                        {user?.name?.split(' ')[0]}
                      </span>
                      <span className="text-[9px] font-mono uppercase text-slateSub leading-none">
                        {role}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-slateSub" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-soft-lg border border-surface-border py-2 z-50 animate-fade-in"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-surface-border">
                        <p className="text-xs font-bold text-charcoal truncate">{user?.name}</p>
                        <p className="text-[11px] text-slateSub truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-primary-50 text-primary">
                          {role} Account
                        </span>
                      </div>
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-charcoal hover:bg-surface-muted"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-charcoal hover:bg-surface-muted"
                      >
                        Profile & Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-semibold text-primary hover:text-accent transition-colors flex items-center gap-1 rounded-full hover:bg-surface-muted"
                  >
                    <span>Log In</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-2xl shadow-soft-lg border border-surface-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link
                      to="/login/student"
                      className="block px-4 py-2 text-xs font-medium text-charcoal hover:bg-primary-50 hover:text-primary transition-colors"
                    >
                      🎓 Student Login
                    </Link>
                    <Link
                      to="/login/company"
                      className="block px-4 py-2 text-xs font-medium text-charcoal hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      🏢 Company Login
                    </Link>
                    <Link
                      to="/login/admin"
                      className="block px-4 py-2 text-xs font-medium text-charcoal hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      🛡️ Admin Login
                    </Link>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="btn-primary text-xs py-2.5 px-5"
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-charcoal hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-surface-border bg-white px-4 pt-4 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-muted text-sm rounded-full border border-surface-border"
            />
            <Search className="w-4 h-4 text-slateSub absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <Link
            to="/internships"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-charcoal hover:bg-surface-muted"
          >
            Browse Internships
          </Link>

          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLiveChat();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-primary bg-primary-50 flex items-center justify-between"
              >
                <span>Live Recruiter Chat</span>
                <span className="w-2 h-2 rounded-full bg-tealSuccess animate-pulse" />
              </button>
              <Link
                to={getDashboardLink()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-primary bg-primary-50"
              >
                Go to Dashboard ({role})
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-charcoal hover:bg-surface-muted"
              >
                My Profile & Resume
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs font-semibold">
                <Link
                  to="/login/student"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 rounded-xl bg-primary-50 text-primary border border-primary/20"
                >
                  Student
                </Link>
                <Link
                  to="/login/company"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  Company
                </Link>
                <Link
                  to="/login/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-300"
                >
                  Admin
                </Link>
              </div>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-accent text-white text-sm font-medium shadow-soft"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
