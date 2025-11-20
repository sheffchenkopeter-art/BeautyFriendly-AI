import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { uk } from 'date-fns/locale';
import { User, Scissors, Plus } from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../constants';

export const CalendarView: React.FC = () => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  
  const today = new Date();
  const todayAppointments = MOCK_APPOINTMENTS.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <div className="flex justify-between items-center border-b border-[#1e2d3d] pb-4">
        <h2 className="text-2xl font-serif text-white">Календар Записів</h2>
        <button className="bg-[#d6b980] hover:bg-[#c2a56a] text-[#101b2a] px-6 py-2 rounded text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Створити
        </button>
      </div>

      {/* Weekly Strip */}
      <div className="flex justify-between bg-[#1a2736] p-4 rounded border border-[#2a3c52] overflow-x-auto">
        {weekDays.map((date, index) => {
          const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
          return (
            <div key={index} className={`flex flex-col items-center min-w-[4rem] p-3 rounded cursor-pointer transition-all ${isToday ? 'bg-[#d6b980] text-[#101b2a]' : 'hover:bg-[#2a3c52] text-slate-400'}`}>
              <span className={`text-[10px] font-bold uppercase mb-1 ${isToday ? 'text-[#101b2a]' : 'text-slate-500'}`}>
                {format(date, 'EEE', { locale: uk })}
              </span>
              <span className="text-xl font-serif">
                {format(date, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="bg-[#1a2736] rounded border border-[#2a3c52] overflow-hidden">
        <div className="p-4 border-b border-[#2a3c52] bg-[#101b2a]/30">
          <h3 className="font-bold text-[#d6b980] font-serif">Сьогодні, {format(today, 'd MMMM', { locale: uk })}</h3>
        </div>
        
        <div className="divide-y divide-[#2a3c52]">
            {todayAppointments.length > 0 ? (
                todayAppointments.map(app => (
                    <div key={app.id} className="flex p-5 hover:bg-[#2a3c52]/30 transition-colors group">
                        <div className="w-20 flex-shrink-0 flex flex-col items-center pt-1 border-r border-[#2a3c52] pr-4 mr-4">
                            <span className="text-lg font-serif text-white">
                                {format(app.date, 'HH:mm')}
                            </span>
                            <span className="text-xs text-slate-500">
                                {app.durationMinutes} хв
                            </span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-serif text-lg text-white flex items-center gap-2">
                                    {app.clientName}
                                </h4>
                                <span className="text-xs font-bold text-[#d6b980] border border-[#d6b980]/30 px-2 py-1 rounded">
                                    ₴{app.price}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 flex items-center gap-2">
                                <Scissors className="w-3 h-3 text-[#d6b980]" />
                                {app.service}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-12 text-center text-slate-500 font-light italic">
                    Вільний день
                </div>
            )}
        </div>
      </div>
    </div>
  );
};