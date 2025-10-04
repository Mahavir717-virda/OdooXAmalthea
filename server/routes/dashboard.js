const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense'); // Assuming you have an Expense model

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const totalExpenses = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const pendingApprovals = await Expense.countDocuments({ user: userId, status: 'Waiting Approval' });

    const approvedThisMonth = await Expense.countDocuments({
      user: userId,
      status: 'Approved',
      updatedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    });

    const recentExpenses = await Expense.find({ user: userId })
      .sort({ date: -1 })
      .limit(5);

    const expenseCategories = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', amount: { $sum: '$amount' } } },
      { $project: { name: '$_id', amount: 1, _id: 0 } },
      { $sort: { amount: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalExpenses: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
        pendingApprovals,
        approvedThisMonth,
        recentExpenses,
        expenseCategories,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;