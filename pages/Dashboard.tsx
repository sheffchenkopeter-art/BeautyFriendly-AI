import React, { useState } from 'react';
import { Clock, Calendar as CalendarIcon, DollarSign, Sparkles, Send, Loader2, ChevronRight } from 'lucide-react';
import { Appointment, AppView, Transaction, User } from '../types';
import { generateStylingAdvice } from '../services/geminiService';

interface DashboardProps {
  onChangeView: (view: AppView) => void;
  appointments: Appointment[];
  transactions: Transaction[];
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ onChangeView, appointments, transactions, user }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const today = new Date();
  
  // Filter appointments for today
  const todayAppointments = appointments.filter(app => 
    app.date.getDate() === today.getDate() && 
    app.date.getMonth() === today.getMonth() &&
    app.date.getFullYear() === today.getFullYear()
  );

  // Calculate Today's Income
  const dailyIncome = transactions
    .filter(t => 
        t.type === 'income' &&
        t.date.getDate() === today.getDate() && 
        t.date.getMonth() === today.getMonth() &&
        t.date.getFullYear() === today.getFullYear()
    )
    .reduce((acc, t) => acc + t.amount, 0);

  const handleAiQuickAsk = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!aiPrompt.trim()) return;

      setIsAiLoading(true);
      setAiResponse(''); // Clear previous
      try {
          const response = await generateStylingAdvice(aiPrompt);
          setAiResponse(response);
      } catch (err) {
          setAiResponse("Вибачте, зараз я не можу відповісти. Спробуйте пізніше.");
      } finally {
          setIsAiLoading(false);
      }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <header className="border-b border-[#1e2d3d] pb-4 flex justify-between items-end">
        <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#d6b980] mb-1 font-serif">Вітаємо, {user.name.split(' ')[0]}</h2>
            <p className="text-slate-400 font-light text-xs md:text-sm">
                {today.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
        </div>
      </header>

      {/* Top Row: Income (Compact) & AI Agent (Prominent) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* 1. Compact Income Card */}
        <div className="bg-[#1a2736] p-5 rounded-lg border border-[#2a3c52] relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute right-0 top-0 p-3 opacity-5">
                <DollarSign className="w-20 h-20 text-[#d6b980]" />
            </div>
            <div className="flex items-center gap-2 mb-2 text-[#d6b980] text-xs uppercase tracking-widest font-medium">
                <Clock className="w-3 h-3" /> Каса сьогодні
            </div>
            <div>
                <p className="text-3xl font-serif text-white">
                    ₴{dailyIncome.toLocaleString()}
                </p>
            </div>
            <button 
                onClick={() => onChangeView(AppView.ANALYTICS)}
                className="mt-3 text-xs text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
            >
                Детальніше <ChevronRight className="w-3 h-3" />
            </button>
        </div>

        {/* 2. AI Agent Widget (Takes up more space) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1a2736] to-[#101b2a] p-5 rounded-lg border border-[#d6b980] shadow-[0_0_15px_rgba(214,185,128,0.1)] relative">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#d6b980] flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[#101b2a]" />
                </div>
                <h3 className="text-white font-serif italic">AI Агент</h3>
            </div>

            {!aiResponse ? (
                <form onSubmit={handleAiQuickAsk} className="relative">
                    <input 
                        type="text" 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Запитайте формулу, пораду або ідею..."
                        className="w-full bg-[#0d1623] border border-[#2a3c52] rounded-lg pl-4 pr-12 py-3 text-sm text-white placeholder:text-slate-600 focus:border-[#d6b980] focus:outline-none transition-colors"
                    />
                    <button 
                        type="submit" 
                        disabled={isAiLoading || !aiPrompt}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#d6b980] text-[#101b2a] rounded hover:bg-[#c2a56a] disabled:opacity-50 transition-colors"
                    >
                        {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </form>
            ) : (
                <div className="bg-[#0d1623] rounded-lg p-4 border border-[#2a3c52] animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap mb-3">
                        {aiResponse}
                    </p>
                    <button 
                        onClick={() => { setAiResponse(''); setAiPrompt(''); }}
                        className="text-xs text-[#d6b980] hover:underline uppercase tracking-wider"
                    >
                        Запитати ще
                    </button>
                </div>
            )}
            
            {!aiResponse && !isAiLoading && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {['Формула 9.1', 'Ідея боб-каре', 'Догляд блонд'].map(tag => (
                        <button 
                            key={tag}
                            onClick={() => setAiPrompt(tag)}
                            className="text-[10px] px-2 py-1 rounded bg-[#2a3c52]/50 text-slate-400 hover:bg-[#2a3c52] hover:text-[#d6b980] whitespace-nowrap border border-transparent hover:border-[#d6b980]/30 transition-colors"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Today's Schedule */}
        <section>
             <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-serif text-white">Розклад на Сьогодні</h3>
                <button onClick={() => onChangeView(AppView.CALENDAR)} className="text-[#d6b980] text-xs uppercase hover:underline">Перейти до календаря</button>
            </div>
             <div className="bg-[#1a2736] rounded-lg border border-[#2a3c52] p-4 space-y-3 min-h-[200px]">
                {todayAppointments.length > 0 ? (
                    todayAppointments.map(app => (
                        <div key={app.id} className="flex items-center gap-4 p-3 bg-[#101b2a] rounded border border-[#2a3c52] hover:border-[#d6b980]/30 transition-colors group">
                             <div className={`w-1 h-10 rounded-full ${app.status === 'completed' ? 'bg-green-500' : 'bg-[#d6b980]'}`}></div>
                             <div className="flex flex-col items-center min-w-[50px]">
                                 <span className="text-white font-serif text-base">{app.date.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}</span>
                             </div>
                             <div className="flex-1">
                                 <p className="text-white font-medium text-sm">{app.clientName}</p>
                                 <p className="text-slate-500 text-xs">{app.service}</p>
                             </div>
                             <div>
                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                     app.status === 'completed' ? 'border-green-500/30 text-green-400 bg-green-900/20' : 'border-[#2a3c52] text-slate-400'
                                 }`}>
                                     {app.status === 'completed' ? 'Ок' : '...'}
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