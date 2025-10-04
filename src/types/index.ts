export type UserRole = 'admin' | 'manager' | 'finance' | 'director' | 'employee';

export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export type ApprovalAction = 'approved' | 'rejected' | 'pending';

export type NotificationType =
  | 'expense_submitted'
  | 'expense_approved'
  | 'expense_rejected'
  | 'password_reset'
  | 'approval_required';

export type ApprovalRuleType = 'all' | 'percentage' | 'specific_approver' | 'hybrid';

export interface Company {
  id: string;
  name: string;
  baseCurrency: string;
  country: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  managerId?: string;
  managerName?: string;
  companyId: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCategory {
  id: string;
  companyId: string;
  name: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  companyId: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  currency: string;
  amountInBaseCurrency: number;
  exchangeRate: number;
  description: string;
  expenseDate: string;
  receiptUrl?: string;
  ocrData?: any;
  status: ExpenseStatus;
  currentApprovalStage: number;
  currentApprover?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalWorkflow {
  id: string;
  companyId: string;
  name: string;
  isActive: boolean;
  stages: ApprovalStage[];
  createdAt: string;
}

export interface ApprovalStage {
  id: string;
  workflowId: string;
  stageNumber: number;
  roleRequired: UserRole;
  approvalRuleType: ApprovalRuleType;
  approvalRuleValue: {
    percentage?: number;
    specificUserId?: string;
  };
  createdAt: string;
}

export interface ExpenseApproval {
  id: string;
  expenseId: string;
  stageId: string;
  approverId?: string;
  approverName?: string;
  action: ApprovalAction;
  comments?: string;
  actionedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedExpenseId?: string;
  createdAt: string;
}

export interface Country {
  name: string;
  code: string;
  currency: string;
}
