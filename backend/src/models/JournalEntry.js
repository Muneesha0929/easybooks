const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  account: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true
  },
  accountType: {
    type: String,
    enum: ['Asset', 'Liability', 'Revenue', 'Expense', 'Equity'],
    required: true
  },
  debit: {
    type: Number,
    default: 0,
    min: 0
  },
  credit: {
    type: Number,
    default: 0,
    min: 0
  },
  narration: {
    type: String,
    required: [true, 'Narration is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
journalEntrySchema.index({ userId: 1, date: -1 });
journalEntrySchema.index({ userId: 1, account: 1 });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
