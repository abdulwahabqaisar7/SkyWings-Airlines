const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { queryOne } = require('../config/database');

// The signing key must come from the environment (see .env.example). If it is
// missing we fall back to a random per-process key rather than a hardcoded one:
// the app still runs locally, but tokens stop working after a restart.
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('⚠️  JWT_SECRET is not set - using a random key for this process only.');
  console.warn('   Set JWT_SECRET in your .env file to keep sessions valid across restarts.');
  return crypto.randomBytes(48).toString('hex');
})();

// Middleware to verify JWT token
async function authenticate(req, res, next) {
  try {
    let token;
    const authHeader = req.headers.authorization;

    // Prefer Authorization header if present
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.headers.cookie) {
      // Fallback to cookie named 'token' (httpOnly cookie set by server)
      const match = req.headers.cookie.split(';').map(c => c.trim()).find(c => c.startsWith('token='));
      if (match) {
        token = decodeURIComponent(match.split('=')[1]);
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided'
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Get user from database to ensure they still exist and are active
      const user = await queryOne(
        'SELECT user_id, email, role, status FROM users WHERE user_id = ? AND status = ?',
        [decoded.userId, 'active']
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: User not found or inactive'
        });
      }

      req.user = {
        userId: user.user_id,
        email: user.email,
        role: user.role
      };
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired token'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
}

// Middleware to require admin role
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required'
    });
  }
  next();
}

// Generate JWT token
function generateToken(userId, email, role) {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = {
  authenticate,
  requireAdmin,
  generateToken
};

