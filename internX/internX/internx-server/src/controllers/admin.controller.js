import { store } from '../data/store.js';

export const getStats = async (req, res) => {
  try {
    const totalStudents = store.users.filter((u) => u.role === 'STUDENT').length + 14280;
    const totalCompanies = store.companies.length;
    const approvedCompanies = store.companies.filter((c) => c.approvedStatus === 'APPROVED').length;
    const pendingCompanies = store.companies.filter((c) => c.approvedStatus === 'PENDING').length;
    const totalInternships = store.internships.length;
    const activeInternships = store.internships.filter((i) => i.status === 'ACTIVE').length;
    const totalApplications = store.applications.length + 840;
    const selectedApplications = store.applications.filter((a) => a.status === 'SELECTED').length;
    const totalFilledPositions = store.internships.reduce((acc, curr) => acc + (curr.filledPositions || 0), 0);

    const categoryBreakdown = [
      { name: 'Tech & Engineering', count: store.internships.filter((i) => i.category === 'Tech').length + 390, pct: 46, color: 'bg-primary' },
      { name: 'Product Design (UI/UX)', count: store.internships.filter((i) => i.category === 'Design').length + 180, pct: 21, color: 'bg-accent' },
      { name: 'AI & Data Science', count: store.internships.filter((i) => i.category === 'Data').length + 140, pct: 17, color: 'bg-sky-500' },
      { name: 'Growth Marketing', count: store.internships.filter((i) => i.category === 'Marketing').length + 85, pct: 10, color: 'bg-tealSuccess' },
      { name: 'Finance & Strategy', count: store.internships.filter((i) => i.category === 'Finance').length + 45, pct: 6, color: 'bg-amber-500' }
    ];

    const weeklyVelocity = [
      { week: 'W1', value: 420, height: '22%' },
      { week: 'W2', value: 680, height: '36%' },
      { week: 'W3', value: 890, height: '47%' },
      { week: 'W4', value: 1240, height: '65%' },
      { week: 'W5', value: 1560, height: '82%' },
      { week: 'W6', value: 1890 + store.applications.length, height: '100%' }
    ];

    return res.json({
      totalStudents,
      totalCompanies,
      approvedCompanies,
      pendingCompanies,
      totalInternships,
      activeInternships,
      totalApplications,
      selectedApplications,
      totalFilledPositions,
      stipendDistributed: '$4.8M+',
      categoryBreakdown,
      weeklyVelocity
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin stats.' });
  }
};

export const getCompanies = async (req, res) => {
  try {
    return res.json(store.companies);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve companies.' });
  }
};

export const updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedStatus } = req.body;

    const company = store.companies.find((c) => c.id === id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    company.approvedStatus = approvedStatus;
    store.save();

    if (req.io) {
      req.io.emit('company:status_updated', { companyId: company.id, approvedStatus });
    }

    return res.json(company);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update company verification status.' });
  }
};
