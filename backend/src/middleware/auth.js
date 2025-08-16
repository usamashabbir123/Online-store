const jwt = require('jsonwebtoken');
const prisma = require('../lib/db');
const { logSecurityEvent } = require('../utils/securityLogger');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      await logSecurityEvent(req.user?.id || 'anonymous', 'auth_failed', 'token_missing', req.ip, req.get('User-Agent'));
      return res.status(401).json({
        success: false,
        error: 'Access token required',
        code: 'AUTH_TOKEN_MISSING'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database with security checks
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        emailVerified: true,
        twoFactorEnabled: true,
        loginAttempts: true,
        lockedUntil: true
      }
    });

    if (!user) {
      await logSecurityEvent('unknown', 'auth_failed', 'user_not_found', req.ip, req.get('User-Agent'));
      return res.status(401).json({
        success: false,
        error: 'User not found',
        code: 'AUTH_USER_NOT_FOUND'
      });
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await logSecurityEvent(user.id, 'auth_failed', 'account_locked', req.ip, req.get('User-Agent'));
      return res.status(423).json({
        success: false,
        error: 'Account is temporarily locked due to multiple failed login attempts',
        code: 'AUTH_ACCOUNT_LOCKED',
        lockedUntil: user.lockedUntil
      });
    }

    // Check account status
    if (user.status !== 'active') {
      await logSecurityEvent(user.id, 'auth_failed', 'account_inactive', req.ip, req.get('User-Agent'));
      return res.status(403).json({
        success: false,
        error: 'Account is not active',
        code: 'AUTH_ACCOUNT_INACTIVE',
        status: user.status
      });
    }

    // Check if email is verified (for non-admin users)
    if (user.role !== 'admin' && !user.emailVerified) {
      await logSecurityEvent(user.id, 'auth_failed', 'email_not_verified', req.ip, req.get('User-Agent'));
      return res.status(403).json({
        success: false,
        error: 'Email verification required',
        code: 'AUTH_EMAIL_NOT_VERIFIED'
      });
    }

    req.user = user;
    
    // Log successful authentication
    await logSecurityEvent(user.id, 'auth_success', 'token_validated', req.ip, req.get('User-Agent'));
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      await logSecurityEvent(req.user?.id || 'unknown', 'auth_failed', 'token_expired', req.ip, req.get('User-Agent'));
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        code: 'AUTH_TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      await logSecurityEvent(req.user?.id || 'unknown', 'auth_failed', 'token_invalid', req.ip, req.get('User-Agent'));
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'AUTH_TOKEN_INVALID'
      });
    }

    await logSecurityEvent(req.user?.id || 'unknown', 'auth_failed', 'unknown_error', req.ip, req.get('User-Agent'));
    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

const requireRole = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      await logSecurityEvent(req.user.id, 'auth_failed', 'insufficient_permissions', req.ip, req.get('User-Agent'));
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'AUTH_INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

const requireTwoFactor = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Check if 2FA is enabled for the user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { twoFactorEnabled: true }
    });

    if (user.twoFactorEnabled) {
      const twoFactorToken = req.headers['x-2fa-token'];
      
      if (!twoFactorToken) {
        return res.status(401).json({
          success: false,
          error: 'Two-factor authentication token required',
          code: 'AUTH_2FA_REQUIRED'
        });
      }

      // Verify 2FA token (implement TOTP verification here)
      // For now, we'll just check if it exists
      if (!twoFactorToken || twoFactorToken.length < 6) {
        await logSecurityEvent(req.user.id, 'auth_failed', 'invalid_2fa_token', req.ip, req.get('User-Agent'));
        return res.status(401).json({
          success: false,
          error: 'Invalid two-factor authentication token',
          code: 'AUTH_2FA_INVALID'
        });
      }
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Two-factor authentication verification failed',
      code: 'AUTH_2FA_FAILED'
    });
  }
};

const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required',
      code: 'AUTH_EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

const requireActiveAccount = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (req.user.status !== 'active') {
    return res.status(403).json({
      success: false,
      error: 'Account is not active',
      code: 'AUTH_ACCOUNT_INACTIVE'
    });
  }

  next();
};

// Role-based middleware
const requireAdmin = requireRole(['admin']);
const requireModerator = requireRole(['admin', 'moderator']);
const requireSeller = requireRole(['seller', 'admin', 'moderator']);
const requireCustomer = requireRole(['customer', 'seller', 'admin', 'moderator']);

// Export middleware functions
module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireModerator,
  requireSeller,
  requireCustomer,
  requireTwoFactor,
  requireEmailVerification,
  requireActiveAccount
};
