import React, { useState } from 'react';
import { 
  format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, 
  addWeeks, subWeeks, subDays, getDay
} from 'date-fns';
import { uk } from 'date-fns/locale';
import { Scissors, Plus, X, Save, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, LayoutList, Grid, Columns, AlertCircle } from 'lucide-react';
import { Appointment, Client, ServiceType, WorkSchedule } from '../types';

interface CalendarViewProps {
    appointments: Appointment[];
    clients: Client[];
    onAddAppointment: (appointment: Appointment) => void;
    workSchedule: WorkSchedule;
}

type ViewMode = 'day' | 'week' | 'month';

export const CalendarView: React.FC<CalendarViewProps> = ({ appointments, clients, onAddAppointment, workSchedule }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formClientId, setFormClientId] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('10:00');
  const [formService, setFormService] = useState<ServiceType>(ServiceType.HAIRCUT);
  const [formPrice, setFormPrice] = useState('500');
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
  const openModal = (date?: Date) => {
      const targetDate = date || currentDate;
      setFormDate(format(targetDate, 'yyyy-MM-dd'));
      setIsModalOpen(true);
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
      setFormTime('10:00');
  };

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

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-[#1a2736] p-4 rounded border border-[#2a3c52]">
      <div className="flex items-center gap-4">
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

      <div className="flex bg-[#101b2a] p-1 rounded border border-[#2a3c52]">
          {[
              { id: 'day', icon: LayoutList, label: 'День' },
              { id: 'week', icon: Columns, label: 'Тиждень' },
              { id: 'month', icon: Grid, label: 'Місяць' }
          ].map((view) => (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id as ViewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all ${
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

      <button 
          onClick={() => openModal()}
          className="bg-[#d6b980] hover:bg-[#c2a56a] text-[#101b2a] px-6 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(214,185,128,0.2)]"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden md:inline">Запис</span>
      </button>
    </div>
  );

  const renderDayView = () => {
    const dayAppointments = appointments
        .filter(app => isSameDay(app.date, currentDate))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    const schedule = getWorkingHours(currentDate);

    return (
        <div className="bg-[#1a2736] rounded border border-[#2a3c52] overflow-hidden min-h-[500px]">
             {/* Day Header Info */}
             <div className="bg-[#101b2a] border-b border-[#2a3c52] p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#d6b980]" />
                    <span className="text-sm text-slate-300">
                        Графік: {schedule.isWorking ? <span className="text-white font-medium">{schedule.start} - {schedule.end}</span> : <span className="text-red-400">Вихідний</span>}
                    </span>
                </div>
             </div>

             <div className="divide-y divide-[#2a3c52]">
                {dayAppointments.length > 0 ? (
                    dayAppointments.map(app => (
                        <div key={app.id} className="flex p-6 hover:bg-[#2a3c52]/30 transition-colors group">
                            <div className="w-24 flex-shrink-0 flex flex-col items-center pt-1 border-r border-[#2a3c52] pr-6 mr-6">
                                <span className="text-2xl font-serif text-white">
                                    {format(app.date, 'HH:mm')}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                    <Clock className="w-3 h-3" /> {app.durationMinutes} хв
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-serif text-xl text-white flex items-center gap-2">
                                        {app.clientName}
                                    </h4>
                                    <span className="text-xs font-bold text-[#d6b980] border border-[#d6b980]/30 px-3 py-1 rounded-full">
                                        ₴{app.price}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-sm text-slate-300 flex items-center gap-2 bg-[#101b2a] px-3 py-1 rounded border border-[#2a3c52]">
                                        <Scissors className="w-3 h-3 text-[#d6b980]" />
                                        {app.service}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-96 flex flex-col items-center justify-center text-slate-500 font-light italic gap-4">
                        <CalendarIcon className="w-12 h-12 opacity-20" />
                        {schedule.isWorking ? 'На цей день записів немає' : 'Сьогодні у вас вихідний'}
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderWeekView = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

    return (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-h-[600px]">
            {days.map((day, idx) => {
                const dayApps = appointments
                    .filter(app => isSameDay(app.date, day))
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
                                <div key={app.id} className="bg-[#101b2a] p-2 rounded border border-[#2a3c52] text-xs hover:border-[#d6b980] transition-colors cursor-pointer group relative z-20">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[#d6b980] font-medium">{format(app.date, 'HH:mm')}</span>
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
                    const dayApps = appointments.filter(app => isSameDay(app.date, day));
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
                                    <div key={i} className="h-1.5 w-full rounded-full bg-[#d6b980]" title={`${app.clientName} - ${format(app.date, 'HH:mm')}`}></div>
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

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Послуга</label>
                        <select
                            value={formService}
                            onChange={(e) => setFormService(e.target.value as ServiceType)}
                            className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none"
                        >
                            {Object.values(ServiceType).map(service => (
                                <option key={service} value={service}>{service}</option>
                            ))}
                        </select>
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
    </div>
  );
};