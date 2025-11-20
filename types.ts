
// Enums
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CALENDAR = 'CALENDAR',
  CLIENTS = 'CLIENTS',
  AI_STYLIST = 'AI_STYLIST',
  ANALYTICS = 'ANALYTICS',
  SETTINGS = 'SETTINGS',
}

export enum ServiceType {
  HAIRCUT = 'Стрижка',
  COLORING = 'Фарбування',
  STYLING = 'Укладка',
  TREATMENT = 'Лікування',
}

export type PaymentMethod = 'cash' | 'card';
export type TransactionType = 'income' | 'expense';

export enum ExpenseCategory {
  RENT = 'Оренда',
  MATERIALS = 'Матеріали',
  TAXES = 'Податки',
  SALARY = 'Зарплата',
  OTHER = 'Інше',
  SERVICE = 'Послуга' // Automatic category for appointments
}

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  hasSubscription: boolean;
  subscriptionPlan?: 'start' | 'pro' | 'premium';
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  lastVisit?: string;
  avatarUrl?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: Date;
  service: ServiceType;
  durationMinutes: number;
  price: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  paymentMethod?: PaymentMethod; // Track how it was paid
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory | string;
  description?: string;
  paymentMethod: PaymentMethod;
}

export interface WalletState {
  cash: number;
  card: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  imageUrl?: string;
  isError?: boolean;
}

export interface StyleTrend {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface DaySchedule {
  isWorking: boolean;
  start: string; // "10:00"
  end: string;   // "19:00"
}

export type WorkSchedule = Record<number, DaySchedule>; // Key is 0 (Sunday) to 6 (Saturday)
