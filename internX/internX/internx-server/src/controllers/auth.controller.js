import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { store } from '../data/store.js';
import { JWT_SECRET } from '../middleware/auth.middleware.js';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId || null,
      companyName: user.companyName || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role, university, major } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normEmail = email.toLowerCase().trim();
    let existing = store.users.find((u) => u.email.toLowerCase() === normEmail);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userRole = (role || 'STUDENT').toUpperCase();

    if (existing) {
      existing.name = name || existing.name;
      existing.password = hashedPassword;
      existing.role = userRole;
      existing.phone = phone || existing.phone;
      if (university) existing.university = university;
      if (major) existing.major = major;
      store.save();
      const token = generateToken(existing);
      return res.json({ success: true, token, user: existing, message: 'Account updated successfully.' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name || normEmail.split('@')[0],
      email: normEmail,
      phone: phone || '',
      password: hashedPassword,
      role: userRole,
      emailVerified: true,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || normEmail)}`,
      university: university || (userRole === 'STUDENT' ? 'Stanford University' : undefined),
      major: major || (userRole === 'STUDENT' ? 'Computer Science' : undefined),
      gradYear: userRole === 'STUDENT' ? '2026' : undefined,
      skills: userRole === 'STUDENT' ? ['React', 'JavaScript', 'Node.js', 'Python'] : undefined,
      createdAt: new Date().toISOString()
    };

    store.users.push(newUser);
    store.save();

    const token = generateToken(newUser);
    return res.status(201).json({
      success: true,
      token,
      user: newUser,
      message: 'User registered successfully.'
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Registration failed.', error: err.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    const normEmail = email.toLowerCase().trim();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    store.setOtp(normEmail, otp);

    console.log(`[OTP DISPATCH] Real 6-digit OTP for ${normEmail} is: ${otp}`);
    return res.json({
      success: true,
      message: `6-digit OTP sent to ${normEmail}. (Dev OTP: ${otp})`,
      devOtp: otp,
      email: normEmail
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const normEmail = email.toLowerCase().trim();
    const record = store.getOtp(normEmail);

    // Support dev master OTP '123456' or exact generated OTP
    const isValid = (record && record.otp === String(otp).trim() && Date.now() <= record.expiresAt) || String(otp).trim() === '123456';

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code. Please enter 123456 or request a new code.' });
    }

    store.clearOtp(normEmail);

    let user = store.users.find((u) => u.email.toLowerCase() === normEmail);
    if (!user) {
      const name = normEmail.split('@')[0];
      user = {
        id: `usr-${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: normEmail,
        role: 'STUDENT',
        emailVerified: true,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normEmail)}`,
        university: 'Stanford University',
        major: 'Computer Science',
        gradYear: '2026',
        skills: ['React', 'JavaScript', 'Node.js']
      };
      store.users.push(user);
    } else {
      user.emailVerified = true;
    }

    store.save();
    const token = generateToken(user);
    return res.json({ success: true, token, user, message: 'OTP verified successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Verification failed.' });
  }
};

export const resendOtp = async (req, res) => {
  return sendOtp(req, res);
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Student email and password are required.' });
    }

    const normEmail = email.toLowerCase().trim();
    let user = store.users.find((u) => u.email.toLowerCase() === normEmail);

    if (user) {
      if (user.role && user.role !== 'STUDENT') {
        return res.status(403).json({
          success: false,
          message: `Account is registered as ${user.role}. Please log in via the ${user.role.toLowerCase()} portal.`
        });
      }
      user.emailVerified = true;
    } else {
      // Auto-onboard new student account
      const nameParts = normEmail.split('@')[0].split(/[\._]/);
      const formattedName = nameParts.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Student';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = {
        id: `usr-${Date.now()}`,
        name: formattedName,
        email: normEmail,
        password: hashedPassword,
        role: 'STUDENT',
        emailVerified: true,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formattedName)}`,
        university: 'Stanford University',
        major: 'Computer Science',
        gradYear: '2026',
        skills: ['React', 'TypeScript', 'Node.js', 'Python']
      };
      store.users.push(user);
    }

    store.save();
    const token = generateToken(user);
    return res.json({ success: true, token, user, message: 'Student logged in successfully.' });
  } catch (err) {
    console.error('Student login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed.' });
  }
};

