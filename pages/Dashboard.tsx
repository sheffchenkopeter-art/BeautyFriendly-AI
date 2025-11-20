import React from 'react';
import { TrendingUp, Clock, Calendar as CalendarIcon, DollarSign, ArrowRight } from 'lucide-react';
import { Appointment, AppView } from '../types';
import { INITIAL_TRENDS } from '../constants';

interface DashboardProps {
  onChangeView: (view: AppView) => void;
  appointments: Appointment[];
}

export const Dashboard: React.FC<DashboardProps> = ({ onChangeView, appointments }) => {
  // Calculate today's appointments dynamically
  const today = new Date();
  const todayAppointments = appointments.filter(app => 
    app.date.getDate() === today.getDate() && 
    app.date.getMonth() === today.getMonth() &&
    app.date.getFullYear() === today.getFullYear()
  );

  const totalRevenue = todayAppointments.reduce((acc, curr) => acc + curr.price, 0);
  const totalHours = todayAppointments.reduce((acc, curr) => acc + curr.durationMinutes, 0) / 60;

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header className="border-b border-[#1e2d3d] pb-6">
        <h2 className="text-3xl font-bold text-[#d6b980] mb-2">Доброго дня, Маріє.</h2>
        <p className="text-slate-400 font-light">Ваш професійний огляд на сьогодні.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1a2736] p-5 rounded-lg border border-[#2a3c52] shadow-lg hover:border-[#d6b980]/30 transition-colors">
          <div className="flex items-start justify-between mb-4">
             <p className="text-slate-400 text-xs uppercase tracking-widest">Записів</p>
             <CalendarIcon className="w-4 h-4 text-[#d6b980]" />
          </div>
          <p className="text-3xl font-serif text-white">{todayAppointments.length}</p>
        </div>
        <div className="bg-[#1a2736] p-5 rounded-lg border border-[#2a3c52] shadow-lg hover:border-[#d6b980]/30 transition-colors">
          <div className="flex items-start justify-between mb-4">
             <p className="text-slate-400 text-xs uppercase tracking-widest">Дохід</p>
             <DollarSign className="w-4 h-4 text-[#d6b980]" />
          </div>
          <p className="text-3xl font-serif text-white">₴{totalRevenue}</p>
        </div>
        <div className="bg-[#1a2736] p-5 rounded-lg border border-[#2a3c52] shadow-lg hover:border-[#d6b980]/30 transition-colors">
          <div className="flex items-start justify-between mb-4">
             <p className="text-slate-400 text-xs uppercase tracking-widest">Години</p>
             <Clock className="w-4 h-4 text-[#d6b980]" />
          </div>
          <p className="text-3xl font-serif text-white">{totalHours.toFixed(1)}</p>
        </div>
        <div className="bg-[#1a2736] p-5 rounded-lg border border-[#2a3c52] shadow-lg hover:border-[#d6b980]/30 transition-colors">
          <div className="flex items-start justify-between mb-4">
             <p className="text-slate-400 text-xs uppercase tracking-widest">Клієнти</p>
             <TrendingUp className="w-4 h-4 text-[#d6b980]" />
          </div>
          <p className="text-3xl font-serif text-white">Active</p>
        </div>
      </div>

      {/* Today's Schedule Preview */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-serif text-white">Розклад</h3>
          <button 
            onClick={() => onChangeView(AppView.CALENDAR)}
            className="text-[#d6b980] text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
          >
            Весь календар <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="bg-[#1a2736] rounded-lg border border-[#2a3c52] divide-y divide-[#2a3c52]">
          {todayAppointments.length > 0 ? (
            todayAppointments.map((apt) => (
              <div key={apt.id} className="p-5 flex items-center gap-5 hover:bg-[#233040] transition-colors">
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-[#101b2a] rounded border border-[#2a3c52] text-[#d6b980]">
                  <span className="text-[10px] font-bold uppercase">{apt.date.toLocaleString('uk-UA', { weekday: 'short' })}</span>
                  <span className="text-lg font-serif">{apt.date.getDate()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-serif text-lg text-white mb-1">{apt.clientName}</h4>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">{apt.service} • {apt.durationMinutes} хв</p>
                    </div>
                    <span className="text-sm font-medium text-[#d6b980] bg-[#d6b980]/10 px-3 py-1 rounded-full">
                      {apt.date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 italic font-light">
              На сьогодні записів немає.
            </div>
          )}
        </div>
      </section>

      {/* Trends Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-serif text-white">Актуальні Тренди</h3>
          <button 
            onClick={() => onChangeView(AppView.AI_STYLIST)}
            className="text-[#d6b980] text-xs uppercase tracking-widest hover:text-white transition-colors"
          >
            Запитати AI
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_TRENDS.map((trend) => (
            <div key={trend.id} className="group relative overflow-hidden rounded-lg h-64 cursor-pointer border border-[#2a3c52]">
              <img src={trend.imageUrl} alt={trend.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101b2a] via-[#101b2a]/40 to-transparent flex flex-col justify-end p-6">
                <h4 className="text-[#d6b980] font-serif text-2xl mb-2">{trend.title}</h4>
                <p className="text-slate-300 text-sm font-light leading-relaxed">{trend.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};