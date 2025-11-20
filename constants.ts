
import { Client, Appointment, ServiceType, StyleTrend, WorkSchedule, WalletState, ServiceItem } from './types';

export const INITIAL_WALLET_STATE: WalletState = {
  cash: 0, 
  card: 0 
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  { id: 's1', title: 'Жіноча стрижка', price: 500, duration: 60, description: 'Миття, стрижка, укладка' },
  { id: 's2', title: 'Чоловіча стрижка', price: 400, duration: 45, description: 'Стрижка машинкою та ножицями' },
  { id: 's3', title: 'Фарбування (корінь)', price: 1200, duration: 90, description: 'Фарбування відрослих коренів' },
  { id: 's4', title: 'Складне фарбування', price: 3500, duration: 240, description: 'AirTouch, Balayage, Shatush' },
  { id: 's5', title: 'Укладка', price: 600, duration: 60, description: 'Вечірня або денна укладка' },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Олена Коваль',
    phone: '+380 50 123 4567',
    notes: 'Любить холодний блонд, чутлива шкіра голови.',
    lastVisit: '2023-10-15',
    avatarUrl: 'https://ui-avatars.com/api/?name=Олена+Коваль&background=d6b980&color=101b2a'
  },
  {
    id: '2',
    name: 'Марина Петренко',
    phone: '+380 67 987 6543',
    notes: 'Відрощує довжину, тільки кінчики.',
    lastVisit: '2023-11-02',
    avatarUrl: 'https://ui-avatars.com/api/?name=Марина+Петренко&background=1a2736&color=d6b980'
  },
  {
    id: '3',
    name: 'Андрій Мельник',
    phone: '+380 93 555 1212',
    notes: 'Класичний фейд, щомісяця.',
    lastVisit: '2023-11-20',
    avatarUrl: 'https://ui-avatars.com/api/?name=Андрій+Мельник&background=2a3c52&color=white'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '101',
    clientId: '1',
    clientName: 'Олена Коваль',
    date: new Date(new Date().setHours(10, 0, 0, 0)), // Today 10:00
    service: 'Фарбування (корінь)',
    durationMinutes: 120,
    price: 2500,
    status: 'scheduled'
  },
  {
    id: '102',
    clientId: '3',
    clientName: 'Андрій Мельник',
    date: new Date(new Date().setHours(13, 30, 0, 0)), // Today 13:30
    service: 'Чоловіча стрижка',
    durationMinutes: 45,
    price: 500,
    status: 'scheduled'
  },
  {
    id: '103',
    clientId: '2',
    clientName: 'Марина Петренко',
    date: new Date(new Date().setHours(15, 0, 0, 0)), // Today 15:00
    service: 'Укладка',
    durationMinutes: 60,
    price: 800,
    status: 'scheduled'
  }
];

export const INITIAL_TRENDS: StyleTrend[] = [
  {
    id: 't1',
    title: 'Текстурний Боб',
    description: 'Легкий та об\'ємний боб з рваними кінцями.',
    imageUrl: 'https://picsum.photos/id/338/400/300'
  },
  {
    id: 't2',
    title: 'Мідний Рудий',
    description: 'Глибокий та насичений колір сезону.',
    imageUrl: 'https://picsum.photos/id/342/400/300'
  }
];

export const DEFAULT_SCHEDULE: WorkSchedule = {
  0: { isWorking: false, start: '10:00', end: '19:00' }, // Sunday
  1: { isWorking: true, start: '10:00', end: '19:00' },  // Monday
  2: { isWorking: true, start: '10:00', end: '19:00' },  // Tuesday
  3: { isWorking: true, start: '10:00', end: '19:00' },  // Wednesday
  4: { isWorking: true, start: '10:00', end: '19:00' },  // Thursday
  5: { isWorking: true, start: '10:00', end: '19:00' },  // Friday
  6: { isWorking: true, start: '10:00', end: '16:00' },  // Saturday
};
