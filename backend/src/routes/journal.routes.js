const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Journal = require('../models/Journal');


// ================= GET ALL JOURNALS =================
router.get('/', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const entries = await Journal.find({ userId: req.user.id })
      .sort({ date: -1 });

    res.json({ success: true, entries });

  } catch (error) {
    console.error('Get journal entries error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ================= GET SINGLE JOURNAL =================
router.get('/:id', protect, async (req, res) => {
  try {
    console.log("Requested ID:", req.params.id);
    console.log("User ID:", req.user.id);

    const entry = await Journal.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    console.log("Found Entry:", entry);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    res.json({ success: true, entry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ================= CREATE JOURNAL =================
router.post('/', protect, async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const entry = await Journal.create({
      date: req.body.date,
      accountName: req.body.accountName,
      debit: req.body.debit,
      credit: req.body.credit,
      narration: req.body.narration,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      entry,
      message: 'Journal entry created successfully'
    });

  } catch (error) {
    console.error('Create journal entry error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ================= UPDATE JOURNAL =================
router.put('/:id', protect, async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid journal ID' });
    }

    const updatedEntry = await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        date: req.body.date,
        accountName: req.body.accountName,
        debit: req.body.debit,
        credit: req.body.credit,
        narration: req.body.narration
      },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    res.json({
      success: true,
      entry: updatedEntry,
      message: 'Journal updated successfully'
    });

  } catch (error) {
    console.error('Update journal error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ================= DELETE JOURNAL =================
router.delete('/:id', protect, async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid journal ID' });
    }

    const entry = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    res.json({ success: true, message: 'Entry deleted successfully' });

  } catch (error) {
    console.error('Delete journal entry error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;