import React, { useState, useEffect } from 'react';
import { Plus, Send, Trash2 } from 'lucide-react';
import { User, UserRole } from '../../types';
import { mockUsers, sendPasswordEmail } from '../../services/api';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    role: 'employee' as UserRole,
    managerId: '',
  });
  const [isAdding, setIsAdding] = useState(false);

  const managers = users.filter(u => ['admin', 'manager'].includes(u.role));

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const tempPassword = Math.random().toString(36).slice(-8);

      const user: User = {
        id: Date.now().toString(),
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        managerId: newUser.managerId || undefined,
        managerName: managers.find(m => m.id === newUser.managerId)?.fullName,
        companyId: '1',
        mustChangePassword: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await sendPasswordEmail(user.email, tempPassword);
      setUsers([...users, user]);
      setNewUser({ fullName: '', email: '', role: 'employee', managerId: '' });
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSendPassword = async (user: User) => {
    const tempPassword = Math.random().toString(36).slice(-8);
    await sendPasswordEmail(user.email, tempPassword);
    alert(`Password sent to ${user.email}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
      </div>

      <div className="bg-gray-800 rounded-lg border-2 border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add New User</h3>
        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            value={newUser.fullName}
            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            placeholder="Full Name"
            className="px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            required
          />
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
            className="px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
            className="px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="finance">Finance</option>
            <option value="director">Director</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={newUser.managerId}
            onChange={(e) => setNewUser({ ...newUser, managerId: e.target.value })}
            className="px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">No Manager</option>
            {managers.map(m => (
              <option key={m.id} value={m.id}>{m.fullName}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isAdding}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 border-2 border-blue-500"
          >
            <Plus size={18} />
            Add User
          </button>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg border-2 border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{user.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200 border border-blue-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.managerName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendPassword(user)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors border border-green-500"
                      >
                        <Send size={14} />
                        Send Password
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors border border-red-500"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
