import { Country, User, Expense, ExpenseCategory, Notification } from '../types';

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();

    return data.map((country: any) => ({
      name: country.name.common,
      code: country.cca2,
      currency: Object.keys(country.currencies || {})[0] || 'USD'
    })).sort((a: Country, b: Country) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

export const fetchExchangeRate = async (from: string, to: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const data = await response.json();
    return data.rates[to] || 1.0;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 1.0;
  }
};

export const extractTextFromImage = async (file: File): Promise<any> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        amount: Math.floor(Math.random() * 500) + 10,
        date: new Date().toISOString().split('T')[0],
        merchant: 'Sample Merchant'
      });
    };
    reader.readAsDataURL(file);
  });
};

export const sendPasswordEmail = async (email: string, tempPassword: string): Promise<void> => {
  console.log(`Sending password email to ${email} with temp password: ${tempPassword}`);
  return Promise.resolve();
};

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    fullName: 'Admin User',
    role: 'admin',
    companyId: '1',
    mustChangePassword: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Admin User',
    companyId: '1',
    categoryId: '1',
    categoryName: 'Travel',
    amount: 250.00,
    currency: 'USD',
    amountInBaseCurrency: 250.00,
    exchangeRate: 1.0,
    description: 'Flight to client meeting',
    expenseDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    currentApprovalStage: 1,
    currentApprover: 'Manager Name',
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockCategories: ExpenseCategory[] = [
  { id: '1', companyId: '1', name: 'Travel', createdAt: new Date().toISOString() },
  { id: '2', companyId: '1', name: 'Meals & Entertainment', createdAt: new Date().toISOString() },
  { id: '3', companyId: '1', name: 'Office Supplies', createdAt: new Date().toISOString() },
  { id: '4', companyId: '1', name: 'Transportation', createdAt: new Date().toISOString() },
  { id: '5', companyId: '1', name: 'Accommodation', createdAt: new Date().toISOString() },
  { id: '6', companyId: '1', name: 'Software & Technology', createdAt: new Date().toISOString() },
  { id: '7', companyId: '1', name: 'Professional Services', createdAt: new Date().toISOString() },
  { id: '8', companyId: '1', name: 'Training & Education', createdAt: new Date().toISOString() },
  { id: '9', companyId: '1', name: 'Marketing', createdAt: new Date().toISOString() },
  { id: '10', companyId: '1', name: 'Other', createdAt: new Date().toISOString() },
];

export const mockNotifications: Notification[] = [];
