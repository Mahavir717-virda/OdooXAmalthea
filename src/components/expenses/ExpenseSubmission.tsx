import React, { useState, useEffect } from 'react';
import { Upload, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockCategories, fetchExchangeRate, extractTextFromImage } from '../../services/api';
import { ExpenseCategory } from '../../types';

export const ExpenseSubmission: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const { user } = useAuth();
  const [categories] = useState<ExpenseCategory[]>(mockCategories);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    currency: 'USD',
    description: '',
    expenseDate: new Date().toISOString().split('T')[0],
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFile(file);
    setIsProcessing(true);

    try {
      const ocrData = await extractTextFromImage(file);
      setFormData(prev => ({
        ...prev,
        amount: ocrData.amount.toString(),
        expenseDate: ocrData.date,
      }));
    } catch (error) {
      console.error('OCR processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const exchangeRate = await fetchExchangeRate(formData.currency, 'USD');
      const amountInBaseCurrency = parseFloat(formData.amount) * exchangeRate;

      console.log('Expense submitted:', {
        ...formData,
        employeeId: user?.id,
        amountInBaseCurrency,
        exchangeRate,
        receiptFile: receiptFile?.name,
      });

      setFormData({
        categoryId: '',
        amount: '',
        currency: 'USD',
        description: '',
        expenseDate: new Date().toISOString().split('T')[0],
      });
      setReceiptFile(null);
      onSubmit();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border-2 border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Submit New Expense</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Expense Date
            </label>
            <input
              type="date"
              value={formData.expenseDate}
              onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
            >
              {currencies.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
            rows={3}
            placeholder="Provide details about this expense"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            Upload Receipt
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg cursor-pointer transition-colors border-2 border-gray-600">
              <Camera size={20} />
              {receiptFile ? receiptFile.name : 'Choose File'}
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="hidden"
              />
            </label>
            {isProcessing && (
              <span className="text-blue-400 text-sm">Processing with OCR...</span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting || isProcessing}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-blue-500"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};
