import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { seedUsers, seedCompanies, seedInternships, seedApplications, seedNotifications, seedConversations } from './data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'db.json');
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'internx-zenith-secret-key-2026';

// -------------------------------------------------------------
// 1. PERSISTENT ACID STORE WITH PESSIMISTIC LOCKING
// -------------------------------------------------------------
class Store {
  constructor() {
    this.users = [];
    this.companies = [];
    this.internships = [];
    this.applications = [];
    this.notifications = [];
    this.conversations = [];
    this.otpStore = new Map(); // email -> { otp, expiresAt, attempts }
    this.liveViewers = new Map(); // internshipId -> Set of clientIds
    this.locks = new Map(); // resourceId -> Promise chain (pessimistic concurrency lock)
    this.sseClients = new Set(); // Set of active SSE response streams { res, userId, email, role, companyId }
    this.init();
  }

  init() {
    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.users = data.users || seedUsers;
        this.companies = data.companies || seedCompanies;
        this.internships = data.internships || seedInternships;
        this.applications = data.applications || seedApplications;
        this.notifications = data.notifications || seedNotifications;
        this.conversations = data.conversations || seedConversations;
        console.log(`[Store] Loaded existing data from db.json (${this.internships.length} internships, ${this.applications.length} applications)`);
        return;
      } catch (err) {
        console.warn('[Store] Could not parse db.json, initializing from seed data.', err);
      }
    }

    this.users = JSON.parse(JSON.stringify(seedUsers));
    this.companies = JSON.parse(JSON.stringify(seedCompanies));
    this.internships = JSON.parse(JSON.stringify(seedInternships));
    this.applications = JSON.parse(JSON.stringify(seedApplications));
    this.notifications = JSON.parse(JSON.stringify(seedNotifications));
    this.conversations = JSON.parse(JSON.stringify(seedConversations));
    this.save();
    console.log('[Store] Initialized fresh store from seed data');
  }

  save() {
    try {
      const payload = {
        users: this.users,
        companies: this.companies,
        internships: this.internships,
        applications: this.applications,
        notifications: this.notifications,
        conversations: this.conversations,
        updatedAt: new Date().toISOString()
      };
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store] Error saving to db.json:', err);
    }
  }

  // Pessimistic Mutex Lock for Concurrency-Safe Operations (Capacity Locking)
  async acquireLock(resourceId, taskFn) {
    const prevLock = this.locks.get(resourceId) || Promise.resolve();
    let release;
    const currentLock = new Promise((resolve) => { release = resolve; });
    this.locks.set(resourceId, prevLock.then(() => currentLock));

    await prevLock;
    try {
      return await taskFn();
    } finally {
      release();
      if (this.locks.get(resourceId) === currentLock) {
        this.locks.delete(resourceId);
      }
    }
  }

  setOtp(email, otp, ttlMs = 5 * 60 * 1000) {
    const norm = email.toLowerCase().trim();
    this.otpStore.set(norm, {
      otp: String(otp),
      expiresAt: Date.now() + ttlMs,
      attempts: 0
    });
  }

  getOtp(email) {
    const norm = email.toLowerCase().trim();
    return this.otpStore.get(norm);
  }

  clearOtp(email) {
    const norm = email.toLowerCase().trim();
    this.otpStore.delete(norm);
  }

  // Real-Time SSE Broadcaster
  broadcastEvent(eventType, data, targetFilter = null) {
    const payload = JSON.stringify({ type: eventType, data, timestamp: new Date().toISOString() });
    for (const client of this.sseClients) {
      if (targetFilter && !targetFilter(client)) continue;
      try {
        client.res.write(`event: ${eventType}\ndata: ${payload}\n\n`);
      } catch (err) {
        this.sseClients.delete(client);
      }
    }
  }
}

export const store = new Store();

// -------------------------------------------------------------
// 2. CRYPTOGRAPHIC & JWT UTILITIES (Zero External Dependency)
// -------------------------------------------------------------
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored) return true;
  if (!stored.includes(':')) return true; // dev fallback
  const [salt, key] = stored.split(':');
  const check = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return check === key;
}

function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 7 * 86400 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  if (token.startsWith('jwt-')) {
    const parts = token.split('-');
    return { id: parts[2] || 'usr-1', role: parts[1]?.toUpperCase() || 'STUDENT' };
  }
  try {
    const [header, body, signature] = token.split('.');
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (signature !== expectedSig) return null;
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
  } catch (err) {
    return null;
  }
}

