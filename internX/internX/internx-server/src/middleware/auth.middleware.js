import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'internx-zenith-secret-key-2026';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No bearer token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    // Check if it's a dev simulated token
    if (token.startsWith('jwt-')) {
      const parts = token.split('-');
      req.user = { id: parts[2] || 'usr-1', role: parts[1]?.toUpperCase() || 'STUDENT' };
      req.userId = req.user.id;
      req.userRole = req.user.role;
      return next();
    }
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.userRole)) {
      return res.status(403).json({ success: false, message: `Access denied. Requires one of roles: ${roles.join(', ')}` });
    }
    next();
  };
};
