import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { UserManagement } from './components/dashboard/UserManagement';
import { ExpenseSubmission } from './components/expenses/ExpenseSubmission';
import { ExpenseHistory } from './components/expenses/ExpenseHistory';
import { ApprovalQueue } from './components/approvals/ApprovalQueue';
import { WorkflowConfig } from './components/approvals/WorkflowConfig';
import { NotificationCenter } from './components/notifications/NotificationCenter';

function AuthFlow() {
  const [isSignUp, setIsSignUp] = useState(false);

  return isSignUp ? (
    <SignUp onSwitch={() => setIsSignUp(false)} />
  ) : (
    <SignIn
      onSwitch={() => setIsSignUp(true)}
      onForgotPassword={() => alert('Password reset functionality would be implemented here')}
    />
  );
}

function MainApp() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [showSubmission, setShowSubmission] = useState(false);

  if (!user) {
    return <AuthFlow />;
  }

  const renderContent = () => {
    if (activeView === 'expenses') {
      if (showSubmission) {
        return (
          <div className="space-y-6">
            <button
              onClick={() => setShowSubmission(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors border-2 border-gray-600"
            >
              ← Back to History
            </button>
            <ExpenseSubmission onSubmit={() => setShowSubmission(false)} />
          </div>
        );
      }
      return (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowSubmission(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors border-2 border-blue-500"
            >
              + Submit New Expense
            </button>
          </div>
          <ExpenseHistory />
        </div>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'approvals':
        return <ApprovalQueue />;
      case 'workflow':
        return <WorkflowConfig />;
      case 'users':
        return <UserManagement />;
      case 'notifications':
        return <NotificationCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
