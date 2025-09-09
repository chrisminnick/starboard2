const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res
        .status(401)
        .json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists and has access
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: 'User not found, authorization denied' });
    }

    if (!user.hasAccess()) {
      return res.status(403).json({
        message: 'Your trial has expired. Please subscribe to continue.',
        trialExpired: true,
      });
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

module.exports = auth;