export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Company email and password are required.' });
    }

    const normEmail = email.toLowerCase().trim();
    let user = store.users.find((u) => u.email.toLowerCase() === normEmail);

    if (user) {
      if (user.role && user.role !== 'COMPANY') {
        return res.status(403).json({
          success: false,
          message: `Account is registered as ${user.role}. Cannot access Company portal.`
        });
      }
      user.emailVerified = true;
    } else {
      const nameParts = normEmail.split('@')[0].split(/[\._]/);
      const formattedName = nameParts.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Recruiter';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = {
        id: `usr-comp-${Date.now()}`,
        name: formattedName,
        email: normEmail,
        password: hashedPassword,
        role: 'COMPANY',
        companyId: `comp-${Date.now()}`,
        companyName: 'Partner Enterprise',
        emailVerified: true,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(formattedName)}`
      };
      store.users.push(user);
    }

    store.save();
    const token = generateToken(user);
    return res.json({ success: true, token, user, message: 'Company logged in successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Login failed.' });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Admin email and password are required.' });
    }

    const normEmail = email.toLowerCase().trim();
    let user = store.users.find((u) => u.email.toLowerCase() === normEmail);

    if (user) {
      if (user.role && user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: `Account is registered as ${user.role}. Cannot access Admin portal.`
        });
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = {
        id: `usr-admin-${Date.now()}`,
        name: 'Platform Administrator',
        email: normEmail,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      };
      store.users.push(user);
    }

    store.save();
    const token = generateToken(user);
    return res.json({ success: true, token, user, message: 'Admin logged in successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Login failed.' });
  }
};

export const loginGoogleRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { email, name, avatar } = req.body;
    const targetRole = (role || 'STUDENT').toUpperCase();
    const normEmail = (email || '').toLowerCase().trim();

    if (!normEmail) {
      return res.status(400).json({ success: false, message: 'Google account email is required.' });
    }

    let user = store.users.find((u) => u.email.toLowerCase() === normEmail);
    if (!user) {
      user = {
        id: `usr-${Date.now()}`,
        name: name || normEmail.split('@')[0],
        email: normEmail,
        role: targetRole,
        emailVerified: true,
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || normEmail)}`,
        university: targetRole === 'STUDENT' ? 'Stanford University' : undefined,
        major: targetRole === 'STUDENT' ? 'Computer Science' : undefined,
        skills: targetRole === 'STUDENT' ? ['React', 'TypeScript', 'Node.js'] : undefined,
        companyId: targetRole === 'COMPANY' ? `comp-${Date.now()}` : undefined,
        companyName: targetRole === 'COMPANY' ? 'Google Partner Org' : undefined
      };
      store.users.push(user);
    } else if (user.role !== targetRole) {
      return res.status(403).json({
        success: false,
        message: `Account is registered as ${user.role}. Cannot log in as ${targetRole}.`
      });
    }

    store.save();
    const token = generateToken(user);
    return res.json({ success: true, token, user, message: `Signed in with Google as ${targetRole}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Google authentication failed.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = store.users.find((u) => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const { password, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = store.users.find((u) => u.id === req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { name, phone, university, major, gradYear, skills, resumeUrl, avatar, bio } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (university) user.university = university;
    if (major) user.major = major;
    if (gradYear) user.gradYear = gradYear;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    if (resumeUrl) user.resumeUrl = resumeUrl;
    if (avatar) user.avatar = avatar;
    if (bio) user.bio = bio;

    store.save();
    const { password, ...safeUser } = user;
    return res.json({ success: true, user: safeUser, message: 'Profile updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};
