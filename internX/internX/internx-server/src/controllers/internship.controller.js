import { store } from '../data/store.js';

export const getAllInternships = async (req, res) => {
  try {
    const { category, search, remote, maxStipend, minStipend, sort } = req.query;
    let list = [...store.internships];

    if (category && category !== 'All') {
      list = list.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }

    if (remote !== undefined && remote !== '') {
      const isRemote = remote === true || remote === 'true';
      list = list.filter((item) => item.remote === isRemote);
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.companyName.toLowerCase().includes(q) ||
        (item.skillsRequired && item.skillsRequired.some((s) => s.toLowerCase().includes(q))) ||
        (item.location && item.location.toLowerCase().includes(q))
      );
    }

    if (maxStipend) {
      list = list.filter((item) => (item.stipendAmount || 0) <= Number(maxStipend));
    }

    if (minStipend) {
      list = list.filter((item) => (item.stipendAmount || 0) >= Number(minStipend));
    }

    if (sort === 'stipend_high') {
      list.sort((a, b) => (b.stipendAmount || 0) - (a.stipendAmount || 0));
    } else if (sort === 'capacity_open') {
      list.sort((a, b) => (b.maxPositions - b.filledPositions) - (a.maxPositions - a.filledPositions));
    } else {
      // Default: newest first
      list.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));
    }

    return res.json(list);
  } catch (err) {
    console.error('getAllInternships error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve internships.' });
  }
};

export const getInternshipById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = store.internships.find((i) => i.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }

    // Attach current live viewers count if any
    const viewers = store.liveViewers.get(id)?.size || 1;
    return res.json({ ...item, liveViewersCount: viewers });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve internship details.' });
  }
};

export const createInternship = async (req, res) => {
  try {
    const data = req.body;
    const newInternship = {
      id: `int-${Date.now()}`,
      companyId: req.user?.companyId || data.companyId || 'comp-1',
      companyName: req.user?.companyName || data.companyName || 'NovaScale AI',
      companyLogo: data.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      title: data.title,
      category: data.category || 'Tech',
      stipend: data.stipend || '$3,500 / mo',
      stipendAmount: Number(data.stipendAmount) || 3500,
      durationWeeks: Number(data.durationWeeks) || 12,
      durationText: data.durationText || `${data.durationWeeks || 12} Weeks (Summer 2026)`,
      location: data.location || 'San Francisco, CA',
      remote: data.remote ?? true,
      status: 'ACTIVE',
      maxPositions: Number(data.maxPositions) || 3,
      filledPositions: 0,
      postedAt: new Date().toISOString(),
      skillsRequired: Array.isArray(data.skillsRequired) ? data.skillsRequired : (data.skillsRequired || '').split(',').map((s) => s.trim()),
      description: data.description || '',
      responsibilities: data.responsibilities || [
        'Design and build high-performance product components',
        'Participate in sprint retrospectives and team architecture reviews'
      ],
      requirements: data.requirements || [
        'Strong foundational problem-solving skills',
        'Curiosity and eagerness to learn modern production stacks'
      ],
      perks: data.perks || ['1-on-1 mentorship', 'Full-time conversion pipeline', 'Hardware allowance']
    };

    store.internships.unshift(newInternship);
    store.save();

    // Broadcast new internship live to all connected WebSocket clients!
    if (req.io) {
      req.io.emit('internship:new', newInternship);
    }

    return res.status(201).json(newInternship);
  } catch (err) {
    console.error('createInternship error:', err);
    return res.status(500).json({ success: false, message: 'Failed to post internship opening.' });
  }
};

export const updateInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const item = store.internships.find((i) => i.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }

    Object.assign(item, req.body);
    store.save();

    if (req.io) {
      req.io.emit('internship:updated', item);
    }

    return res.json(item);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update internship.' });
  }
};

export const deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;
    const idx = store.internships.findIndex((i) => i.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }

    store.internships.splice(idx, 1);
    store.save();

    if (req.io) {
      req.io.emit('internship:deleted', { id });
    }

    return res.json({ success: true, message: 'Internship deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete internship.' });
  }
};
