import { Client, Appointment, ServiceType, StyleTrend, WorkSchedule } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Олена Коваль',
    phone: '+380 50 123 4567',
    notes: 'Любить холодний блонд, чутлива шкіра голови.',
    lastVisit: '2023-10-15',
    avatarUrl: 'https://picsum.photos/id/64/200/200'
  },
  {
    id: '2',
    name: 'Марина Петренко',
    phone: '+380 67 987 6543',
    notes: 'Відрощує довжину, тільки кінчики.',
    lastVisit: '2023-11-02',
    avatarUrl: 'https://picsum.photos/id/65/200/200'
  },
  {
    id: '3',
    name: 'Андрій Мельник',
    phone: '+380 93 555 1212',
    notes: 'Класичний фейд, щомісяця.',
    lastVisit: '2023-11-20',
    avatarUrl: 'https://picsum.photos/id/91/200/200'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '101',
    clientId: '1',
    clientName: 'Олена Коваль',
    date: new Date(new Date().setHours(10, 0, 0, 0)), // Today 10:00
    service: ServiceType.COLORING,
    durationMinutes: 120,
    price: 2500,
    status: 'scheduled'
  },
  {
    id: '102',
    clientId: '3',
    clientName: 'Андрій Мельник',
    date: new Date(new Date().setHours(13, 30, 0, 0)), // Today 13:30
    service: ServiceType.HAIRCUT,
    durationMinutes: 45,
    price: 500,
    status: 'scheduled'
  },
  {
    id: '103',
    clientId: '2',
    clientName: 'Марина Петренко',
    date: new Date(new Date().setHours(15, 0, 0, 0)), // Today 15:00
    service: ServiceType.STYLING,
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