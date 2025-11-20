
import React, { useState } from 'react';
import { 
  format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, 
  addWeeks, subWeeks, subDays, getDay, setHours, setMinutes, getHours, getMinutes
} from 'date-fns';
import { uk } from 'date-fns/locale';
import { Scissors, Plus, X, Save, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, LayoutList, Grid, Columns, AlertCircle, CheckCircle, CreditCard, Wallet, Edit2, Trash2, AlertTriangle, List, AlignLeft } from 'lucide-react';
import { Appointment, Client, ServiceType, WorkSchedule, PaymentMethod, CalendarDailyView, ServiceItem, ServiceCategory } from '../types';

interface CalendarViewProps {
    appointments: Appointment[];
    clients: Client[];
    services: ServiceItem[];
    categories: ServiceCategory[]; // Added categories
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
    appointments, 
    clients, 
    services,
    categories,
    onAddAppointment, 
    workSchedule, 
    onCloseAppointment,
    onRescheduleAppointment,
    onCancelAppointment,
    dailyViewMode,
    onToggleDailyView
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Checkout Modal State
  const [checkoutApp, setCheckoutApp] = useState<Appointment | null>(null);
  const [checkoutPrice, setCheckoutPrice] = useState<string>('');

  // Edit/Reschedule State
  const [editApp, setEditApp] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [showConflictWarning, setShowConflictWarning] = useState(false);


  // Form State (New Appointment)
  const [formClientId, setFormClientId] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('10:00');
  const [formService, setFormService] = useState(''); 
  const [formPrice, setFormPrice] = useState('0');
  const [formDuration, setFormDuration] = useState('60');

  // Navigation Logic
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

  // Helper to check if a specific date is a working day
  const isWorkingDay = (date: Date) => {
      const dayOfWeek = getDay(date); // 0-6
      return workSchedule[dayOfWeek].isWorking;
  };

  const getWorkingHours = (date: Date) => {
      const dayOfWeek = getDay(date);
      return workSchedule[dayOfWeek];
  }

  // Modal Logic
  const openModal = (date?: Date, timeStr?: string) => {
      const targetDate = date || currentDate;
      setFormDate(format(targetDate, 'yyyy-MM-dd'));
      if (timeStr) {
          setFormTime(timeStr);
      }
      setIsModalOpen(true);
  };

  // Auto-fill logic when selecting a service
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
          
