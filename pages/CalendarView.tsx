import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Clock, User, Scissors, Plus } from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../constants';

export const CalendarView: React.FC = () => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  
  // Group appointments by day for simple visualization
  const today = new Date();
  const todayAppointments = MOCK_APPOINTMENTS.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Календар</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Новий запис
        </button>
      </div>

      {/* Weekly Strip */}
      <div className="flex justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        {weekDays.map((date, index) => {
          const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
          return (
            <div key={index} className={`flex flex-col items-center min-w-[3rem] p-2 rounded-xl cursor-pointer transition-colors ${isToday ? 'bg-purple-600 text-white' : 'hover:bg-slate-50'}`}>
              <span className={`text-xs font-medium mb-1 ${isToday ? 'text-white/80' : 'text-slate-500'}`}>
                {format(date, 'EEE', { locale: uk })}
              </span>
              <span className="text-lg font-bold">
                {format(date, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-900">Сьогодні, {format(today, 'd MMMM', { locale: uk })}</h3>
        </div>
        
        <div className="divide-y divide-slate-100">
            {todayAppointments.length > 0 ? (
                todayAppointments.map(app => (
                    <div key={app.id} className="flex p-4 hover:bg-slate-50 transition-colors group">
                        <div className="w-16 flex-shrink-0 flex flex-col items-center pt-1">
                            <span className="text-sm font-bold text-slate-900">
                                {format(app.date, 'HH:mm')}
                            </span>
                            <span className="text-xs text-slate-400">
                                {app.durationMinutes} хв
                            </span>
                        </div>
                        <div className="flex-1 ml-4 p-3 bg-purple-50 border-l-4 border-purple-500 rounded-r-xl">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    <User className="w-4 h-4 text-purple-600" />
                                    {app.clientName}
                                </h4>
                                <span className="text-xs font-bold bg-white px-2 py-1 rounded-md text-slate-600 shadow-sm">
                                    ₴{app.price}
                                </span>
                            </div>
                            <p className="text-sm text-slate-600 flex items-center gap-2">
                                <Scissors className="w-3 h-3" />
                                {app.service}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-slate-500">
                    На сьогодні записів немає
                </div>
            )}
          
          {/* Free slot visualization example */}
          <div className="flex p-4 opacity-50">
             <div className="w-16 flex-shrink-0 text-center pt-1">
                <span className="text-sm font-medium text-slate-400">16:00</span>
            </div>
            <div className="flex-1 ml-4 border-t border-dashed border-slate-300 relative top-3"></div>
          </div>
           <div className="flex p-4 opacity-50">
             <div className="w-16 flex-shrink-0 text-center pt-1">
                <span className="text-sm font-medium text-slate-400">17:00</span>
            </div>
             <div className="flex-1 ml-4 border-t border-dashed border-slate-300 relative top-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};