import React, { useState } from 'react';
import { DollarSign, Upload, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExpenseItem {
  id: number;
  category: string;
  description: string;
  amount: string;
  date: string;
  receipt: File | null;
}

const CreateExpenseClaim: React.FC = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: 1,
      category: '',
      description: '',
      amount: '',
      date: '',
      receipt: null,
    },
  ]);

  const addExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        category: '',
        description: '',
        amount: '',
        date: '',
        receipt: null,
      },
    ]);
  };

  const removeExpense = (id: number) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((exp) => exp.id !== id));
    }
  };

  const handleExpenseChange = (id: number, field: keyof ExpenseItem, value: string | File | null) => {
    setExpenses(
      expenses.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const handleFileUpload = (id: number, file: File | null) => {
    handleExpenseChange(id, 'receipt', file);
  };

  const calculateTotal = () => {
    return expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Expense Claim:', expenses);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expense Claim</h1>
            <p className="text-gray-600 text-sm mt-1">Submit travel expenses</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            {/* Expenses List */}
            {expenses.map((expense, index) => (
              <div
                key={expense.id}
                className="mb-6 p-4 border border-gray-200 rounded-lg relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Expense {index + 1}</h3>
                  {expenses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category*
                    </label>
                    <select
                      value={expense.category}
                      onChange={(e) =>
                        handleExpenseChange(expense.id, 'category', e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="transportation">Transportation</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="meals">Meals</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date*
                    </label>
                    <input
                      type="date"
                      value={expense.date}
                      onChange={(e) =>
                        handleExpenseChange(expense.id, 'date', e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign size={16} className="inline mr-1" />
                      Amount (₹)*
                    </label>
                    <input
                      type="number"
                      value={expense.amount}
                      onChange={(e) =>
                        handleExpenseChange(expense.id, 'amount', e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      required
                    />
                  </div>

                  {/* Receipt Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Upload size={16} className="inline mr-1" />
                      Receipt*
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileUpload(expense.id, e.target.files?.[0] || null)
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description*
                    </label>
                    <textarea
                      value={expense.description}
                      onChange={(e) =>
                        handleExpenseChange(expense.id, 'description', e.target.value)
                      }
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe the expense"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Expense Button */}
            <button
              type="button"
              onClick={addExpense}
              className="mb-6 w-full border-2 border-dashed border-gray-300 rounded-lg py-3 hover:border-blue-500 hover:bg-blue-50 transition-colors text-gray-600 font-medium"
            >
              + Add Another Expense
            </button>

            {/* Total */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExpenseClaim;