import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  CheckSquare,
  Users,
  Bell,
  Settings,
  LogOut,
  Workflow,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user, signOut } = useAuth();

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'finance', 'director', 'employee'] },
    { id: 'expenses', label: 'My Expenses', icon: Receipt, roles: ['admin', 'manager', 'finance', 'director', 'employee'] },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, roles: ['admin', 'manager', 'finance', 'director'] },
    { id: 'workflow', label: 'Workflow Config', icon: Workflow, roles: ['admin'] },
    { id: 'users', label: 'User Management', icon: Users, roles: ['admin'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['admin', 'manager', 'finance', 'director', 'employee'] },
  ];

  const filteredNav = navigation.filter(item => item.roles.includes(user?.role || 'employee'));

  return (
    <div className="w-64 bg-gray-800 border-r-2 border-gray-700 flex flex-col h-screen">
      <div className="p-6 border-b-2 border-gray-700">
        <h1 className="text-2xl font-bold text-white">ExpenseFlow</h1>
        <p className="text-gray-400 text-sm mt-1">Expense Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNav.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-600 text-white border-2 border-blue-500'
                  : 'text-gray-300 hover:bg-gray-700 border-2 border-transparent'
              }`}
            >
              <Icon size={20} />
              <span className="font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-gray-700">
        <div className="mb-4 p-4 bg-gray-700 rounded-lg border-2 border-gray-600">
          <div className="text-white font-semibold mb-1">{user?.fullName}</div>
          <div className="text-gray-400 text-sm">{user?.email}</div>
          <div className="mt-2">
            <span className="px-3 py-1 bg-blue-900 text-blue-200 text-xs font-bold rounded-full border border-blue-700">
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-all border-2 border-gray-600 hover:border-red-500"
        >
          <LogOut size={20} />
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
