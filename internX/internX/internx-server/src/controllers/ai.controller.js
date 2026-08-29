import { store } from '../data/store.js';

export const calculateMatch = async (req, res) => {
  try {
    const { internshipId, studentId, studentSkills, studentExperience, resumeText } = req.body;

    const internship = store.internships.find((i) => i.id === internshipId);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }

    const user = store.users.find((u) => u.id === (studentId || req.userId));
    const activeSkills = studentSkills || user?.skills || ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'];
    const required = internship.skillsRequired || [];

    const matchedSkills = [];
    const missingSkills = [];

    required.forEach((reqSkill) => {
      const match = activeSkills.some(
        (s) => s.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s.toLowerCase())
      );
      if (match) {
        matchedSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const skillRatio = required.length > 0 ? (matchedSkills.length / required.length) : 0.85;
    const baseScore = Math.round(skillRatio * 80 + 15);
    const matchScore = Math.min(98, Math.max(65, baseScore));

    const recommendations = [];
    if (missingSkills.length > 0) {
      recommendations.push(`Add projects highlighting experience with ${missingSkills.slice(0, 2).join(' and ')}.`);
    }
    recommendations.push(`Tailor your resume bullet points to emphasize problem scope and production scale.`);
    if (internship.category === 'Tech') {
      recommendations.push('Include GitHub repository links demonstrating clean code and automated unit tests.');
    } else if (internship.category === 'Design') {
      recommendations.push('Link your interactive Figma prototype or Case Study portfolio.');
    }

    return res.json({
      success: true,
      internshipId: internship.id,
      internshipTitle: internship.title,
      companyName: internship.companyName,
      matchScore,
      matchedSkills,
      missingSkills,
      recommendations,
      verdict: matchScore >= 85 ? 'Strong Match' : matchScore >= 70 ? 'Good Match' : 'Potential Fit'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'ATS match calculation failed.' });
  }
};
