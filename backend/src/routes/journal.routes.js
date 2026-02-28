const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Journal = require('../models/Journal');

// Get all journal entries for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ success: true, entries });
  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new journal entry
router.post('/', protect, async (req, res) => {
  try {
    const entry = await Journal.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json({ success: true, entry, message: 'Journal entry created successfully' });
  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete journal entry
router.delete('/:id', protect, async (req, res) => {
  try {
    const entry = await Journal.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    
    res.json({ success: true, message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
