import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, FileText, Clock, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/dashboard', {
          headers: {
            'x-auth-token': token || ''
          }
        });
        const data = await res.json();
        if (data.success) {
          setDashboardData(data.data);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = dashboardData ? [
    {
      label: 'Total Expenses',
      value: `$${dashboardData.totalExpenses.toLocaleString()}`,
      change: '+12.5%', // This can be calculated on the backend
      icon: DollarSign,
      color: 'blue',
    },
    {
      label: 'Pending Approvals',
      value: dashboardData.pendingApprovals,
      change: '-3', // This can be calculated on the backend
      icon: Clock,
      color: 'yellow',
    },
    {
      label: 'Approved This Month',
      value: dashboardData.approvedThisMonth,
      change: '+8.2%', // This can be calculated on the backend
      icon: FileText,
      color: 'green',
    },
    {
      label: 'Active Users',
      value: '24', // This should come from the backend
      change: '+2', // This can be calculated on the backend
      icon: Users,
      color: 'purple',
    },
  ] : [];

  const recentExpenses = dashboardData ? dashboardData.recentExpenses : [];

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

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

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
                key={expense._id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-white mb-1">{expense.description}</div>
                  <div className="text-sm text-gray-400">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
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
            {dashboardData && dashboardData.expenseCategories.map((category, index) => (
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
                    style={{ width: `${(category.amount / dashboardData.totalExpenses) * 100}%` }}
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
