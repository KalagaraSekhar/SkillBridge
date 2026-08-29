import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const InternshipCard = ({ internship, onApply }) => {
  const getCategoryStripClass = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'tech':
        return 'category-strip-tech';
      case 'design':
        return 'category-strip-design';
      case 'marketing':
        return 'category-strip-marketing';
      case 'data':
        return 'category-strip-data';
      case 'finance':
        return 'category-strip-finance';
      default:
        return 'category-strip-default';
    }
  };

  const getCategoryBadgeColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'tech':
        return 'bg-indigo-50 text-primary border-indigo-200';
      case 'design':
        return 'bg-red-50 text-accent border-red-200';
      case 'marketing':
        return 'bg-tealSuccess-light text-tealSuccess-dark border-tealSuccess/30';
      case 'data':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'finance':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-charcoal border-gray-200';
    }
  };

  const isFull = internship.filledPositions >= internship.maxPositions;
  const slotsRemaining = internship.maxPositions - internship.filledPositions;

  return (
    <div
      className={`card-soft relative p-6 flex flex-col justify-between transition-all duration-300 group ${getCategoryStripClass(
        internship.category
      )}`}
    >
      <div>
        {/* Top Header: Company Info + Category Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={internship.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
              alt={internship.companyName}
              className="w-12 h-12 rounded-xl object-cover border border-surface-border p-0.5 bg-white shadow-soft-sm group-hover:scale-105 transition-transform"
            />
            <div>
              <h4 className="text-xs font-semibold text-slateSub uppercase tracking-wider">
                {internship.companyName}
              </h4>
              <Link
                to={`/internships/${internship.id}`}
                className="font-heading font-bold text-base text-charcoal group-hover:text-primary transition-colors line-clamp-1"
              >
                {internship.title}
              </Link>
            </div>
          </div>

          <span
            className={`mono-badge border shrink-0 ${getCategoryBadgeColor(
              internship.category
            )}`}
          >
            {internship.category}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slateSub line-clamp-2 leading-relaxed mb-4">
          {internship.description}
        </p>

        {/* Key Metrics Pills */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-muted/70 text-xs text-charcoal font-medium">
            <DollarSign className="w-3.5 h-3.5 text-tealSuccess shrink-0" />
            <span className="truncate">{internship.stipend}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-muted/70 text-xs text-charcoal font-medium">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{internship.durationText || `${internship.durationWeeks} Weeks`}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-muted/70 text-xs text-slateSub">
            <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
            <span className="truncate">
              {internship.remote ? 'Remote' : internship.location}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-muted/70 text-xs text-slateSub">
            <Users className="w-3.5 h-3.5 text-slateSub shrink-0" />
            <span className={`truncate font-mono font-medium ${isFull ? 'text-red-500 font-bold' : ''}`}>
              {isFull ? 'Filled' : `${slotsRemaining} open / ${internship.maxPositions}`}
            </span>
          </div>
        </div>

        {/* Skills Required (JetBrains Mono) */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {internship.skillsRequired?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md bg-white border border-surface-border text-[11px] font-mono text-slateSub font-medium"
            >
              {skill}
            </span>
          ))}
          {internship.skillsRequired?.length > 4 && (
            <span className="px-1.5 py-0.5 rounded-md bg-surface-muted text-[10px] font-mono text-slateSub">
              +{internship.skillsRequired.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom CTA Row & Capacity Bar */}
      <div className="pt-3 border-t border-surface-border flex items-center justify-between gap-3">
        {/* Capacity status pill */}
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-2 bg-surface-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isFull
                  ? 'bg-red-500 w-full'
                  : slotsRemaining === 1
                  ? 'bg-amber-500'
                  : 'bg-tealSuccess'
              }`}
              style={{
                width: isFull
                  ? '100%'
                  : `${(internship.filledPositions / internship.maxPositions) * 100}%`
              }}
            />
          </div>
          <span className="text-[10px] font-mono text-slateSub">
            {internship.filledPositions}/{internship.maxPositions}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/internships/${internship.id}`}
            className="p-2 rounded-full text-slateSub hover:text-primary hover:bg-surface-muted transition-colors"
            title="View Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => onApply && onApply(internship)}
            disabled={isFull}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              isFull
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-accent hover:bg-accent-hover text-white shadow-soft hover:shadow-coral-glow'
            }`}
          >
            {isFull ? 'Capacity Full' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;
