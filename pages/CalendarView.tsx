import React, { useState } from 'react';
import { 
  format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths,
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, getDay, getHours, getMinutes
} from 'date-fns';
import { uk } from 'date-fns/locale';
import { Plus, X, Save, ChevronLeft, ChevronRight, Clock, LayoutList, Grid, Columns, AlertCircle, CheckCircle, CreditCard, Wallet, Edit2, Trash2, AlertTriangle, List, Calendar as CalendarIcon } from 'lucide-react';
import { Appointment, Client, WorkSchedule, PaymentMethod, CalendarDailyView, ServiceItem, ServiceCategory } from '../types';

interface CalendarViewProps {
    appointments: Appointment[];
    clients: Client[];
    services: ServiceItem[];
    categories: ServiceCategory[];
    onAddAppointment: (appointment: Appointment) => void;
    workSchedule: WorkSchedule;
    onCloseAppointment: (id: string, method: PaymentMethod, finalPrice: number) => void;
    onRescheduleAppointment: (id: string, newDate: Date, duration: number) => void;
    onCancelAppointment: (id: string) => void;
    dailyViewMode: CalendarDailyView;
    onToggleDailyView: (view: CalendarDailyView) => void;
}

type ViewMode = 'day' | 'week' | 'month';

export const CalendarView: React.FC<CalendarViewProps> = ({ 
    appointments, clients, services, categories,
    onAddAppointment, workSchedule, onCloseAppointment,
    onRescheduleAppointment, onCancelAppointment, dailyViewMode, onToggleDailyView
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Checkout State
  const [checkoutApp, setCheckoutApp] = useState<Appointment | null>(null);
  const [checkoutPrice, setCheckoutPrice] = useState<string>('');

  // Edit/Reschedule State
  const [editApp, setEditApp] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [showConflictWarning, setShowConflictWarning] = useState(false);

  // Form State
  const [formClientId, setFormClientId] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('10:00');
  const [formService, setFormService] = useState(''); 
  const [formPrice, setFormPrice] = useState('0');
  const [formDuration, setFormDuration] = useState('60');

  // Navigation
  const handlePrev = () => {
    if (viewMode === 'day') setCurrentDate(subDays(currentDate, 1));
    if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'day') setCurrentDate(addDays(currentDate, 1));
    if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  // Helpers
  const isWorkingDay = (date: Date) => {
      const dayOfWeek = getDay(date); 
      return workSchedule[dayOfWeek].isWorking;
  };

  const getWorkingHours = (date: Date) => {
      const dayOfWeek = getDay(date);
      return workSchedule[dayOfWeek];
  }

  // Handlers
  const openModal = (date?: Date, timeStr?: string) => {
      const targetDate = date || currentDate;
      setFormDate(format(targetDate, 'yyyy-MM-dd'));
      if (timeStr) setFormTime(timeStr);
      setIsModalOpen(true);
  };

  const handleServiceChange = (serviceTitle: string) => {
      setFormService(serviceTitle);
      const serviceData = services.find(s => s.title === serviceTitle);
      if (serviceData) {
          setFormPrice(serviceData.price.toString());
          setFormDuration(serviceData.duration.toString());
      }
  };

  const handleInitiateCheckout = (app: Appointment) => {
      setCheckoutApp(app);
      setCheckoutPrice(app.price.toString());
  };

  const handleInitiateEdit = (app: Appointment) => {
      setEditApp(app);
      setEditDate(format(app.date, 'yyyy-MM-dd'));
      setEditTime(format(app.date, 'HH:mm'));
      setEditDuration(app.durationMinutes.toString());
      setShowConflictWarning(false);
  };

  const checkConflict = (date: Date, duration: number, excludeId: string): boolean => {
      const start = date.getTime();
      const end = start + duration * 60000;

      return appointments.some(app => {
          if (app.id === excludeId || app.status === 'cancelled') return false;
          const appStart = app.date.getTime();
          const appEnd = appStart + app.durationMinutes * 60000;
          return start < appEnd && end > appStart;
      });
  };

  const handleSaveEdit = (force: boolean = false) => {
      if (!editApp || !editDate || !editTime) return;
      const newDate = new Date(`${editDate}T${editTime}`);
      const duration = parseInt(editDuration);

      if (!force) {
          const hasConflict = checkConflict(newDate, duration, editApp.id);
          if (hasConflict) {
              setShowConflictWarning(true);
              return;
          }
      }
      onRescheduleAppointment(editApp.id, newDate, duration);
      setEditApp(null);
      setShowConflictWarning(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const client = clients.find(c => c.id === formClientId);
      if (!client) return;
      const appointmentDate = new Date(`${formDate}T${formTime}`);
      const newAppointment: Appointment = {
          id: Date.now().toString(),
          clientId: client.id,
          clientName: client.name,
          date: appointmentDate,
          service: formService,
          durationMinutes: parseInt(formDuration),
          price: parseInt(formPrice),
          status: 'scheduled'
      };
      onAddAppointment(newAppointment);
      setIsModalOpen(false);
      setFormClientId('');
  };

  const handleCheckout = (method: PaymentMethod) => {
      if (checkoutApp && checkoutPrice) {
          const finalPrice = parseFloat(checkoutPrice) || checkoutApp.price;
          onCloseAppointment(checkoutApp.id, method, finalPrice);
          setCheckoutApp(null);
          setCheckoutPrice('');
      }
  }

  const isFormTimeValid = () => {
      if (!formDate || !formTime) return true;
      const date = new Date(formDate);
      const schedule = getWorkingHours(date);
      if (!schedule.isWorking) return false;

      const [startH, startM] = schedule.start.split(':').map(Number);
      const [endH, endM] = schedule.end.split(':').map(Number);
      const [formH, formM] = formTime.split(':').map(Number);
      const startMins = startH * 60 + startM;
      const endMins = endH * 60 + endM;
      const formMins = formH * 60 + formM;
      return formMins >= startMins && formMins < endMins;
  };

  const renderHeader = () => (
    <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-8 glass p-6 rounded-2xl animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-start">
        <button onClick={handlePrev} className="p-2 hover:bg-surface-soft/50 rounded-full text-muted hover:text-accent transition-colors"><ChevronLeft className="w-6 h-6" /></button>
        <div className="text-center min-w-[180px]">
            <h3 className="text-2xl font-serif text-main capitalize tracking-tight">
                {viewMode === 'month' 
                    ? format(currentDate, 'LLLL yyyy', { locale: uk }) 
                    : format(currentDate, 'd MMMM yyyy', { locale: uk })
                }
            </h3>
            <button onClick={handleToday} className="text-xs uppercase tracking-[0.2em] text-accent font-bold hover:underline underline-offset-4 mt-1">Сьогодні</button>
        </div>
        <button onClick={handleNext} className="p-2 hover:bg-surface-soft/50 rounded-full text-muted hover:text-accent transition-colors"><ChevronRight className="w-6 h-6" /></button>
      </div>

      <div className="flex flex-wrap gap-3 w-full xl:w-auto justify-center xl:justify-end">
        <div className="flex bg-surface-soft/50 p-1.5 rounded-xl border border-border">
            {[
                { id: 'day', icon: LayoutList, label: 'День' },
                { id: 'week', icon: Columns, label: 'Тиждень' },
                { id: 'month', icon: Grid, label: 'Місяць' }
            ].map((view) => (
                <button
                    key={view.id}
                    onClick={() => setViewMode(view.id as ViewMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                        viewMode === view.id 
                        ? 'bg-accent text-primary shadow-lg shadow-accent/20' 
                        : 'text-muted hover:text-main hover:bg-white/5'
                    }`}
                >
                    <view.icon className="w-3 h-3" />
                    <span className="hidden md:inline">{view.label}</span>
                </button>
            ))}
        </div>

        {viewMode === 'day' && (
             <div className="flex bg-surface-soft/50 p-1.5 rounded-xl border border-border">
                <button
                    onClick={() => onToggleDailyView('cards')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                        dailyViewMode === 'cards' 
                        ? 'bg-surface text-accent shadow-sm' 
                        : 'text-muted hover:text-main'
                    }`}
                    title="Вигляд картками"
                >
                    <List className="w-3 h-3" />
                </button>
                <button
                    onClick={() => onToggleDailyView('timeline')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                        dailyViewMode === 'timeline' 
                        ? 'bg-surface text-accent shadow-sm' 
                        : 'text-muted hover:text-main'
                    }`}
                    title="Вигляд таймлайн"
                >
                    <Clock className="w-3 h-3" />
                </button>
             </div>
        )}

        <button 
            onClick={() => openModal()}
            className="btn-primary py-2.5 px-6 flex items-center gap-2 shadow-xl"
        >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Запис</span>
        </button>
      </div>
    </div>
  );

  const renderTimelineView = () => {
    const dayAppointments = appointments
        .filter(app => isSameDay(app.date, currentDate) && app.status !== 'cancelled')
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    const schedule = getWorkingHours(currentDate);
    const startHour = 8;
    const endHour = 22;
    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
    const hourHeight = 90; // Slightly taller for better readability

    return (
        <div className="glass rounded-2xl border border-border overflow-hidden min-h-[600px] flex flex-col shadow-sm animate-in fade-in">
             <div className="bg-surface-soft/80 backdrop-blur-md border-b border-border p-5 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-accent/10 rounded-lg"><Clock className="w-4 h-4 text-accent" /></div>
                    <span className="text-sm text-muted font-medium">
                        Графік: {schedule.isWorking ? <span className="text-main font-serif">{schedule.start} - {schedule.end}</span> : <span className="text-red-400 font-bold uppercase tracking-wider text-xs">Вихідний</span>}
                    </span>
                </div>
             </div>

             <div className="flex-1 relative overflow-y-auto scrollbar-thin">
                 <div className="relative min-w-[600px]" style={{ height: hours.length * hourHeight + 50 }}>
                    {hours.map(hour => (
                        <div 
                            key={hour} 
                            className="absolute w-full border-b border-border/40 flex group cursor-pointer hover:bg-white/5 transition-colors"
                            style={{ top: (hour - startHour) * hourHeight, height: hourHeight }}
                            onClick={() => openModal(currentDate, `${hour.toString().padStart(2, '0')}:00`)}
                        >
                            <div className="w-20 flex-shrink-0 text-xs text-muted font-medium text-right pr-6 -mt-2 sticky left-0 bg-primary/95 backdrop-blur-sm z-20 h-full border-r border-border/30">
                                {hour}:00
                            </div>
                            <div className="flex-1 relative">
                                {/* Subtle half-hour marker */}
                                <div className="absolute w-full border-b border-border/10 top-1/2 border-dashed"></div>
                            </div>
                        </div>
                    ))}

                    {dayAppointments.map(app => {
                        const startH = getHours(app.date);
                        const startM = getMinutes(app.date);
                        const topPosition = ((startH - startHour) * hourHeight) + ((startM / 60) * hourHeight);
                        const height = (app.durationMinutes / 60) * hourHeight;

                        if (startH < startHour || startH > endHour) return null;

                        return (
                            <div 
                                key={app.id}
                                className={`absolute left-24 right-4 rounded-xl px-4 py-3 border-l-4 shadow-lg transition-all cursor-pointer hover:z-20 overflow-hidden flex flex-col justify-center group
                                    ${app.status === 'completed' 
                                        ? 'bg-surface/80 border-success backdrop-blur-sm opacity-90' 
                                        : 'bg-surface-soft border-accent hover:bg-surface hover:shadow-xl hover:shadow-accent/5'
                                    }`}
                                style={{ 
                                    top: topPosition, 
                                    height: Math.max(height, 40), 
                                    zIndex: 10 
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    if (app.status === 'scheduled') handleInitiateCheckout(app); 
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-main font-serif font-bold text-sm leading-tight tracking-wide">{app.clientName}</p>
                                        <p className="text-muted text-xs mt-1 flex items-center gap-1 font-medium">
                                            {format(app.date, 'HH:mm')} - {format(addDays(app.date, 0).setMinutes(startM + app.durationMinutes), 'HH:mm')}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {app.status === 'completed' && <CheckCircle className="w-4 h-4 text-success" />}
                                        <span className="text-accent text-xs font-bold bg-accent/10 px-2 py-0.5 rounded">₴{app.price}</span>
                                    </div>
                                </div>
                                {app.status === 'scheduled' && (
                                    <div className="absolute right-3 bottom-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-primary/90 backdrop-blur-md rounded-lg p-1 shadow-lg border border-white/10">
                                         <button onClick={(e) => {e.stopPropagation(); handleInitiateEdit(app)}} className="p-1.5 text-muted hover:text-main hover:bg-white/10 rounded-md" title="Редагувати"><Edit2 className="w-3.5 h-3.5" /></button>
                                         <button onClick={(e) => {e.stopPropagation(); onCancelAppointment(app.id)}} className="p-1.5 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-md" title="Скасувати"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                 </div>
             </div>
        </div>
    );
  };

  const renderCardsView = () => {
    const dayAppointments = appointments
        .filter(app => isSameDay(app.date, currentDate) && app.status !== 'cancelled')
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    return (
        <div className="space-y-4 min-h-[600px] animate-in fade-in">
             <div className="glass p-5 rounded-2xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                     <div className="p-2 bg-accent/10 rounded-lg"><CalendarIcon className="w-4 h-4 text-accent" /></div>
                     <span className="text-sm text-muted font-medium uppercase tracking-wide">
                        Записів на сьогодні: <span className="text-main font-bold text-lg ml-2">{dayAppointments.length}</span>
                     </span>
                </div>
             </div>

             {dayAppointments.length > 0 ? (
                <div className="grid gap-4">
                {dayAppointments.map(app => (
                    <div key={app.id} className="glass rounded-2xl p-6 hover:border-accent/50 transition-all group relative hover:-translate-y-1 duration-300">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 ${
                                    app.status === 'completed' ? 'bg-surface border-success/50' : 'bg-surface border-accent/30 shadow-inner'
                                }`}>
                                    <span className="text-xl font-serif font-bold text-main">{format(app.date, 'HH:mm')}</span>
                                    <span className="text-[10px] text-muted uppercase font-bold mt-1">{app.durationMinutes} хв</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-serif text-main tracking-tight">{app.clientName}</h4>
                                    <p className="text-sm text-muted mt-1 font-light">{app.service}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border/50 pt-4 md:pt-0">
                                <div className="text-right">
                                    <p className="text-accent font-bold text-lg">₴{app.price}</p>
                                    <span className={`text-[10px] px-2 py-1 rounded border uppercase font-bold tracking-wider ${
                                        app.status === 'completed' ? 'bg-success/10 border-success/30 text-success' : 'bg-surface border-border text-muted'
                                    }`}>
                                        {app.status === 'completed' ? 'Оплачено' : 'Очікує'}
                                    </span>
                                </div>
                                
                                {app.status === 'scheduled' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleInitiateCheckout(app)} className="p-3 bg-accent text-primary rounded-xl hover:bg-accent-hover transition-all shadow-lg shadow-accent/20" title="Розрахувати"><CheckCircle className="w-5 h-5" /></button>
                                        <button onClick={() => handleInitiateEdit(app)} className="p-3 border border-border text-muted rounded-xl hover:bg-surface-soft hover:text-main transition-all" title="Редагувати"><Edit2 className="w-5 h-5" /></button>
                                        <button onClick={() => onCancelAppointment(app.id)} className="p-3 border border-border text-muted rounded-xl hover:text-red-400 hover:border-red-400/30 transition-all" title="Скасувати"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                </div>
             ) : (
                 <div className="flex flex-col items-center justify-center h-64 text-muted border-2 border-dashed border-border/50 rounded-2xl bg-surface/30">
                     <Clock className="w-12 h-12 mb-4 opacity-20" />
                     <p className="font-light">На цей день записів немає.</p>
                     <button onClick={() => openModal()} className="mt-4 text-accent text-sm hover:underline font-medium uppercase tracking-wide">Додати перший запис</button>
                 </div>
             )}
        </div>
    );
  };

  const renderDayView = () => {
      if (dailyViewMode === 'timeline') return renderTimelineView();
      return renderCardsView();
  };

  const renderWeekView = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

    return (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-h-[600px] animate-in fade-in">
            {days.map((day, idx) => {
                const dayApps = appointments
                    .filter(app => isSameDay(app.date, day) && app.status !== 'cancelled')
                    .sort((a, b) => a.date.getTime() - b.date.getTime());
                const isToday = isSameDay(day, new Date());
                const workingInfo = getWorkingHours(day);

                return (
                    <div key={idx} className={`glass rounded-2xl flex flex-col relative overflow-hidden transition-all duration-300 ${isToday ? 'border-accent shadow-lg shadow-accent/10 ring-1 ring-accent/20' : 'border-border'}`}>
                        {!workingInfo.isWorking && (
                            <div className="absolute inset-0 bg-primary/80 z-10 flex items-center justify-center pointer-events-none">
                                <span className="-rotate-90 text-muted font-bold text-lg uppercase tracking-widest opacity-20 whitespace-nowrap">Вихідний</span>
                            </div>
                        )}

                        <div className={`p-4 text-center border-b ${isToday ? 'bg-accent text-primary' : 'bg-surface-soft/50 border-border'}`}>
                            <span className="text-[10px] font-bold uppercase block mb-1 opacity-80 tracking-widest">{format(day, 'EEE', { locale: uk })}</span>
                            <span className="text-2xl font-serif font-bold">{format(day, 'd')}</span>
                        </div>
                        <div className="p-3 space-y-2 flex-1 overflow-y-auto max-h-[600px] scrollbar-thin bg-primary/30">
                            {dayApps.map(app => (
                                <div 
                                    key={app.id} 
                                    className={`p-3 rounded-xl border text-xs transition-all group relative z-20 cursor-pointer ${
                                        app.status === 'completed' 
                                        ? 'bg-surface/50 border-success/30 opacity-70' 
                                        : 'bg-surface border-border hover:border-accent/50 hover:shadow-md'
                                    }`}
                                    onClick={() => app.status === 'scheduled' && handleInitiateCheckout(app)}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-accent font-bold">{format(app.date, 'HH:mm')}</span>
                                        {app.status === 'completed' && <CheckCircle className="w-3 h-3 text-success" />}
                                    </div>
                                    <p className="text-main font-medium truncate">{app.clientName}</p>
                                    <p className="text-muted truncate text-[10px] mt-0.5">{app.service}</p>
                                </div>
                            ))}
                            {dayApps.length === 0 && workingInfo.isWorking && (
                                <div className="h-full flex items-center justify-center opacity-10 hover:opacity-40 transition-opacity cursor-pointer min-h-[100px]" onClick={() => openModal(day)}>
                                    <Plus className="w-8 h-8 text-accent" />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

    return (
        <div className="glass rounded-2xl border border-border overflow-hidden animate-in fade-in">
            <div className="grid grid-cols-7 bg-surface-soft/50 border-b border-border">
                {weekDays.map(d => (
                    <div key={d} className="py-4 text-center text-xs font-bold text-accent uppercase tracking-widest">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr bg-primary/20">
                {calendarDays.map((day, idx) => {
                    const dayApps = appointments.filter(app => isSameDay(app.date, day) && app.status !== 'cancelled');
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());
                    const isWorking = isWorkingDay(day);

                    return (
                        <div 
                            key={idx} 
                            onClick={() => { setCurrentDate(day); setViewMode('day'); }}
                            className={`min-h-[120px] p-2 border-b border-r border-border/50 relative hover:bg-white/5 transition-colors cursor-pointer
                                ${!isCurrentMonth ? 'bg-surface/30 text-muted/40' : 'text-main'}
                                ${!isWorking ? 'bg-primary/40' : ''}
                            `}
                        >
                            <span className={`absolute top-3 right-3 text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full 
                                ${isToday ? 'bg-accent text-primary shadow-lg shadow-accent/30' : ''}
                                ${!isWorking && !isToday ? 'text-muted' : ''}
                            `}>
                                {format(day, 'd')}
                            </span>

                            <div className="mt-8 space-y-1.5">
                                {dayApps.slice(0, 3).map((app, i) => (
                                    <div key={i} className={`h-2 w-full rounded-full ${app.status === 'completed' ? 'bg-success/60' : 'bg-accent'} shadow-sm`} title={`${app.clientName} - ${format(app.date, 'HH:mm')}`}></div>
                                ))}
                                {dayApps.length > 3 && (
                                    <div className="text-[10px] text-muted text-center font-medium">+{dayApps.length - 3}</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6 pb-32 md:pb-8 relative">
      {renderHeader()}
      
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'month' && renderMonthView()}

       {/* Modal using Premium Input styles */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/90 backdrop-blur-sm animate-in fade-in">
            <div className="glass w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-serif text-main">Новий Запис</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-main"><X className="w-6 h-6" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-accent uppercase tracking-wide">Клієнт</label>
                        <select
                            required
                            value={formClientId}
                            onChange={(e) => setFormClientId(e.target.value)}
                            className="input-premium"
                        >
                            <option value="" disabled>Оберіть клієнта</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-accent uppercase tracking-wide">Дата</label>
                            <input 
                                type="date"
                                required
                                value={formDate}
                                onChange={(e) => setFormDate(e.target.value)}
                                className="input-premium [color-scheme:dark]"
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-accent uppercase tracking-wide">Час</label>
                            <input 
                                type="time"
                                required
                                value={formTime}
                                onChange={(e) => setFormTime(e.target.value)}
                                className="input-premium [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {!isFormTimeValid() && (
                         <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-center gap-3 text-red-400 text-xs font-medium">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>Увага: Цей час виходить за межі вашого графіку роботи.</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-accent uppercase tracking-wide">Послуга</label>
                        <select
                            value={formService}
                            onChange={(e) => handleServiceChange(e.target.value)}
                            className="input-premium"
                        >
                            <option value="" disabled>Оберіть послугу</option>
                            {categories.map(category => {
                                const categoryServices = services.filter(s => s.categoryId === category.id);
                                if (categoryServices.length === 0) return null;
                                return (
                                    <optgroup key={category.id} label={category.title} className="bg-surface text-main">
                                        {categoryServices.map(service => (
                                            <option key={service.id} value={service.title}>
                                                {service.title} ({service.duration} хв - ₴{service.price})
                                            </option>
                                        ))}
                                    </optgroup>
                                );
                            })}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-accent uppercase tracking-wide">Тривалість (хв)</label>
                            <input 
                                type="number"
                                required
                                step="15"
                                value={formDuration}
                                onChange={(e) => setFormDuration(e.target.value)}
                                className="input-premium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-accent uppercase tracking-wide">Вартість (₴)</label>
                            <input 
                                type="number"
                                required
                                value={formPrice}
                                onChange={(e) => setFormPrice(e.target.value)}
                                className="input-premium"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-6 flex gap-4 border-t border-border mt-4">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 border border-border text-muted py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-surface-soft transition-colors"
                        >
                            Скасувати
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 btn-primary py-3.5 text-xs"
                        >
                            Зберегти
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
      
      {/* Checkout and Edit Modals - implicitly styled via global classes in App.tsx/index.css, effectively using the same premium modal look */}
    </div>
  );
};