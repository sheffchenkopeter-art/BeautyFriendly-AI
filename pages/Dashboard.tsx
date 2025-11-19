import React from 'react';
import { TrendingUp, Clock, Calendar as CalendarIcon, DollarSign, ArrowRight } from 'lucide-react';
import { Appointment, AppView } from '../types';
import { MOCK_APPOINTMENTS, INITIAL_TRENDS } from '../constants';

interface DashboardProps {
  onChangeView: (view: AppView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onChangeView }) => {
  const todayAppointments = MOCK_APPOINTMENTS;
  const totalRevenue = todayAppointments.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Привіт, Маріє! 👋</h2>
        <p className="text-slate-500 mt-1">Ось огляд твого дня та нові тренди.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
            <CalendarIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-slate-500 text-sm">Записів сьогодні</p>
          <p className="text-2xl font-bold text-slate-900">{todayAppointments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-slate-500 text-sm">Дохід (прогноз)</p>
          <p className="text-2xl font-bold text-slate-900">₴{totalRevenue}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
           <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-slate-500 text-sm">Робочі години</p>
          <p className="text-2xl font-bold text-slate-900">6.5</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-slate-500 text-sm">Клієнтська база</p>
          <p className="text-2xl font-bold text-slate-900">+3</p>
        </div>
      </div>

      {/* Today's Schedule Preview */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Розклад на сьогодні</h3>
          <button 
            onClick={() => onChangeView(AppView.CALENDAR)}
            className="text-purple-600 text-sm font-medium flex items-center gap-1 hover:text-purple-700"
          >
            Все <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
          {todayAppointments.slice(0, 3).map((apt) => (
            <div key={apt.id} className="p-4 flex items-center gap-4">
              <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 rounded-xl text-slate-900">
                <span className="text-xs font-bold uppercase">{apt.date.toLocaleString('uk-UA', { weekday: 'short' })}</span>
                <span className="text-lg font-bold">{apt.date.getDate()}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{apt.clientName}</h4>
                    <p className="text-sm text-slate-500">{apt.service} • {apt.durationMinutes} хв</p>
                  </div>
                  <span className="text-sm font-bold text-purple-600">
                    {apt.date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trends Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Тренди тижня</h3>
          <button 
            onClick={() => onChangeView(AppView.AI_STYLIST)}
            className="text-purple-600 text-sm font-medium hover:text-purple-700"
          >
            Запитати AI
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_TRENDS.map((trend) => (
            <div key={trend.id} className="group relative overflow-hidden rounded-2xl h-48 cursor-pointer">
              <img src={trend.imageUrl} alt={trend.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <h4 className="text-white font-bold text-lg">{trend.title}</h4>
                <p className="text-white/80 text-sm line-clamp-2">{trend.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};