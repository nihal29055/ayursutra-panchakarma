const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Patient = require('../models/Patient');
const router = express.Router();

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @route   POST /api/v1/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phone, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      role: role || 'patient'
    });

    await user.save();

    // If registering as patient, create patient profile
    if (user.role === 'patient' && firstName && lastName) {
      const patient = new Patient({
        userId: user._id,
        firstName,
        lastName,
        phone: phone || '',
        dateOfBirth: dateOfBirth || new Date('1990-01-01'),
        gender: 'prefer-not-to-say',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'India'
        },
        emergencyContact: {
          name: 'Emergency Contact',
          relationship: 'Family',
          phone: phone || ''
        }
      });

      await patient.save();
    }

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Authenticate user
    const result = await User.authenticate(email, password);
    
    if (!result.success) {
      let message = 'Invalid credentials';
      if (result.reason === User.failedLogin.MAX_ATTEMPTS) {
        message = 'Account locked due to too many failed login attempts';
      }
      
      return res.status(401).json({
        success: false,
        message
      });
    }

    // Generate token
    const token = generateToken(result.user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: result.user._id,
        email: result.user.email,
        role: result.user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// @route   GET /api/v1/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // Extract token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Get profile based on role
    let profile = null;
    if (user.role === 'patient') {
      profile = await Patient.findOne({ userId: user._id });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
});

// @route   POST /api/v1/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    const newToken = generateToken(user);

    res.json({
      success: true,
      token: newToken
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;
