
// Enums
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CALENDAR = 'CALENDAR',
  CLIENTS = 'CLIENTS',
  SERVICES = 'SERVICES', // New View
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
export type CalendarDailyView = 'cards' | 'timeline';
export type Gender = 'male' | 'female'; // New Type

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

export interface ServiceCategory {
  id: string;
  title: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string; // Link to category
  title: string;
  price: number;
  duration: number; // in minutes
  description?: string;
}

// Detailed profile for female clients
export interface ClientProfile {
  colorType: string;        // e.g., 'Зима', 'Літо'
  hairCondition: string;    // e.g., 'Пористе', 'Скляне', 'Пошкоджене'
  faceShape: string;        // e.g., 'Овал (Золотий перетин)', 'Круг'
  hairDensity: string;      // e.g., 'Густе', 'Тонке'
  hairStructure: string;    // e.g., 'Пряме', 'Кучеряве'
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  gender: Gender; // Added gender
  email?: string;
  notes?: string;
  lastVisit?: string;
  avatarUrl?: string;
  profile?: ClientProfile; // Optional profile data
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  date: Date;
  service: string; // Changed from ServiceType enum to string to support dynamic services
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
