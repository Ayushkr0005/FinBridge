export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'Tuition' | 'Books' | 'Supplies' | 'Housing' | 'Other';
}

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  status: 'Pending' | 'Paid';
}

export interface User {
  name: string;
  email: string;
}

export interface Student {
  year: '1' | '2' | '3' | '4';
  department: string;
  rollNumber: string;
}

export interface FeeItem {
  description: string;
  amount: number;
}

export interface FeeStructure {
  year: '1' | '2' | '3' | '4';
  departments: {
    [key: string]: FeeItem[];
  };
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  description: string;
}
