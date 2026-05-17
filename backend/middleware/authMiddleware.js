const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');

      // Attach user basic info to the request object
      req.user = {
        id: decoded.id,
        role: decoded.role
      };

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to restrict access to admins only
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Restricted: Admin access required' });
  }
};

// Middleware for any clinical staff (Admin, Dentist, Receptionist)
exports.staffOnly = (req, res, next) => {
  const staffRoles = ['admin', 'dentist', 'receptionist'];
  if (req.user && staffRoles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Restricted: Staff access required' });
  }
};

// Middleware for medical staff only (Admin, Dentist)
exports.clinicalOnly = (req, res, next) => {
  const clinicalRoles = ['admin', 'dentist'];
  if (req.user && clinicalRoles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Restricted: Clinical authorization required' });
  }
};
