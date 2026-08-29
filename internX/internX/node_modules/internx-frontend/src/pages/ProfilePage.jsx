import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInternships } from '../context/InternshipContext';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Plus,
  X,
  Save,
  Globe,
  Github
} from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { showToast } = useInternships();

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Rivera',
    email: user?.email || 'student@internx.dev',
    phone: user?.phone || '+1 (555) 234-5678',
    university: user?.university || 'Stanford University',
    major: user?.major || 'Computer Science & Design',
    gradYear: user?.gradYear || '2026',
    bio: 'Passionate frontend engineer and UI/UX developer looking for impactful summer/fall internship opportunities.',
    resumeUrl: user?.resumeUrl || 'Alex_Rivera_Resume_2026.pdf',
    github: 'https://github.com/alexrivera',
    portfolio: 'https://alexrivera.design'
  });

  const [skills, setSkills] = useState(
    user?.skills || ['React', 'TypeScript', 'Node.js', 'Figma', 'TailwindCSS', 'Python']
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profile and resume updated successfully!', 'success');
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resumeUrl: file.name });
      showToast(`Uploaded new resume: ${file.name}`, 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="mono-badge bg-primary-50 text-primary border border-primary-200">
            Account & Portfolio
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal mt-1">
            My Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slateSub">
            This information is shared with hiring teams when you submit internship applications.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Main Personal Information Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-surface-border space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={formData.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-accent shadow-soft"
            />
            <div>
              <h2 className="font-heading font-bold text-lg text-charcoal">{formData.name}</h2>
              <p className="text-xs font-mono text-tealSuccess flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified via OTP
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="floating-group">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder=" "
                className="floating-input"
              />
              <label htmlFor="name" className="floating-label">
                Full Name
              </label>
            </div>

            <div className="floating-group">
              <input
                type="email"
                id="email"
                disabled
                value={formData.email}
                placeholder=" "
                className="floating-input bg-surface-muted cursor-not-allowed"
              />
              <label htmlFor="email" className="floating-label">
                Verified Email
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="floating-group">
              <input
                type="text"
                id="university"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                placeholder=" "
                className="floating-input"
              />
              <label htmlFor="university" className="floating-label">
                University / College
              </label>
            </div>

            <div className="floating-group">
              <input
                type="text"
                id="major"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                placeholder=" "
                className="floating-input"
              />
              <label htmlFor="major" className="floating-label">
                Major / Degree
              </label>
            </div>

            <div className="floating-group">
              <input
                type="text"
                id="gradYear"
                value={formData.gradYear}
                onChange={(e) => setFormData({ ...formData, gradYear: e.target.value })}
                placeholder=" "
                className="floating-input"
              />
              <label htmlFor="gradYear" className="floating-label">
                Graduation Year
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-slateSub mb-1.5">
              Short Bio / Statement
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary leading-relaxed"
            />
          </div>
        </div>

        {/* Resume & Documents Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-surface-border space-y-4">
          <h3 className="font-heading font-bold text-base text-charcoal">
            Resume Document
          </h3>
          
          <div className="relative border-2 border-dashed border-surface-border hover:border-primary/40 rounded-2xl p-6 text-center transition-colors bg-surface/50">
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleResumeUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <UploadCloud className="w-8 h-8 text-primary" />
              <div className="flex items-center gap-2 text-sm font-semibold text-charcoal">
                <FileText className="w-4 h-4 text-accent" />
                <span>{formData.resumeUrl}</span>
              </div>
              <span className="text-xs text-slateSub">
                Click or drag to update your active resume (PDF or DOCX)
              </span>
            </div>
          </div>
        </div>

        {/* Skills & Tags Manager (JetBrains Mono) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-surface-border space-y-4">
          <h3 className="font-heading font-bold text-base text-charcoal">
            Skills & Competencies
          </h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-surface-border text-xs font-mono font-semibold text-primary"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slateSub hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add skill input */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              placeholder="Add skill (e.g. Next.js, Kotlin, SQL)..."
              className="px-4 py-2 text-xs bg-surface border border-surface-border rounded-xl focus:outline-none focus:border-primary font-mono"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="btn-secondary text-xs py-2 px-4 gap-1 font-mono"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary text-sm py-3 px-8 gap-2 shadow-soft"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default ProfilePage;
