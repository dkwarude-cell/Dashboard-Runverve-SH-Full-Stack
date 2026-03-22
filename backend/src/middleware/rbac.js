/**
 * Middleware: Role-Based Access Control
 * Ensures only users with allowed roles can access the endpoint
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        data: null,
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this action',
        data: null,
      });
    }

    next();
  };
};

/**
 * Middleware: Single role check
 */
export const requireAdminRole = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin role required',
      data: null,
    });
  }
  next();
};

export const requireTherapistRole = (req, res, next) => {
  if (!req.user || req.user.role !== 'therapist') {
    return res.status(403).json({
      success: false,
      message: 'Therapist role required',
      data: null,
    });
  }
  next();
};

export const requireClientRole = (req, res, next) => {
  if (!req.user || req.user.role !== 'client') {
    return res.status(403).json({
      success: false,
      message: 'Client role required',
      data: null,
    });
  }
  next();
};

export default {
  requireRole,
  requireAdminRole,
  requireTherapistRole,
  requireClientRole,
};
