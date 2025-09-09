const express = require('express');
const router = express.Router();

// Placeholder routes for MVP
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Practitioners endpoint - Coming soon in full implementation' });
});

module.exports = router;