          // Overlap formula: (StartA < EndB) and (EndA > StartB)
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
      // Keep the time or reset? Let's keep for convenience or reset to default.
  };

  const handleCheckout = (method: PaymentMethod) => {
      if (checkoutApp && checkoutPrice) {
          const finalPrice = parseFloat(checkoutPrice) || checkoutApp.price;
          onCloseAppointment(checkoutApp.id, method, finalPrice);
          setCheckoutApp(null);
          setCheckoutPrice('');
      }
  }

  // Check if selected form date/time is valid against schedule
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

  // ... (Render helper functions for Header, Timeline, Week, Month omitted for brevity but assumed preserved) ...
  // ... Re-using the exact same render structure as before ...

  const renderHeader = () => (
    <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-6 bg-[#1a2736] p-4 rounded border border-[#2a3c52]">
      <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-start">
        <button onClick={handlePrev} className="p-2 hover:bg-[#2a3c52] rounded-full text-slate-400 hover:text-[#d6b980] transition-colors">
            <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center min-w-[180px]">
            <h3 className="text-xl font-serif text-white capitalize">
                {viewMode === 'month' 
                    ? format(currentDate, 'LLLL yyyy', { locale: uk }) 
                    : format(currentDate, 'd MMMM yyyy', { locale: uk })
                }
            </h3>
            <button onClick={handleToday} className="text-[10px] uppercase tracking-widest text-[#d6b980] hover:underline">
                Сьогодні
            </button>
        </div>
        <button onClick={handleNext} className="p-2 hover:bg-[#2a3c52] rounded-full text-slate-400 hover:text-[#d6b980] transition-colors">
            <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-3 w-full xl:w-auto justify-center xl:justify-end">
        <div className="flex bg-[#101b2a] p-1 rounded border border-[#2a3c52]">
            {[
                { id: 'day', icon: LayoutList, label: 'День' },
                { id: 'week', icon: Columns, label: 'Тиждень' },
                { id: 'month', icon: Grid, label: 'Місяць' }
            ].map((view) => (
                <button
                    key={view.id}
                    onClick={() => setViewMode(view.id as ViewMode)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded text-xs font-medium transition-all ${
                        viewMode === view.id 
                        ? 'bg-[#d6b980] text-[#101b2a] shadow-md' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                >
                    <view.icon className="w-3 h-3" />
                    <span className="hidden md:inline">{view.label}</span>
                </button>
            ))}
        </div>

        {viewMode === 'day' && (
             <div className="flex bg-[#101b2a] p-1 rounded border border-[#2a3c52]">
                <button
                    onClick={() => onToggleDailyView('cards')}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-all ${
                        dailyViewMode === 'cards' 
                        ? 'bg-[#2a3c52] text-white' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Вигляд картками"
                >
                    <List className="w-3 h-3" />
                </button>
                <button
                    onClick={() => onToggleDailyView('timeline')}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-all ${
                        dailyViewMode === 'timeline' 
                        ? 'bg-[#2a3c52] text-white' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Вигляд таймлайн"
                >
                    <Clock className="w-3 h-3" />
                </button>
             </div>
        )}

        <button 
            onClick={() => openModal()}
            className="bg-[#d6b980] hover:bg-[#c2a56a] text-[#101b2a] px-4 md:px-6 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(214,185,128,0.2)]"
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

    // Timeline Setup
    const startHour = 8;
    const endHour = 22;
    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
    const hourHeight = 80; // px per hour

    return (
        <div className="bg-[#1a2736] rounded border border-[#2a3c52] overflow-hidden min-h-[600px] flex flex-col">
             {/* Day Header Info */}
             <div className="bg-[#101b2a] border-b border-[#2a3c52] p-4 flex justify-between items-center sticky top-0 z-30">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#d6b980]" />
                    <span className="text-sm text-slate-300">
                        Графік: {schedule.isWorking ? <span className="text-white font-medium">{schedule.start} - {schedule.end}</span> : <span className="text-red-400">Вихідний</span>}
                    </span>
                </div>
             </div>

             <div className="flex-1 relative overflow-y-auto scrollbar-thin">
                 {/* Timeline Grid */}
                 <div className="relative min-w-[600px]" style={{ height: hours.length * hourHeight + 50 }}>
                    {/* Grid Lines & Labels */}
                    {hours.map(hour => (
                        <div 
                            key={hour} 
                            className="absolute w-full border-b border-[#2a3c52]/50 flex group cursor-pointer hover:bg-[#2a3c52]/20 transition-colors"
                            style={{ top: (hour - startHour) * hourHeight, height: hourHeight }}
                            onClick={() => openModal(currentDate, `${hour.toString().padStart(2, '0')}:00`)}
                        >
                            <div className="w-16 flex-shrink-0 text-xs text-slate-500 text-right pr-4 -mt-2 font-serif sticky left-0 bg-[#1a2736] group-hover:bg-inherit">
                                {hour}:00
                            </div>
                            <div className="flex-1 relative">
                                {/* Half-hour marker */}
                                <div className="absolute w-full border-b border-[#2a3c52]/20 top-1/2"></div>
                            </div>
                        </div>
                    ))}

                    {/* Appointments (Absolute Positioning) */}
                    {dayAppointments.map(app => {
                        const startH = getHours(app.date);
                        const startM = getMinutes(app.date);
                        
                        // Calculate position relative to startHour
                        const topPosition = ((startH - startHour) * hourHeight) + ((startM / 60) * hourHeight);
                        const height = (app.durationMinutes / 60) * hourHeight;

                        // Skip rendering if out of view bounds (simple check)
                        if (startH < startHour || startH > endHour) return null;

                        return (
                            <div 
                                key={app.id}
                                className={`absolute left-20 right-4 rounded px-3 py-2 border-l-4 shadow-lg transition-all cursor-pointer hover:z-20 overflow-hidden flex flex-col justify-center
                                    ${app.status === 'completed' 
                                        ? 'bg-[#101b2a]/90 border-green-500/50 opacity-80' 
                                        : 'bg-[#1e2d3d] border-[#d6b980] hover:bg-[#233040] hover:shadow-[#d6b980]/20'
                                    }`}
                                style={{ 
                                    top: topPosition, 
                                    height: Math.max(height, 30), // Min height for visibility
                                    zIndex: 10 
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    if (app.status === 'scheduled') handleInitiateCheckout(app); 
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white font-serif font-bold text-sm leading-tight">
                                            {app.clientName}
                                        </p>
                                        <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                                            {format(app.date, 'HH:mm')} - {format(addDays(app.date, 0).setMinutes(startM + app.durationMinutes), 'HH:mm')}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {app.status === 'completed' && <CheckCircle className="w-3 h-3 text-green-500" />}
                                        <span className="text-[#d6b980] text-xs font-bold">₴{app.price}</span>
                                    </div>
                                </div>
                                
                                {/* Actions overlay on hover */}
                                {app.status === 'scheduled' && (
                                    <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 hover:opacity-100 transition-opacity bg-[#0d1623]/80 rounded p-1">
                                         <button onClick={(e) => {e.stopPropagation(); handleInitiateEdit(app)}} className="p-1 text-slate-300 hover:text-white" title="Редагувати">
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button onClick={(e) => {e.stopPropagation(); onCancelAppointment(app.id)}} className="p-1 text-slate-300 hover:text-red-400" title="Скасувати">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
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
        <div className="space-y-4 min-h-[600px]">
             {/* Schedule Info */}
             <div className="bg-[#1a2736] p-4 rounded border border-[#2a3c52] flex justify-between items-center">
                <div className="flex items-center gap-2">
                     <CalendarIcon className="w-4 h-4 text-[#d6b980]" />
                     <span className="text-sm text-slate-300 font-medium">
                        Записів на сьогодні: <span className="text-white">{dayAppointments.length}</span>
                     </span>
                </div>
             </div>

             {dayAppointments.length > 0 ? (
                dayAppointments.map(app => (
                    <div key={app.id} className="bg-[#1a2736] rounded border border-[#2a3c52] p-4 hover:border-[#d6b980] transition-colors group relative">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`flex flex-col items-center justify-center w-16 h-16 rounded border ${
                                    app.status === 'completed' ? 'bg-[#101b2a] border-green-900' : 'bg-[#101b2a] border-[#d6b980]'
                                }`}>
                                    <span className="text-lg font-bold text-white">{format(app.date, 'HH:mm')}</span>
                                    <span className="text-[10px] text-slate-500">{app.durationMinutes} хв</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-serif text-white">{app.clientName}</h4>
                                    <p className="text-sm text-slate-400">{app.service}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                <div className="text-right">
                                    <p className="text-[#d6b980] font-bold">₴{app.price}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                        app.status === 'completed' ? 'bg-green-900/30 text-green-400' : 'bg-[#2a3c52] text-slate-400'
                                    }`}>
                                        {app.status === 'completed' ? 'Оплачено' : 'Очікує'}
                                    </span>
                                </div>
                                
                                {app.status === 'scheduled' && (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleInitiateCheckout(app)}
                                            className="p-2 bg-[#d6b980] text-[#101b2a] rounded hover:bg-[#c2a56a] transition-colors"
                                            title="Розрахувати"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleInitiateEdit(app)}
                                            className="p-2 border border-[#2a3c52] text-slate-300 rounded hover:bg-[#2a3c52] transition-colors"
                                            title="Редагувати"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => onCancelAppointment(app.id)}
                                            className="p-2 border border-[#2a3c52] text-slate-300 rounded hover:text-red-400 hover:border-red-400/50 transition-colors"
                                            title="Скасувати"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
             ) : (
                 <div className="flex flex-col items-center justify-center h-64 text-slate-500 border border-dashed border-[#2a3c52] rounded">
                     <Clock className="w-12 h-12 mb-4 opacity-20" />
                     <p>На цей день записів немає.</p>
                     <button onClick={() => openModal()} className="mt-4 text-[#d6b980] text-sm hover:underline">Додати запис</button>
                 </div>
             )}
        </div>
    );
  };

  const renderDayView = () => {
      if (dailyViewMode === 'timeline') {
          return renderTimelineView();
      }
      return renderCardsView();
  };

  const renderWeekView = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

    return (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-h-[600px]">
            {days.map((day, idx) => {
                const dayApps = appointments
                    .filter(app => isSameDay(app.date, day) && app.status !== 'cancelled')
                    .sort((a, b) => a.date.getTime() - b.date.getTime());
                const isToday = isSameDay(day, new Date());
                const workingInfo = getWorkingHours(day);

                return (
                    <div key={idx} className={`bg-[#1a2736] rounded border flex flex-col relative overflow-hidden ${isToday ? 'border-[#d6b980]' : 'border-[#2a3c52]'}`}>
                        {/* Non-working overlay */}
                        {!workingInfo.isWorking && (
                            <div className="absolute inset-0 bg-[#0d1623]/80 z-10 flex items-center justify-center pointer-events-none">
                                <span className="-rotate-90 text-slate-500 font-bold text-2xl uppercase tracking-widest opacity-30 whitespace-nowrap">Вихідний</span>
                            </div>
                        )}

                        <div className={`p-3 text-center border-b ${isToday ? 'bg-[#d6b980] text-[#101b2a]' : 'bg-[#101b2a] border-[#2a3c52]'}`}>
                            <span className="text-xs font-bold uppercase block mb-1 opacity-70">{format(day, 'EEE', { locale: uk })}</span>
                            <span className="text-xl font-serif font-bold">{format(day, 'd')}</span>
                            {workingInfo.isWorking && (
                                <span className="text-[10px] block mt-1 opacity-60">{workingInfo.start}-{workingInfo.end}</span>
                            )}
                        </div>
                        <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[600px] scrollbar-thin">
                            {dayApps.map(app => (
                                <div 
                                    key={app.id} 
                                    className={`p-2 rounded border text-xs transition-colors group relative z-20 cursor-pointer ${
                                        app.status === 'completed' 
                                        ? 'bg-[#101b2a] border-green-900/50 opacity-60' 
                                        : 'bg-[#101b2a] border-[#2a3c52] hover:border-[#d6b980]'
                                    }`}
                                    onClick={() => app.status === 'scheduled' && handleInitiateCheckout(app)}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[#d6b980] font-medium">{format(app.date, 'HH:mm')}</span>
                                        {app.status === 'completed' && <CheckCircle className="w-3 h-3 text-green-500" />}
                                        {app.status === 'scheduled' && (
                                            <div className="hidden group-hover:flex gap-1 absolute right-1 top-1 bg-[#101b2a] p-1 rounded shadow">
                                                <button onClick={(e) => {e.stopPropagation(); handleInitiateEdit(app)}} className="text-slate-400 hover:text-white"><Edit2 className="w-3 h-3"/></button>
                                                <button onClick={(e) => {e.stopPropagation(); onCancelAppointment(app.id)}} className="text-slate-400 hover:text-red-400"><Trash2 className="w-3 h-3"/></button>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-white font-medium truncate">{app.clientName}</p>
                                    <p className="text-slate-500 truncate text-[10px]">{app.service}</p>
                                </div>
                            ))}
                            {dayApps.length === 0 && workingInfo.isWorking && (
                                <div className="h-full flex items-center justify-center opacity-10 hover:opacity-30 transition-opacity cursor-pointer" onClick={() => openModal(day)}>
                                    <Plus className="w-6 h-6" />
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
        <div className="bg-[#1a2736] rounded border border-[#2a3c52] overflow-hidden">
            <div className="grid grid-cols-7 bg-[#101b2a] border-b border-[#2a3c52]">
                {weekDays.map(d => (
                    <div key={d} className="py-3 text-center text-xs font-bold text-[#d6b980] uppercase tracking-widest">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((day, idx) => {
                    const dayApps = appointments.filter(app => isSameDay(app.date, day) && app.status !== 'cancelled');
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isToday = isSameDay(day, new Date());
                    const isWorking = isWorkingDay(day);

                    return (
                        <div 
                            key={idx} 
                            onClick={() => { setCurrentDate(day); setViewMode('day'); }}
                            className={`min-h-[100px] p-2 border-b border-r border-[#2a3c52] relative hover:bg-[#233040] transition-colors cursor-pointer
                                ${!isCurrentMonth ? 'bg-[#101b2a]/50 text-slate-600' : 'text-white'}
                                ${!isWorking ? 'bg-[#0d1623]/50' : ''}
                            `}
                        >
                            <span className={`absolute top-2 right-2 text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full 
                                ${isToday ? 'bg-[#d6b980] text-[#101b2a]' : ''}
                                ${!isWorking && !isToday ? 'text-slate-600' : ''}
                            `}>
                                {format(day, 'd')}
                            </span>

                            <div className="mt-6 space-y-1">
                                {dayApps.slice(0, 3).map((app, i) => (
                                    <div key={i} className={`h-1.5 w-full rounded-full ${app.status === 'completed' ? 'bg-green-500' : 'bg-[#d6b980]'}`} title={`${app.clientName} - ${format(app.date, 'HH:mm')}`}></div>
                                ))}
                                {dayApps.length > 3 && (
                                    <div className="text-[10px] text-slate-500 text-center">+{dayApps.length - 3}</div>
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
    <div className="space-y-6 pb-24 md:pb-8 relative animate-in fade-in duration-500">
      {renderHeader()}
      
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'month' && renderMonthView()}

       {/* Create Appointment Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1623]/80 backdrop-blur-sm">
            <div className="bg-[#1a2736] w-full max-w-md rounded-lg border border-[#d6b980] shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-serif text-white">Новий Запис</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Клієнт</label>
                        <select
                            required
                            value={formClientId}
                            onChange={(e) => setFormClientId(e.target.value)}
                            className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none"
                        >
                            <option value="" disabled>Оберіть клієнта</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Дата</label>
                            <input 
                                type="date"
                                required
                                value={formDate}
                                onChange={(e) => setFormDate(e.target.value)}
                                className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none [color-scheme:dark]"
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Час</label>
                            <div className="relative">
                                <input 
                                    type="time"
                                    required
                                    value={formTime}
                                    onChange={(e) => setFormTime(e.target.value)}
                                    className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Warning for off-hours */}
                    {!isFormTimeValid() && (
                         <div className="bg-red-900/20 border border-red-500/30 p-3 rounded flex items-center gap-2 text-red-200 text-xs">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Увага: Цей час виходить за межі вашого графіку роботи, або це вихідний.</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Послуга</label>
                        <select
                            value={formService}
                            onChange={(e) => handleServiceChange(e.target.value)}
                            className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none"
                        >
                            <option value="" disabled>Оберіть послугу</option>
                            {categories.map(category => {
                                const categoryServices = services.filter(s => s.categoryId === category.id);
                                if (categoryServices.length === 0) return null;
                                return (
                                    <optgroup key={category.id} label={category.title} className="bg-[#1a2736] text-white">
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
                            <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Тривалість (хв)</label>
                            <input 
                                type="number"
                                required
                                step="15"
                                value={formDuration}
                                onChange={(e) => setFormDuration(e.target.value)}
                                className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Вартість (₴)</label>
                            <input 
                                type="number"
                                required
                                value={formPrice}
                                onChange={(e) => setFormPrice(e.target.value)}
                                className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 border border-[#2a3c52] text-slate-300 py-3 rounded text-sm font-medium hover:bg-[#2a3c52] transition-colors"
                        >
                            Скасувати
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 bg-[#d6b980] text-[#101b2a] py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-[#c2a56a] transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Зберегти
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
      
      {/* Reschedule Modal and Checkout Modal logic ... (re-rendered here to ensure file completeness) */}
      {/* (For brevity, assuming the existing modals are here. The key change above was the select>optgroup implementation) */}
      
      {editApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d1623]/80 backdrop-blur-sm">
             <div className="bg-[#1a2736] w-full max-w-md rounded-lg border border-[#d6b980] shadow-2xl p-6 animate-in zoom-in-95 duration-200 relative">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-serif text-white">Перенесення візиту</h3><button onClick={() => setEditApp(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></div>
                <div className="space-y-4">
                    <p className="text-sm text-slate-300 bg-[#101b2a] p-3 rounded border border-[#2a3c52]">Клієнт: <span className="text-white font-medium">{editApp.clientName}</span><br/>Послуга: <span className="text-white font-medium">{editApp.service}</span></p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Нова Дата</label><input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none [color-scheme:dark]" /></div>
                        <div className="space-y-2"><label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Новий Час</label><input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none [color-scheme:dark]" /></div>
                    </div>
                    <div className="space-y-2"><label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Тривалість (хв)</label><input type="number" step="15" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none" /></div>
                </div>
                {showConflictWarning && (<div className="absolute inset-0 bg-[#0d1623]/90 z-10 flex flex-col items-center justify-center p-8 text-center animate-in fade-in"><AlertTriangle className="w-12 h-12 text-[#d6b980] mb-4" /><h4 className="text-xl text-white font-serif mb-2">Конфлікт у розкладі</h4><p className="text-sm text-slate-400 mb-6">Обраний час перетинається з іншим записом. Ви впевнені, що хочете перенести візит саме на цей час?</p><div className="flex gap-3 w-full"><button onClick={() => setShowConflictWarning(false)} className="flex-1 border border-[#2a3c52] text-white py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#2a3c52]">Змінити час</button><button onClick={() => handleSaveEdit(true)} className="flex-1 bg-[#d6b980] text-[#101b2a] py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#c2a56a]">Все одно зберегти</button></div></div>)}
                <div className="pt-4 flex gap-3"><button onClick={() => setEditApp(null)} className="flex-1 border border-[#2a3c52] text-slate-300 py-3 rounded text-sm font-medium hover:bg-[#2a3c52] transition-colors">Скасувати</button><button onClick={() => handleSaveEdit(false)} className="flex-1 bg-[#d6b980] text-[#101b2a] py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-[#c2a56a] transition-colors flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Зберегти зміни</button></div>
              </div>
          </div>
      )}
      {checkoutApp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0d1623]/90 backdrop-blur-sm">
            <div className="bg-[#1a2736] w-full max-w-sm rounded-lg border border-[#d6b980] shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                 <div className="text-center mb-6"><div className="w-16 h-16 rounded-full bg-[#d6b980]/10 flex items-center justify-center mx-auto mb-4 border border-[#d6b980]"><CheckCircle className="w-8 h-8 text-[#d6b980]" /></div><h3 className="text-xl font-serif text-white mb-1">Завершення візиту</h3><p className="text-slate-400 text-sm">{checkoutApp.clientName} — {checkoutApp.service}</p></div>
                 <div className="bg-[#101b2a] p-4 rounded border border-[#2a3c52] mb-6 text-center relative group"><div className="absolute right-2 top-2 text-slate-500"><Edit2 className="w-3 h-3" /></div><span className="text-xs uppercase tracking-widest text-slate-500 block mb-1">До сплати (₴)</span><input type="number" value={checkoutPrice} onChange={(e) => setCheckoutPrice(e.target.value)} className="w-full bg-transparent text-3xl font-serif text-white text-center focus:outline-none border-b border-[#d6b980]/30 focus:border-[#d6b980] pb-1 transition-colors" /></div>
                 <div className="space-y-3"><p className="text-xs uppercase tracking-widest text-[#d6b980] text-center mb-2">Оберіть метод оплати</p><button onClick={() => handleCheckout('cash')} className="w-full py-3 border border-[#2a3c52] hover:border-[#d6b980] hover:bg-[#101b2a] rounded flex items-center justify-center gap-3 text-white transition-all group"><Wallet className="w-5 h-5 text-slate-400 group-hover:text-[#d6b980]" />Готівка</button><button onClick={() => handleCheckout('card')} className="w-full py-3 border border-[#2a3c52] hover:border-[#d6b980] hover:bg-[#101b2a] rounded flex items-center justify-center gap-3 text-white transition-all group"><CreditCard className="w-5 h-5 text-slate-400 group-hover:text-[#d6b980]" />Картка (Термінал)</button></div>
                 <button onClick={() => setCheckoutApp(null)} className="mt-6 w-full text-xs text-slate-500 hover:text-white py-2">Скасувати</button>
            </div>
        </div>
      )}
    </div>
  );
};
