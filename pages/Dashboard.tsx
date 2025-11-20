
import React from 'react';
import { Clock, Calendar as CalendarIcon, DollarSign } from 'lucide-react';
import { Appointment, AppView, Transaction, User } from '../types';

interface DashboardProps {
  onChangeView: (view: AppView) => void;
  appointments: Appointment[];
  transactions: Transaction[];
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ onChangeView, appointments, transactions, user }) => {
  const today = new Date();
  
  // Filter appointments for today
  const todayAppointments = appointments.filter(app => 
    app.date.getDate() === today.getDate() && 
    app.date.getMonth() === today.getMonth() &&
    app.date.getFullYear() === today.getFullYear()
  );

  // Calculate Today's Income (Sum of transactions with type 'income' happening today)
  const dailyIncome = transactions
    .filter(t => 
        t.type === 'income' &&
        t.date.getDate() === today.getDate() && 
        t.date.getMonth() === today.getMonth() &&
        t.date.getFullYear() === today.getFullYear()
    )
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header className="border-b border-[#1e2d3d] pb-6">
        <h2 className="text-3xl font-bold text-[#d6b980] mb-2 font-serif">Вітаємо, {user.name.split(' ')[0]}</h2>
        <p className="text-slate-400 font-light">
            {today.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </header>

      {/* Simplified Stats: Daily Income Only */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#1a2736] to-[#101b2a] p-8 rounded-lg border border-[#d6b980] shadow-[0_0_20px_rgba(214,185,128,0.15)] relative overflow-hidden">
             <div className="absolute right-0 top-0 p-4 opacity-10">
                <DollarSign className="w-32 h-32 text-[#d6b980]" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-[#d6b980] text-sm uppercase tracking-widest font-medium">
                    <Clock className="w-4 h-4" /> Дохід за сьогодні
                </div>
                <p className="text-5xl font-serif text-white mb-2">
                    ₴{dailyIncome.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">Поточна зміна</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Today's Schedule */}
        <section>
             <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-serif text-white">Розклад на Сьогодні</h3>
                <button onClick={() => onChangeView(AppView.CALENDAR)} className="text-[#d6b980] text-xs uppercase hover:underline">Перейти до календаря</button>
            </div>
             <div className="bg-[#1a2736] rounded-lg border border-[#2a3c52] p-6 space-y-4 min-h-[200px]">
                {todayAppointments.length > 0 ? (
                    todayAppointments.map(app => (
                        <div key={app.id} className="flex items-center gap-4 p-4 bg-[#101b2a] rounded border border-[#2a3c52] hover:border-[#d6b980]/30 transition-colors group">
                             <div className={`w-1.5 h-12 rounded-full ${app.status === 'completed' ? 'bg-green-500' : 'bg-[#d6b980]'}`}></div>
                             <div className="flex flex-col items-center min-w-[60px]">
                                 <span className="text-white font-serif text-lg">{app.date.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}</span>
                             </div>
                             <div className="flex-1">
                                 <p className="text-white font-medium text-base">{app.clientName}</p>
                                 <p className="text-slate-500 text-sm">{app.service} • {app.durationMinutes} хв</p>
                             </div>
                             <div>
                                 <span className={`text-xs font-bold px-3 py-1 rounded border ${
                                     app.status === 'completed' ? 'border-green-500/30 text-green-400 bg-green-900/20' : 'border-[#2a3c52] text-slate-400'
                                 }`}>
                                     {app.status === 'completed' ? 'Завершено' : 'Очікує'}
                                 </span>
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 italic py-10">
                        <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                        <p>На сьогодні записів немає.</p>
                    </div>
                )}
             </div>
        </section>
      </div>
    </div>
  );
};
