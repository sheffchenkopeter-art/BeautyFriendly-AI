// Enums
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CALENDAR = 'CALENDAR',
  CLIENTS = 'CLIENTS',
  AI_STYLIST = 'AI_STYLIST',
  SETTINGS = 'SETTINGS',
}

export enum ServiceType {
  HAIRCUT = 'Стрижка',
  COLORING = 'Фарбування',
  STYLING = 'Укладка',
  TREATMENT = 'Лікування',
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