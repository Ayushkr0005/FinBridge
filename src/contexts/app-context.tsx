'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Expense, Reminder, User, Student, Payment } from '@/lib/types';
import { getFeeStructure } from '@/lib/fees';

interface AppContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id' | 'status'>) => void;
  updateReminderStatus: (id: string, status: 'Paid') => void;
  isClient: boolean;
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, pass: string) => Promise<void>;
  student: Student | null;
  setStudent: (student: Student | null) => void;
  feeStructure: ReturnType<typeof getFeeStructure>;
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudentState] = useState<Student | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const feeStructure = getFeeStructure();

  useEffect(() => {
    setIsClient(true);
    
    const storedUser = localStorage.getItem('finbridge_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const storedStudent = localStorage.getItem('finbridge_student');
    if (storedStudent) {
      setStudentState(JSON.parse(storedStudent));
    }
    
    setExpenses([
      { id: '1', description: 'Fall Semester Tuition', amount: 15000, date: new Date().toISOString(), category: 'Tuition' },
      { id: '2', description: 'Chemistry Textbook', amount: 250, date: new Date().toISOString(), category: 'Books' },
      { id: '3', description: 'Dormitory Rent', amount: 4000, date: new Date().toISOString(), category: 'Housing' },
    ]);
    setReminders([
      { id: '1', title: 'Spring Tuition Fee', dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString(), amount: 15000, status: 'Pending' },
      { id: '2', title: 'Activity Fee', dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 1).toISOString(), amount: 300, status: 'Pending' },
    ]);
    const initialPayments = localStorage.getItem('finbridge_payments');
    if (initialPayments) {
      setPayments(JSON.parse(initialPayments));
    }
  }, []);

  const setStudent = (student: Student | null) => {
    setStudentState(student);
    if (student) {
      localStorage.setItem('finbridge_student', JSON.stringify(student));
    } else {
      localStorage.removeItem('finbridge_student');
    }
  };


  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [...prev, { ...expense, id: crypto.randomUUID() }]);
  };
  
  const addReminder = (reminder: Omit<Reminder, 'id' | 'status'>) => {
    setReminders(prev => [...prev, { ...reminder, id: crypto.randomUUID(), status: 'Pending' }]);
  };

  const updateReminderStatus = (id: string, status: 'Paid') => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };
  
  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: crypto.randomUUID() };
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    localStorage.setItem('finbridge_payments', JSON.stringify(updatedPayments));
    addExpense({
      description: `Payment: ${payment.description}`,
      amount: payment.amount,
      date: payment.date,
      category: 'Tuition',
    })
  };

  const login = async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'parent@email.com' && pass === 'password123') {
          const userData: User = { name: 'Parent User', email: 'parent@email.com' };
          localStorage.setItem('finbridge_user', JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
          resolve();
        } else {
            const storedUsers = JSON.parse(localStorage.getItem('finbridge_users') || '[]');
            const existingUser = storedUsers.find((u: any) => u.email === email && u.password === pass);
            if (existingUser) {
              const userData: User = { name: existingUser.name, email: existingUser.email };
              localStorage.setItem('finbridge_user', JSON.stringify(userData));
              setUser(userData);
              setIsAuthenticated(true);
              resolve();
            } else {
              reject(new Error('Invalid email or password.'));
            }
        }
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('finbridge_user');
    localStorage.removeItem('finbridge_student');
    setUser(null);
    setStudent(null);
    setIsAuthenticated(false);
  };
  
  const register = async (name:string, email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const storedUsers = JSON.parse(localStorage.getItem('finbridge_users') || '[]');
        const existingUser = storedUsers.find((u: any) => u.email === email);

        if (existingUser) {
          reject(new Error('User with this email already exists.'));
        } else {
          const newUser = { name, email, password: pass };
          storedUsers.push(newUser);
          localStorage.setItem('finbridge_users', JSON.stringify(storedUsers));
          
          const userData: User = { name, email };
          localStorage.setItem('finbridge_user', JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
          resolve();
        }
      }, 1000);
    });
  };

  return (
    <AppContext.Provider value={{ expenses, addExpense, reminders, addReminder, updateReminderStatus, isClient, isAuthenticated, user, login, logout, register, student, setStudent, feeStructure, payments, addPayment }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
