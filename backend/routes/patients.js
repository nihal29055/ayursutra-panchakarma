const express = require('express');
const Patient = require('../models/Patient');
const router = express.Router();

// Simple middleware to extract user info (for MVP - basic auth check)
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

// @route   GET /api/v1/patients
// @desc    Get all patients (admin/practitioner) or current patient
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    let patients;
    
    if (req.user.role === 'patient') {
      // Patient can only see their own profile
      patients = await Patient.findOne({ userId: req.user.userId })
        .populate('userId', 'email');
    } else if (req.user.role === 'practitioner' || req.user.role === 'admin') {
      // Practitioners and admins can see all patients
      patients = await Patient.find({ status: 'active' })
        .populate('userId', 'email lastLogin')
        .sort({ createdAt: -1 })
        .limit(100);
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      count: Array.isArray(patients) ? patients.length : 1,
      data: patients
    });
  } catch (error) {
    console.error('Fetch patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
});

// @route   GET /api/v1/patients/:id
// @desc    Get single patient by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('userId', 'email lastLogin');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'patient' && patient.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Fetch patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient',
      error: error.message
    });
  }
});

// @route   POST /api/v1/patients
// @desc    Create new patient profile (admin only)
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create patient profiles directly'
      });
    }

    const patient = new Patient(req.body);
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Patient profile created successfully',
      data: patient
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating patient profile',
      error: error.message
    });
  }
});

// @route   PUT /api/v1/patients/:id
// @desc    Update patient profile
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'patient' && patient.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update patient
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'email');

    res.json({
      success: true,
      message: 'Patient profile updated successfully',
      data: updatedPatient
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating patient profile',
      error: error.message
    });
  }
});

// @route   DELETE /api/v1/patients/:id
// @desc    Delete patient profile (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete patient profiles'
      });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Soft delete by updating status
    patient.status = 'inactive';
    await patient.save();

    res.json({
      success: true,
      message: 'Patient profile deactivated successfully'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating patient profile',
      error: error.message
    });
  }
});

// @route   GET /api/v1/patients/:id/appointments
// @desc    Get patient's appointments
// @access  Private
router.get('/:id/appointments', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'patient' && patient.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const appointments = await patient.getUpcomingAppointments();

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Fetch patient appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient appointments',
      error: error.message
    });
  }
});

module.exports = router;