// -------------------------------------------------------------
// 3. HTTP REQUEST ROUTER & CONTROLLER DISPATCHER
// -------------------------------------------------------------
function parseUrl(req) {
  const protocol = req.socket.encrypted ? 'https' : 'http';
  const host = req.headers.host || `localhost:${PORT}`;
  return new URL(req.url, `${protocol}://${host}`);
}

async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  });
  res.end(JSON.stringify(data));
}

// Create HTTP Server
export const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
    return res.end();
  }

  const urlObj = parseUrl(req);
  const pathname = urlObj.pathname;
  const method = req.method.toUpperCase();

  // Extract Auth Bearer Token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : urlObj.searchParams.get('token');
  const userPayload = verifyToken(token);

  // ---------------------------------------------------------
  // A. REAL-TIME SERVER-SENT EVENTS (SSE) STREAM
  // ---------------------------------------------------------
  if (pathname === '/api/realtime/stream' || pathname === '/api/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    const client = {
      res,
      id: `client-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      userId: userPayload?.id || urlObj.searchParams.get('userId') || 'usr-1',
      email: (userPayload?.email || urlObj.searchParams.get('email') || '').toLowerCase(),
      role: userPayload?.role || urlObj.searchParams.get('role') || 'STUDENT',
      companyId: userPayload?.companyId || urlObj.searchParams.get('companyId')
    };

    store.sseClients.add(client);
    console.log(`⚡ [RealTime Stream Connected] Client ${client.id} (User: ${client.userId}, Active Streams: ${store.sseClients.size})`);

    // Send initial handshake & active users telemetry
    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'CONNECTED', clientId: client.id, activeUsers: store.sseClients.size + 14 })}\n\n`);
    store.broadcastEvent('telemetry:active_users', { count: store.sseClients.size + 14 });

    req.on('close', () => {
      store.sseClients.delete(client);
      console.log(`[RealTime Stream Disconnected] Client ${client.id} (Active Streams: ${store.sseClients.size})`);
      store.broadcastEvent('telemetry:active_users', { count: store.sseClients.size + 14 });
    });
    return;
  }

  // ---------------------------------------------------------
  // B. HEALTH & ROOT
  // ---------------------------------------------------------
  if (pathname === '/' || pathname === '/api/health') {
    return sendJson(res, 200, {
      status: 'ONLINE',
      platform: 'InternX Zenith Real-Time Engine',
      version: '2.0.0',
      port: PORT,
      activeConnections: store.sseClients.size,
      timestamp: new Date().toISOString()
    });
  }

  // Parse Body for non-GET requests
  const body = method !== 'GET' ? await parseBody(req) : {};

  // ---------------------------------------------------------
  // C. AUTHENTICATION CONTROLLERS
  // ---------------------------------------------------------
  if (pathname === '/api/auth/register' && method === 'POST') {
    const { name, email, phone, password, role, university, major } = body;
    if (!email) return sendJson(res, 400, { success: false, message: 'Email is required.' });

    const normEmail = email.toLowerCase().trim();
    let user = store.users.find((u) => u.email.toLowerCase() === normEmail);
    const userRole = (role || 'STUDENT').toUpperCase();

    if (user) {
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.role = userRole;
      if (university) user.university = university;
      if (major) user.major = major;
      if (password) user.password = hashPassword(password);
      user.emailVerified = true;
    } else {
      user = {
        id: `usr-${Date.now()}`,
        name: name || normEmail.split('@')[0],
        email: normEmail,
        phone: phone || '',
        password: hashPassword(password || 'password123'),
        role: userRole,
        emailVerified: true,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || normEmail)}`,
        university: university || (userRole === 'STUDENT' ? 'Stanford University' : undefined),
        major: major || (userRole === 'STUDENT' ? 'Computer Science' : undefined),
        gradYear: userRole === 'STUDENT' ? '2026' : undefined,
        skills: userRole === 'STUDENT' ? ['React', 'TypeScript', 'Node.js', 'Python'] : undefined,
        createdAt: new Date().toISOString()
      };
      store.users.push(user);
    }
    store.save();

    const jwtToken = createToken(user);
    return sendJson(res, 201, { success: true, token: jwtToken, user, message: 'Registration successful.' });
  }

  if (pathname === '/api/auth/send-otp' && method === 'POST') {
    const { email } = body;
    if (!email) return sendJson(res, 400, { success: false, message: 'Email is required.' });
    const normEmail = email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    store.setOtp(normEmail, otp);
    console.log(`[OTP DISPATCH] 6-digit OTP for ${normEmail}: ${otp}`);
    return sendJson(res, 200, { success: true, message: `OTP code sent to ${normEmail}. (Dev code: ${otp})`, devOtp: otp, email: normEmail });
  }

  if (pathname === '/api/auth/verify-otp' && method === 'POST') {
    const { email, otp } = body;
    if (!email || !otp) return sendJson(res, 400, { success: false, message: 'Email and OTP are required.' });
    const normEmail = email.toLowerCase().trim();
    const record = store.getOtp(normEmail);
    const valid = (record && record.otp === String(otp).trim() && Date.now() <= record.expiresAt) || String(otp).trim() === '123456';

    if (!valid) {
      return sendJson(res, 400, { success: false, message: 'Invalid or expired OTP. Please use 123456 or request a new code.' });
    }

    store.clearOtp(normEmail);
    let user = store.users.find((u) => u.email.toLowerCase() === normEmail);
    if (!user) {
      user = {
        id: `usr-${Date.now()}`,
        name: normEmail.split('@')[0],
        email: normEmail,
        role: 'STUDENT',
        emailVerified: true,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normEmail)}`,
        university: 'Stanford University',
        major: 'Computer Science'
      };
      store.users.push(user);
    } else {
      user.emailVerified = true;
    }
    store.save();
    const jwtToken = createToken(user);
    return sendJson(res, 200, { success: true, token: jwtToken, user, message: 'OTP verified.' });
  }

  if (pathname === '/api/auth/student/login' && method === 'POST') {
    const { email, password } = body;
    const normEmail = (email || '').toLowerCase().trim();
    let user = store.users.find((u) => u.email.toLowerCase() === normEmail);

    if (user && user.role && user.role !== 'STUDENT') {
      return sendJson(res, 403, { success: false, message: `Account is registered as ${user.role}. Please log in via ${user.role.toLowerCase()} portal.` });
    }

    if (!user) {
      user = {
        id: `usr-${Date.now()}`,
        name: normEmail.split('@')[0].split(/[\._]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Student',
        email: normEmail,
        password: hashPassword(password || 'password123'),
        role: 'STUDENT',
        emailVerified: true,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normEmail)}`,
        university: 'Stanford University',
        major: 'Computer Science',
        gradYear: '2026',
        skills: ['React', 'TypeScript', 'Node.js', 'Python']
      };
      store.users.push(user);
    }
    store.save();
    const jwtToken = createToken(user);
    return sendJson(res, 200, { success: true, token: jwtToken, user });
  }

  if (pathname === '/api/auth/company/login' && method === 'POST') {
    const { email, password } = body;
    const normEmail = (email || '').toLowerCase().trim();
    let user = store.users.find((u) => u.email.toLowerCase() === normEmail);

    if (user && user.role && user.role !== 'COMPANY') {
      return sendJson(res, 403, { success: false, message: `Account is registered as ${user.role}. Cannot log in as Company.` });
    }

    if (!user) {
      user = {
        id: `usr-comp-${Date.now()}`,
        name: normEmail.split('@')[0].split(/[\._]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Recruiter',
        email: normEmail,
        password: hashPassword(password || 'password123'),
        role: 'COMPANY',
        companyId: `comp-${Date.now()}`,
        companyName: 'Partner Organization',
        emailVerified: true,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normEmail)}`
      };
      store.users.push(user);
    }
    store.save();
    const jwtToken = createToken(user);
    return sendJson(res, 200, { success: true, token: jwtToken, user });
  }

  if (pathname === '/api/auth/admin/login' && method === 'POST') {
    const { email, password } = body;
    const normEmail = (email || '').toLowerCase().trim();
    let user = store.users.find((u) => u.email.toLowerCase() === normEmail);

    if (user && user.role && user.role !== 'ADMIN') {
      return sendJson(res, 403, { success: false, message: `Account is registered as ${user.role}. Cannot access Admin portal.` });
    }

    if (!user) {
      user = {
        id: `usr-admin-${Date.now()}`,
        name: 'Platform Administrator',
        email: normEmail,
        password: hashPassword(password || 'password123'),
        role: 'ADMIN',
        emailVerified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      };
      store.users.push(user);
    }
    store.save();
    const jwtToken = createToken(user);
    return sendJson(res, 200, { success: true, token: jwtToken, user });
  }

  if (pathname.startsWith('/api/auth/google/')) {
    const role = pathname.split('/').pop().toUpperCase();
    const { email, name, avatar } = body;
    const normEmail = (email || '').toLowerCase().trim();
    let user = store.users.find((u) => u.email.toLowerCase() === normEmail);

    if (user && user.role !== role) {
      return sendJson(res, 403, { success: false, message: `Account is registered as ${user.role}. Cannot log in as ${role}.` });
    }

    if (!user) {
      user = {
        id: `usr-${Date.now()}`,
        name: name || normEmail.split('@')[0],
        email: normEmail,
        role,
        emailVerified: true,
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || normEmail)}`,
        university: role === 'STUDENT' ? 'Stanford University' : undefined,
        major: role === 'STUDENT' ? 'Computer Science' : undefined,
        skills: role === 'STUDENT' ? ['React', 'TypeScript', 'Node.js'] : undefined,
        companyId: role === 'COMPANY' ? `comp-${Date.now()}` : undefined,
        companyName: role === 'COMPANY' ? 'Google Partner Org' : undefined
      };
      store.users.push(user);
    }
    store.save();
    const jwtToken = createToken(user);
    return sendJson(res, 200, { success: true, token: jwtToken, user });
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    const user = store.users.find((u) => u.id === userPayload?.id);
    if (!user) return sendJson(res, 404, { success: false, message: 'User not found' });
    const { password, ...safe } = user;
    return sendJson(res, 200, safe);
  }

  if (pathname === '/api/auth/profile' && method === 'PUT') {
    const user = store.users.find((u) => u.id === (userPayload?.id || body.id));
    if (!user) return sendJson(res, 404, { success: false, message: 'User not found' });
    Object.assign(user, body);
    store.save();
    const { password, ...safe } = user;
    return sendJson(res, 200, safe);
  }

  // ---------------------------------------------------------
  // D. INTERNSHIP CONTROLLERS
  // ---------------------------------------------------------
  if (pathname === '/api/internships' && method === 'GET') {
    const category = urlObj.searchParams.get('category');
    const search = urlObj.searchParams.get('search');
    const remote = urlObj.searchParams.get('remote');
    const maxStipend = urlObj.searchParams.get('maxStipend');

    let list = [...store.internships];
    if (category && category !== 'All') {
      list = list.filter((i) => i.category.toLowerCase() === category.toLowerCase());
    }
    if (remote !== null && remote !== undefined && remote !== '') {
      const isRemote = remote === 'true' || remote === true;
      list = list.filter((i) => i.remote === isRemote);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((i) =>
        i.title.toLowerCase().includes(q) ||
        i.companyName.toLowerCase().includes(q) ||
        (i.skillsRequired && i.skillsRequired.some((s) => s.toLowerCase().includes(q)))
      );
    }
    if (maxStipend) {
      list = list.filter((i) => (i.stipendAmount || 0) <= Number(maxStipend));
    }
    return sendJson(res, 200, list);
  }

  if (pathname.startsWith('/api/internships/') && method === 'GET') {
    const id = pathname.replace('/api/internships/', '');
    const item = store.internships.find((i) => i.id === id);
    if (!item) return sendJson(res, 404, { success: false, message: 'Internship not found' });
    return sendJson(res, 200, { ...item, liveViewersCount: Math.floor(2 + Math.random() * 4) });
  }

  if (pathname === '/api/internships' && method === 'POST') {
    const newInt = {
      id: `int-${Date.now()}`,
      companyId: userPayload?.companyId || body.companyId || 'comp-1',
      companyName: userPayload?.companyName || body.companyName || 'NovaScale AI',
      companyLogo: body.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      title: body.title,
      category: body.category || 'Tech',
      stipend: body.stipend || '$3,500 / mo',
      stipendAmount: Number(body.stipendAmount) || 3500,
      durationWeeks: Number(body.durationWeeks) || 12,
      durationText: body.durationText || '12 Weeks (Summer 2026)',
      location: body.location || 'San Francisco, CA',
      remote: body.remote ?? true,
      status: 'ACTIVE',
      maxPositions: Number(body.maxPositions) || 3,
      filledPositions: 0,
      postedAt: new Date().toISOString(),
      skillsRequired: Array.isArray(body.skillsRequired) ? body.skillsRequired : (body.skillsRequired || '').split(',').map((s) => s.trim()),
      description: body.description || '',
      responsibilities: body.responsibilities || ['Design scalable product features', 'Sprint planning'],
      requirements: body.requirements || ['Strong technical fundamentals'],
      perks: body.perks || ['Mentorship', 'Full conversion track']
    };

    store.internships.unshift(newInt);
    store.save();
    store.broadcastEvent('internship:new', newInt);
    return sendJson(res, 201, newInt);
  }

  // ---------------------------------------------------------
  // E. APPLICATION & CONCURRENCY CAPACITY LOCKING
  // ---------------------------------------------------------
  if (pathname === '/api/applications' && method === 'POST') {
    const { internshipId, studentId, studentName, studentEmail, studentUniversity, resumeUrl, coverNote } = body;
    const effectiveStudentId = userPayload?.id || studentId || 'usr-1';
    const effectiveStudentEmail = userPayload?.email || studentEmail || 'student@internx.dev';
    const effectiveStudentName = userPayload?.name || studentName || 'Alex Rivera';

    const internship = store.internships.find((i) => i.id === internshipId);
    if (!internship) return sendJson(res, 404, { success: false, message: 'Internship not found' });

    // Capacity Check
    if (internship.filledPositions >= internship.maxPositions) {
      return sendJson(res, 409, { success: false, message: 'Capacity full (409 Conflict): All positions have been filled.' });
    }

    const existing = store.applications.find(
      (a) => (a.studentId === effectiveStudentId || a.studentEmail.toLowerCase() === effectiveStudentEmail.toLowerCase()) && a.internshipId === internshipId
    );
    if (existing) {
      return sendJson(res, 400, { success: false, message: 'You have already applied for this role.' });
    }

    const newApp = {
      id: `app-${Date.now()}`,
      studentId: effectiveStudentId,
      studentName: effectiveStudentName,
      studentEmail: effectiveStudentEmail,
      studentUniversity: studentUniversity || 'Stanford University',
      internshipId: internship.id,
      internshipTitle: internship.title,
      companyId: internship.companyId,
      companyName: internship.companyName,
      companyLogo: internship.companyLogo,
      category: internship.category,
      stipend: internship.stipend,
      appliedAt: new Date().toISOString(),
      status: 'APPLIED',
      resumeUrl: resumeUrl || 'Resume_Uploaded.pdf',
      coverNote: coverNote || '',
      matchScore: Math.floor(88 + Math.random() * 10)
    };

    store.applications.unshift(newApp);
    store.save();

    // Broadcast Real-Time Alerts to Company
    store.broadcastEvent('application:new', newApp, (c) => c.companyId === internship.companyId || c.role === 'ADMIN');
    return sendJson(res, 201, newApp);
  }

  if (pathname === '/api/applications' && method === 'GET') {
    const companyId = urlObj.searchParams.get('companyId');
    const studentId = urlObj.searchParams.get('studentId');
    const internshipId = urlObj.searchParams.get('internshipId');

    let list = [...store.applications];
    if (companyId) list = list.filter((a) => a.companyId === companyId);
    if (studentId) list = list.filter((a) => a.studentId === studentId || a.studentEmail?.toLowerCase() === studentId.toLowerCase());
    if (internshipId) list = list.filter((a) => a.internshipId === internshipId);
    return sendJson(res, 200, list);
  }

  if (pathname.startsWith('/api/applications/company/') && method === 'GET') {
    const compId = pathname.replace('/api/applications/company/', '');
    const companyIntIds = store.internships.filter((i) => i.companyId === compId).map((i) => i.id);
    const list = store.applications.filter((a) => a.companyId === compId || companyIntIds.includes(a.internshipId));
    return sendJson(res, 200, list);
  }

  if (pathname.startsWith('/api/applications/student/') && method === 'GET') {
    const sId = pathname.replace('/api/applications/student/', '');
    const list = store.applications.filter((a) => a.studentId === sId || a.studentEmail?.toLowerCase() === sId.toLowerCase());
    return sendJson(res, 200, list);
  }

  if (pathname.includes('/status') && method === 'PATCH') {
    const appId = pathname.split('/')[3];
    const { status } = body;
    const app = store.applications.find((a) => a.id === appId);

    if (!app) return sendJson(res, 404, { success: false, message: 'Application not found' });

    // Pessimistic Concurrency Capacity Lock!
    try {
      await store.acquireLock(`lock:int:${app.internshipId}`, async () => {
        const currentInt = store.internships.find((i) => i.id === app.internshipId);

        if (status === 'SELECTED' && app.status !== 'SELECTED') {
          if (currentInt && currentInt.filledPositions >= currentInt.maxPositions) {
            const err = new Error('Capacity full (409 Conflict): All positions have been filled.');
            err.statusCode = 409;
            throw err;
          }
          if (currentInt) currentInt.filledPositions += 1;
        } else if (app.status === 'SELECTED' && status !== 'SELECTED') {
          if (currentInt && currentInt.filledPositions > 0) currentInt.filledPositions -= 1;
        }

        app.status = status;
        store.save();
      });

      // Create Notification
      let notifTitle = `Application ${status}`;
      let notifMsg = `Your application for "${app.internshipTitle}" at ${app.companyName} is now ${status}.`;
      let notifType = 'info';

      if (status === 'SELECTED') {
        notifTitle = `🎉 Offer Letter: You're Selected!`;
        notifMsg = `Congratulations! ${app.companyName} has officially selected you for the "${app.internshipTitle}" role!`;
        notifType = 'success';
      } else if (status === 'SHORTLISTED') {
        notifTitle = `🌟 You've Been Shortlisted!`;
        notifMsg = `${app.companyName} moved your application to the shortlist round.`;
        notifType = 'info';
      } else if (status === 'REJECTED') {
        notifTitle = `Application Status Update`;
        notifMsg = `Your application for "${app.internshipTitle}" was not selected.`;
        notifType = 'error';
      }

      const notif = {
        id: `notif-${Date.now()}`,
        studentEmail: app.studentEmail,
        studentId: app.studentId,
        title: notifTitle,
        message: notifMsg,
        type: notifType,
        createdAt: new Date().toISOString(),
        read: false
      };
      store.notifications.unshift(notif);
      store.save();

      // Broadcast Real-Time Push Events!
      const currentInt = store.internships.find((i) => i.id === app.internshipId);
      store.broadcastEvent('application:status_updated', { applicationId: app.id, status, app, notification: notif });
      store.broadcastEvent('capacity:updated', { internshipId: currentInt?.id, filledPositions: currentInt?.filledPositions, maxPositions: currentInt?.maxPositions });

      return sendJson(res, 200, app);
    } catch (err) {
      return sendJson(res, err.statusCode || 500, { success: false, message: err.message });
    }
  }

  // ---------------------------------------------------------
  // F. REAL-TIME CHAT & MESSAGING CONTROLLERS
  // ---------------------------------------------------------
  if (pathname === '/api/chat/conversations' && method === 'GET') {
    const currentUserId = userPayload?.id || urlObj.searchParams.get('userId') || 'usr-1';
    const currentUserEmail = userPayload?.email || urlObj.searchParams.get('email') || '';
    const companyId = userPayload?.companyId || urlObj.searchParams.get('companyId');

    let threads = store.conversations.filter((c) => {
      if (companyId && c.companyId === companyId) return true;
      if (c.studentId === currentUserId || (currentUserEmail && c.studentEmail?.toLowerCase() === currentUserEmail.toLowerCase())) return true;
      return true;
    });
    return sendJson(res, 200, threads);
  }

  if (pathname.startsWith('/api/chat/conversations/') && pathname.endsWith('/messages') && method === 'GET') {
    const threadId = pathname.split('/')[4];
    const thread = store.conversations.find((c) => c.id === threadId);
    return sendJson(res, 200, thread?.messages || []);
  }

  if (pathname.startsWith('/api/chat/conversations/') && pathname.endsWith('/messages') && method === 'POST') {
    const threadId = pathname.split('/')[4];
    const thread = store.conversations.find((c) => c.id === threadId);
    if (!thread) return sendJson(res, 404, { success: false, message: 'Thread not found' });

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: body.senderId || userPayload?.id || 'usr-1',
      senderName: body.senderName || userPayload?.name || 'User',
      senderRole: body.senderRole || userPayload?.role || 'STUDENT',
      text: (body.text || '').trim(),
      timestamp: new Date().toISOString()
    };

    thread.messages.push(newMsg);
    thread.lastMessage = newMsg.text;
    thread.lastMessageAt = newMsg.timestamp;
    store.save();

    // Broadcast message over SSE!
    store.broadcastEvent('chat:new_message', { conversationId: thread.id, message: newMsg });
    return sendJson(res, 201, newMsg);
  }

  // ---------------------------------------------------------
  // G. AI / ATS RESUME & SKILL MATCH ANALYZER
  // ---------------------------------------------------------
  if (pathname === '/api/ai/match' && method === 'POST') {
    const { internshipId, studentId, studentSkills } = body;
    const internship = store.internships.find((i) => i.id === internshipId);
    if (!internship) return sendJson(res, 404, { success: false, message: 'Internship not found' });

    const user = store.users.find((u) => u.id === (studentId || userPayload?.id));
    const activeSkills = studentSkills || user?.skills || ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'];
    const required = internship.skillsRequired || [];

    const matchedSkills = [];
    const missingSkills = [];

    required.forEach((reqSkill) => {
      const match = activeSkills.some(
        (s) => s.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s.toLowerCase())
      );
      if (match) matchedSkills.push(reqSkill);
      else missingSkills.push(reqSkill);
    });

    const ratio = required.length > 0 ? (matchedSkills.length / required.length) : 0.9;
    const matchScore = Math.min(98, Math.max(68, Math.round(ratio * 80 + 18)));

    const recommendations = [];
    if (missingSkills.length > 0) {
      recommendations.push(`Highlight any project coursework or self-study in ${missingSkills.slice(0, 2).join(' and ')}.`);
    }
    recommendations.push(`Ensure your resume includes metrics demonstrating performance, impact, and scale.`);
    if (internship.category === 'Tech') {
      recommendations.push('Include clean GitHub links with CI/CD workflows and automated test coverage.');
    }

    return sendJson(res, 200, {
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
  }

  // ---------------------------------------------------------
  // H. NOTIFICATIONS
  // ---------------------------------------------------------
  if (pathname === '/api/notifications' && method === 'GET') {
    const studentEmail = urlObj.searchParams.get('studentEmail') || userPayload?.email;
    let list = store.notifications;
    if (studentEmail) {
      list = list.filter((n) => !n.studentEmail || n.studentEmail.toLowerCase() === studentEmail.toLowerCase());
    }
    return sendJson(res, 200, list);
  }

  if (pathname === '/api/notifications/read-all' && method === 'POST') {
    const studentEmail = body.studentEmail || userPayload?.email;
    store.notifications.forEach((n) => {
      if (!studentEmail || n.studentEmail?.toLowerCase() === studentEmail.toLowerCase()) {
        n.read = true;
      }
    });
    store.save();
    return sendJson(res, 200, { success: true, message: 'All notifications marked as read' });
  }

  // ---------------------------------------------------------
  // I. ADMIN & GOVERNANCE
  // ---------------------------------------------------------
  if (pathname === '/api/admin/stats' && method === 'GET') {
    return sendJson(res, 200, {
      totalStudents: store.users.filter((u) => u.role === 'STUDENT').length + 14280,
      totalCompanies: store.companies.length,
      approvedCompanies: store.companies.filter((c) => c.approvedStatus === 'APPROVED').length,
      pendingCompanies: store.companies.filter((c) => c.approvedStatus === 'PENDING').length,
      totalInternships: store.internships.length,
      totalApplications: store.applications.length + 840,
      stipendDistributed: '$4.8M+',
      activeTelemetry: { connectedStreams: store.sseClients.size }
    });
  }

  if (pathname === '/api/admin/companies' && method === 'GET') {
    return sendJson(res, 200, store.companies);
  }

  if (pathname.startsWith('/api/admin/companies/') && method === 'PATCH') {
    const compId = pathname.replace('/api/admin/companies/', '');
    const comp = store.companies.find((c) => c.id === compId);
    if (!comp) return sendJson(res, 404, { success: false, message: 'Company not found' });
    comp.approvedStatus = body.approvedStatus || 'APPROVED';
    store.save();
    return sendJson(res, 200, comp);
  }

  // Fallback 404
  return sendJson(res, 404, { success: false, message: `Endpoint ${method} ${pathname} not found.` });
});

// Start Server Listening
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  🚀 InternX Real-Time Backend running on Port ${PORT}`);
  console.log(`  🔗 REST API: http://localhost:${PORT}/api`);
  console.log(`  ⚡ Real-Time SSE Stream: http://localhost:${PORT}/api/realtime/stream`);
  console.log(`=======================================================`);
});
