import React from 'react';
import { TrendingUp, DollarSign, FileText, Clock, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: 'Total Expenses',
      value: '$12,450',
      change: '+12.5%',
      icon: DollarSign,
      color: 'blue',
    },
    {
      label: 'Pending Approvals',
      value: '8',
      change: '-3',
      icon: Clock,
      color: 'yellow',
    },
    {
      label: 'Approved This Month',
      value: '45',
      change: '+8.2%',
      icon: FileText,
      color: 'green',
    },
    {
      label: 'Active Users',
      value: '24',
      change: '+2',
      icon: Users,
      color: 'purple',
    },
  ];

  const recentExpenses = [
    {
      id: '1',
      employee: 'John Doe',
      category: 'Travel',
      amount: 250.0,
      date: '2025-10-03',
      status: 'pending',
    },
    {
      id: '2',
      employee: 'Jane Smith',
      category: 'Meals',
      amount: 45.5,
      date: '2025-10-02',
      status: 'approved',
    },
    {
      id: '3',
      employee: 'Mike Johnson',
      category: 'Office Supplies',
      amount: 120.0,
      date: '2025-10-01',
      status: 'pending',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-900/50 border-blue-700 text-blue-400',
      yellow: 'bg-yellow-900/50 border-yellow-700 text-yellow-400',
      green: 'bg-green-900/50 border-green-700 text-green-400',
      purple: 'bg-purple-900/50 border-purple-700 text-purple-400',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900 text-green-200 border-green-700';
      case 'rejected':
        return 'bg-red-900 text-red-200 border-red-700';
      default:
        return 'bg-yellow-900 text-yellow-200 border-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.fullName}
        </h1>
        <p className="text-gray-400">Here's an overview of your expense management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${getColorClasses(
                stat.color
              )} rounded-lg border-2 p-6 transition-all hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon size={32} />
                <span
                  className={`text-sm font-semibold ${
                    stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border-2 border-gray-700 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Expenses</h3>
          <div className="space-y-4">
            {recentExpenses.map(expense => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-white mb-1">{expense.employee}</div>
                  <div className="text-sm text-gray-400">
                    {expense.category} • {expense.date}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-white">${expense.amount.toFixed(2)}</div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                      expense.status
                    )}`}
                  >
                    {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border-2 border-gray-700 p-6">
          <h3 className="text-xl font-bold text-white mb-4">Expense Categories Breakdown</h3>
          <div className="space-y-4">
            {[
              { name: 'Travel', amount: 5200, percentage: 42 },
              { name: 'Meals & Entertainment', amount: 2800, percentage: 22 },
              { name: 'Office Supplies', amount: 1900, percentage: 15 },
              { name: 'Transportation', amount: 1450, percentage: 12 },
              { name: 'Other', amount: 1100, percentage: 9 },
            ].map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-medium">{category.name}</span>
                  <span className="text-white font-semibold">
                    ${category.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 border border-gray-600">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
