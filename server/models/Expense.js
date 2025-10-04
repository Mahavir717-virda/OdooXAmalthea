const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'To Submit' }, // To Submit, Waiting Approval, Approved, Rejected
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
