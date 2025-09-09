const express = require('express');
const router = express.Router();

// Simple auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'No authorization token' });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// @route   GET /api/v1/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // For MVP, return mock notifications
    const mockNotifications = [
      {
        _id: 'mock1',
        type: 'appointment_reminder',
        title: 'Appointment Reminder',
        message: 'Your Abhyanga session is scheduled for tomorrow at 10:00 AM',
        isRead: false,
        createdAt: new Date()
      },
      {
        _id: 'mock2',
        type: 'pre_procedure',
        title: 'Pre-procedure Instructions',
        message: 'Please avoid heavy meals 2 hours before your therapy session',
        isRead: false,
        createdAt: new Date(Date.now() - 86400000) // 1 day ago
      }
    ];

    res.json({
      success: true,
      count: mockNotifications.length,
      data: mockNotifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    // For MVP, just return success
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
});

module.exports = router;
