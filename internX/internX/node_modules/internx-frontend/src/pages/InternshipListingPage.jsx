import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useInternships } from '../context/InternshipContext';
import InternshipCard from '../components/InternshipCard';
import ApplyModal from '../components/ApplyModal';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  X
} from 'lucide-react';

export const InternshipListingPage = () => {
  const { internships } = useInternships();
  const location = useLocation();

  // URL search query parse
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';
  const initialSearch = queryParams.get('search') || '';

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minStipend, setMinStipend] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState('ALL'); // 'ALL', 'SHORT' (<=8w), 'MED' (9-12w), 'LONG' (13w+)
  const [sortBy, setSortBy] = useState('NEWEST'); // 'NEWEST', 'STIPEND_DESC', 'DURATION_ASC'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [selectedInternship, setSelectedInternship] = useState(null);

  const categories = ['All', 'Tech', 'Design', 'Marketing', 'Data', 'Finance'];

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setRemoteOnly(false);
    setMinStipend(0);
    setSelectedDuration('ALL');
    setSortBy('NEWEST');
  };

  // Filtered & sorted internships
  const filteredInternships = useMemo(() => {
    let list = [...internships];

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter(
        (i) => i.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.companyName.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.skillsRequired.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Remote only filter
    if (remoteOnly) {
      list = list.filter((i) => i.remote === true);
    }

    // Stipend filter
    if (minStipend > 0) {
      list = list.filter((i) => i.stipendAmount >= minStipend);
    }

    // Duration filter
    if (selectedDuration === 'SHORT') {
      list = list.filter((i) => i.durationWeeks <= 8);
    } else if (selectedDuration === 'MED') {
      list = list.filter((i) => i.durationWeeks > 8 && i.durationWeeks <= 12);
    } else if (selectedDuration === 'LONG') {
      list = list.filter((i) => i.durationWeeks > 12);
    }

    // Sorting
    if (sortBy === 'STIPEND_DESC') {
      list.sort((a, b) => b.stipendAmount - a.stipendAmount);
    } else if (sortBy === 'DURATION_ASC') {
      list.sort((a, b) => a.durationWeeks - b.durationWeeks);
    } else {
      // NEWEST
      list.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
    }

    return list;
  }, [
    internships,
    selectedCategory,
    searchTerm,
    remoteOnly,
    minStipend,
    selectedDuration,
    sortBy
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Search Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-surface-border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="mono-badge bg-primary-50 text-primary border border-primary-200">
              Verified Openings
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal mt-1">
              Browse Student Internships
            </h1>
            <p className="text-xs sm:text-sm text-slateSub">
              Explore {filteredInternships.length} available opportunities with transparent capacity & stipends.
            </p>
          </div>

          {/* Search bar inside banner */}
          <div className="w-full md:max-w-md relative">
            <input
              type="text"
              placeholder="Search by role, company, or skills (e.g. React, Figma)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-surface text-sm rounded-2xl border border-surface-border focus:bg-white focus:outline-none focus:border-primary/40 transition-colors"
            />
            <Search className="w-4 h-4 text-slateSub absolute left-4 top-1/2 -translate-y-1/2" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slateSub hover:text-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-surface hover:bg-surface-muted text-slateSub border border-surface-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout (Filter Sidebar + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-3xl p-6 shadow-soft border border-surface-border space-y-6 sticky top-28">
          
          <div className="flex items-center justify-between pb-4 border-b border-surface-border">
            <div className="flex items-center gap-2 text-sm font-heading font-bold text-charcoal">
              <SlidersHorizontal className="w-4 h-4 text-accent" />
              <span>Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-mono text-slateSub hover:text-primary flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Remote / Onsite Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase text-slateSub">
              Work Preference
            </label>
            <label className="flex items-center gap-3 p-3 bg-surface rounded-2xl cursor-pointer hover:bg-surface-muted transition-colors">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-4 h-4 rounded text-accent focus:ring-accent accent-accent"
              />
              <span className="text-xs font-medium text-charcoal">
                Remote Internships Only
              </span>
            </label>
          </div>

          {/* Stipend Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold uppercase text-slateSub">
                Min. Stipend
              </label>
              <span className="text-xs font-mono font-bold text-tealSuccess">
                {minStipend === 0 ? 'Any' : `$${minStipend.toLocaleString()} / mo`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={4000}
              step={500}
              value={minStipend}
              onChange={(e) => setMinStipend(Number(e.target.value))}
              className="w-full accent-tealSuccess cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slateSub">
              <span>$0</span>
              <span>$2,000</span>
              <span>$4,000+</span>
            </div>
          </div>

          {/* Duration Filter */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold uppercase text-slateSub">
              Program Duration
            </label>
            <div className="space-y-1 text-xs">
              {[
                { id: 'ALL', label: 'All Durations' },
                { id: 'SHORT', label: 'Up to 8 Weeks' },
                { id: 'MED', label: '9 - 12 Weeks' },
                { id: 'LONG', label: '13+ Weeks' }
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDuration(d.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                    selectedDuration === d.id
                      ? 'bg-primary-50 text-primary font-semibold'
                      : 'text-slateSub hover:bg-surface'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* INTERNSHIP CARDS GRID (Col 9) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Controls bar: Results count + Sort Dropdown + Mobile Filter trigger */}
          <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-surface-border shadow-soft-sm">
            <p className="text-xs font-mono text-slateSub">
              Showing <span className="font-bold text-charcoal">{filteredInternships.length}</span> positions
            </p>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-muted text-xs font-mono font-semibold text-charcoal"
              >
                <Filter className="w-3.5 h-3.5 text-accent" />
                <span>Filters</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slateSub font-mono hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface font-mono text-xs font-semibold px-3 py-1.5 rounded-xl border border-surface-border focus:outline-none focus:border-primary text-charcoal"
                >
                  <option value="NEWEST">Most Recent</option>
                  <option value="STIPEND_DESC">Highest Stipend</option>
                  <option value="DURATION_ASC">Shortest Duration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filter Panel */}
          {mobileFilterOpen && (
            <div className="lg:hidden bg-white p-5 rounded-2xl border border-surface-border space-y-4 shadow-soft">
              <div className="flex items-center justify-between pb-2 border-b border-surface-border">
                <span className="text-xs font-mono font-bold uppercase text-charcoal">Filter Options</span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-mono text-accent"
                >
                  Reset All
                </button>
              </div>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <span>Remote Only</span>
              </label>
              <div>
                <label className="text-xs font-mono text-slateSub">Min Stipend: ${minStipend}</label>
                <input
                  type="range"
                  min={0}
                  max={4000}
                  step={500}
                  value={minStipend}
                  onChange={(e) => setMinStipend(Number(e.target.value))}
                  className="w-full accent-tealSuccess mt-1"
                />
              </div>
            </div>
          )}

          {/* Listings Grid */}
          {filteredInternships.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-soft border border-surface-border space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-surface-muted text-slateSub mx-auto flex items-center justify-center">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-bold text-lg text-charcoal">
                No internships found matching your filters
              </h3>
              <p className="text-xs text-slateSub max-w-sm mx-auto">
                Try widening your search terms, resetting filters, or selecting a different category.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-secondary text-xs py-2.5 px-5"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInternships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onApply={(item) => setSelectedInternship(item)}
                />
              ))}
            </div>
          )}

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

export default InternshipListingPage;
