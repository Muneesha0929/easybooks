const JournalEntry = require('../models/JournalEntry');

// @route   POST /api/journal
// @desc    Create new journal entry
// @access  Private
exports.createEntry = async (req, res) => {
  try {
    const { date, account, accountType, debit, credit, narration } = req.body;

    // Validation
    if (!account || !accountType || !narration) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    if (debit === 0 && credit === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Either debit or credit must be greater than 0' 
      });
    }

    const entry = await JournalEntry.create({
      userId: req.user.id,
      date: date || Date.now(),
      account,
      accountType,
      debit: debit || 0,
      credit: credit || 0,
      narration
    });

    res.status(201).json({ 
      success: true, 
      message: 'Journal entry created successfully',
      data: entry 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @route   GET /api/journal
// @desc    Get all journal entries for logged-in user
// @access  Private
exports.getAllEntries = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id })
      .sort({ date: -1, createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: entries.length,
      data: entries 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @route   GET /api/journal/ledger
// @desc    Get ledger (account-wise summary)
// @access  Private
exports.getLedger = async (req, res) => {
  try {
    const ledger = await JournalEntry.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$account',
          accountType: { $first: '$accountType' },
          totalDebit: { $sum: '$debit' },
          totalCredit: { $sum: '$credit' }
        }
      },
      {
        $project: {
          account: '$_id',
          accountType: 1,
          totalDebit: 1,
          totalCredit: 1,
          balance: { $subtract: ['$totalDebit', '$totalCredit'] }
        }
      },
      { $sort: { account: 1 } }
    ]);

    res.status(200).json({ 
      success: true, 
      data: ledger 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @route   GET /api/journal/balance-sheet
// @desc    Get balance sheet
// @access  Private
exports.getBalanceSheet = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id });

    const assets = [];
    const liabilities = [];
    const equity = [];

    const accountSummary = {};

    entries.forEach(entry => {
      if (!accountSummary[entry.account]) {
        accountSummary[entry.account] = {
          account: entry.account,
          accountType: entry.accountType,
          debit: 0,
          credit: 0
        };
      }
      accountSummary[entry.account].debit += entry.debit;
      accountSummary[entry.account].credit += entry.credit;
    });

    Object.values(accountSummary).forEach(acc => {
      const balance = acc.debit - acc.credit;
      const item = { account: acc.account, balance };

      if (acc.accountType === 'Asset') assets.push(item);
      if (acc.accountType === 'Liability') liabilities.push(item);
      if (acc.accountType === 'Equity') equity.push(item);
    });

    const totalAssets = assets.reduce((sum, item) => sum + item.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + item.balance, 0);
    const totalEquity = equity.reduce((sum, item) => sum + item.balance, 0);

    res.status(200).json({
      success: true,
      data: {
        assets,
        liabilities,
        equity,
        totalAssets,
        totalLiabilities,
        totalEquity
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @route   GET /api/journal/profit-loss
// @desc    Get profit & loss statement
// @access  Private
exports.getProfitLoss = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id });

    const revenue = [];
    const expenses = [];

    const accountSummary = {};

    entries.forEach(entry => {
      if (!accountSummary[entry.account]) {
        accountSummary[entry.account] = {
          account: entry.account,
          accountType: entry.accountType,
          debit: 0,
          credit: 0
        };
      }
      accountSummary[entry.account].debit += entry.debit;
      accountSummary[entry.account].credit += entry.credit;
    });

    Object.values(accountSummary).forEach(acc => {
      const amount = Math.abs(acc.credit - acc.debit);
      const item = { account: acc.account, amount };

      if (acc.accountType === 'Revenue') revenue.push(item);
      if (acc.accountType === 'Expense') expenses.push(item);
    });

    const totalRevenue = revenue.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    res.status(200).json({
      success: true,
      data: {
        revenue,
        expenses,
        totalRevenue,
        totalExpenses,
        netProfit
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @route   PUT /api/journal/:id
// @desc    Update journal entry
// @access  Private
exports.updateEntry = async (req, res) => {
  try {
    let entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ 
        success: false,
        message: 'Journal entry not found' 
      });
    }

    // Make sure user owns the entry
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this entry' 
      });
    }

    entry = await JournalEntry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ 
      success: true, 
      message: 'Journal entry updated successfully',
      data: entry 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @route   DELETE /api/journal/:id
// @desc    Delete journal entry
// @access  Private
exports.deleteEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ 
        success: false,
        message: 'Journal entry not found' 
      });
    }

    // Make sure user owns the entry
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this entry' 
      });
    }

    await entry.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @route   GET /api/journal/dashboard
// @desc    Get dashboard statistics
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id });

    const totalEntries = entries.length;
    const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);

    // Recent entries
    const recentEntries = await JournalEntry.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalEntries,
        totalDebit,
        totalCredit,
        balance: totalDebit - totalCredit,
        recentEntries
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
