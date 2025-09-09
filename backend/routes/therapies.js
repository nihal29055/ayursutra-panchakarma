const express = require('express');
const Therapy = require('../models/Therapy');
const router = express.Router();

// @route   GET /api/v1/therapies
// @desc    Get all active therapies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const therapies = await Therapy.find({ status: 'active' })
      .sort({ popularity: -1, averageRating: -1 })
      .limit(50);

    res.json({
      success: true,
      count: therapies.length,
      data: therapies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching therapies',
      error: error.message
    });
  }
});

// @route   GET /api/v1/therapies/:id
// @desc    Get single therapy by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const therapy = await Therapy.findById(req.params.id);

    if (!therapy) {
      return res.status(404).json({
        success: false,
        message: 'Therapy not found'
      });
    }

    res.json({
      success: true,
      data: therapy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching therapy',
      error: error.message
    });
  }
});

module.exports = router;
