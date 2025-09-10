const express = require('express');
const Practitioner = require('../models/Practitioner');
const router = express.Router();

// Simple auth middleware (same as in other routes)
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

// @route   GET /api/v1/practitioners
// @desc    Get all practitioners (public) or practitioner profile (if logged in as practitioner)
// @access  Public/Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    let practitioners;
    
    if (req.user.role === 'practitioner') {
      // Practitioner can only see their own profile
      practitioners = await Practitioner.findOne({ userId: req.user.userId })
        .populate('userId', 'email lastLogin');
    } else {
      // Public access - show all active practitioners
      practitioners = await Practitioner.find({ status: 'active' })
        .populate('userId', 'email')
        .sort({ 'ratings.averageRating': -1, experience: -1 })
        .limit(50);
    }

    res.json({
      success: true,
      count: Array.isArray(practitioners) ? practitioners.length : 1,
      data: practitioners
    });
  } catch (error) {
    console.error('Fetch practitioners error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching practitioners',
      error: error.message
    });
  }
});

// @route   GET /api/v1/practitioners/:id
// @desc    Get single practitioner by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const practitioner = await Practitioner.findById(req.params.id)
      .populate('userId', 'email lastLogin');

    if (!practitioner) {
      return res.status(404).json({
        success: false,
        message: 'Practitioner not found'
      });
    }

    res.json({
      success: true,
      data: practitioner
    });
  } catch (error) {
    console.error('Fetch practitioner error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching practitioner',
      error: error.message
    });
  }
});

// @route   POST /api/v1/practitioners
// @desc    Create new practitioner profile
// @access  Private (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create practitioner profiles'
      });
    }

    const practitioner = new Practitioner(req.body);
    await practitioner.save();

    res.status(201).json({
      success: true,
      message: 'Practitioner profile created successfully',
      data: practitioner
    });
  } catch (error) {
    console.error('Create practitioner error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating practitioner profile',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/practitioners/:id
// @desc    Update practitioner profile
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const practitioner = await Practitioner.findById(req.params.id);

    if (!practitioner) {
      return res.status(404).json({
        success: false,
        message: 'Practitioner not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'practitioner' && practitioner.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update practitioner
    const updatedPractitioner = await Practitioner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'email');

    res.json({
      success: true,
      message: 'Practitioner profile updated successfully',
      data: updatedPractitioner
    });
  } catch (error) {
    console.error('Update practitioner error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating practitioner profile',
      error: error.message
    });
  }
});

// @route   DELETE /api/v1/practitioners/:id
// @desc    Delete practitioner profile (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete practitioner profiles'
      });
    }

    const practitioner = await Practitioner.findById(req.params.id);

    if (!practitioner) {
      return res.status(404).json({
        success: false,
        message: 'Practitioner not found'
      });
    }

    // Soft delete by updating status
    practitioner.status = 'inactive';
    await practitioner.save();

    res.json({
      success: true,
      message: 'Practitioner profile deactivated successfully'
    });
  } catch (error) {
    console.error('Delete practitioner error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating practitioner profile',
      error: error.message
    });
  }
});

// @route   GET /api/v1/practitioners/:id/appointments
// @desc    Get practitioner's appointments
// @access  Private
router.get('/:id/appointments', authMiddleware, async (req, res) => {
  try {
    const practitioner = await Practitioner.findById(req.params.id);

    if (!practitioner) {
      return res.status(404).json({
        success: false,
        message: 'Practitioner not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'practitioner' && practitioner.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const appointments = await practitioner.getUpcomingAppointments();

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Fetch practitioner appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching practitioner appointments',
      error: error.message
    });
  }
});

// @route   GET /api/v1/practitioners/specialization/:specialization
// @desc    Get practitioners by specialization
// @access  Public
router.get('/specialization/:specialization', async (req, res) => {
  try {
    const practitioners = await Practitioner.findBySpecialization(req.params.specialization);

    res.json({
      success: true,
      count: practitioners.length,
      data: practitioners
    });
  } catch (error) {
    console.error('Fetch practitioners by specialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching practitioners by specialization',
      error: error.message
    });
  }
});

// @route   GET /api/v1/practitioners/available/:date/:time
// @desc    Get available practitioners for specific date and time
// @access  Public
router.get('/available/:date/:time', async (req, res) => {
  try {
    const { date, time } = req.params;
    const appointmentDate = new Date(date);
    const appointmentTime = time;

    const practitioners = await Practitioner.findAvailable(appointmentDate, appointmentTime);

    res.json({
      success: true,
      count: practitioners.length,
      data: practitioners
    });
  } catch (error) {
    console.error('Fetch available practitioners error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available practitioners',
      error: error.message
    });
  }
});

module.exports = router;
