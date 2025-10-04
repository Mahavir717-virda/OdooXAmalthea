import React, { useState } from 'react';
import { Check, X, MessageSquare, Calendar, DollarSign } from 'lucide-react';
import { Expense, ExpenseApproval } from '../../types';
import { mockExpenses } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ApprovalQueue: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>(
    mockExpenses.filter(e => e.status === 'pending')
  );
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (expenseId: string) => {
    setIsProcessing(true);
    try {
      console.log('Approving expense:', expenseId, 'Comments:', comments);

      setExpenses(expenses.filter(e => e.id !== expenseId));
      setSelectedExpense(null);
      setComments('');
    } catch (error) {
      console.error('Approval error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (expenseId: string) => {
    if (!comments.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Rejecting expense:', expenseId, 'Comments:', comments);

      setExpenses(expenses.filter(e => e.id !== expenseId));
      setSelectedExpense(null);
      setComments('');
    } catch (error) {
      console.error('Rejection error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Approvals Overview</h2>
        <div className="px-4 py-2 bg-blue-900 border border-blue-700 rounded-lg">
          <span className="text-blue-200 font-semibold">
            {expenses.length} Pending Approval{expenses.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border-2 border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Date Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No expenses awaiting approval
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <React.Fragment key={expense.id}>
                    <tr className="hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {expense.employeeName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Calendar size={16} className="text-gray-500" />
                          {new Date(expense.submittedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-200 border border-gray-600">
                          {expense.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm font-semibold text-white">
                          <DollarSign size={16} className="text-green-400" />
                          {expense.amount.toFixed(2)} {expense.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-200 border border-yellow-700">
                          Stage {expense.currentApprovalStage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setSelectedExpense(
                                selectedExpense === expense.id ? null : expense.id
                              )
                            }
                            className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded-lg transition-colors border border-gray-600"
                          >
                            <MessageSquare size={14} />
                            Comment
                          </button>
                          <button
                            onClick={() => handleApprove(expense.id)}
                            disabled={isProcessing}
                            className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors border border-green-500 disabled:opacity-50"
                          >
                            <Check size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(expense.id)}
                            disabled={isProcessing}
                            className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors border border-red-500 disabled:opacity-50"
                          >
                            <X size={14} />
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                    {selectedExpense === expense.id && (
                      <tr className="bg-gray-700/30">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="space-y-3">
                            <div className="text-sm text-gray-300">
                              <strong>Description:</strong> {expense.description}
                            </div>
                            <div>
                              <label className="block text-gray-300 text-sm font-semibold mb-2">
                                Comments (optional for approval, required for rejection)
                              </label>
                              <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                                rows={3}
                                placeholder="Add your comments here..."
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
