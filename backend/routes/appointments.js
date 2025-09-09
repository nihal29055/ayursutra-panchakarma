const express = require('express');
const Appointment = require('../models/Appointment');
const router = express.Router();

// Simple auth middleware (same as in patients.js)
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

// @route   POST /api/v1/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      createdBy: req.user.userId
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Populate the appointment with related data
    await appointment.populate([
      { path: 'patientId', select: 'firstName lastName phone' },
      { path: 'practitionerId', select: 'firstName lastName' },
      { path: 'therapyId', select: 'name duration' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
});

// @route   GET /api/v1/appointments
// @desc    Get appointments based on user role
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    let filter = {};
    
    // Role-based filtering
    if (req.user.role === 'patient') {
      // Get appointments for the current patient
      const Patient = require('../models/Patient');
      const patient = await Patient.findOne({ userId: req.user.userId });
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient profile not found'
        });
      }
      filter.patientId = patient._id;
    } else if (req.user.role === 'practitioner') {
      // Get appointments for the current practitioner
      // For MVP, we'll return all appointments - in full version, filter by practitioner
      filter = { status: { $ne: 'cancelled' } };
    } else if (req.user.role === 'admin') {
      // Admins can see all appointments
      filter = {};
    }

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'firstName lastName phone')
      .populate('practitionerId', 'firstName lastName')
      .populate('therapyId', 'name duration')
      .sort({ dateTime: 1 })
      .limit(100);

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Fetch appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
});

// @route   GET /api/v1/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'firstName lastName phone')
      .populate('practitionerId', 'firstName lastName')
      .populate('therapyId', 'name duration');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'patientId', select: 'firstName lastName phone' },
      { path: 'practitionerId', select: 'firstName lastName' },
      { path: 'therapyId', select: 'name duration' }
    ]);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
});

module.exports = router;
