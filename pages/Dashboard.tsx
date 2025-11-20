
import React, { useState } from 'react';
import { Clock, Calendar as CalendarIcon, DollarSign, Sparkles, Send, Loader2, ChevronRight, User, CheckCircle, Wallet, CreditCard, X, Edit2, Phone, Calendar } from 'lucide-react';
import { Appointment, AppView, Transaction, User as UserType, PaymentMethod, Client } from '../types';
import { generateStylingAdvice } from '../services/geminiService';

interface DashboardProps {
  onChangeView: (view: AppView) => void;
  appointments: Appointment[];
  transactions: Transaction[];
  user: UserType;
  clients: Client[];
  onCloseAppointment: (id: string, method: PaymentMethod, finalPrice: number) => void;
  onRescheduleAppointment: (id: string, newDate: Date, duration: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
    onChangeView, appointments, transactions, user, clients,
    onCloseAppointment, onRescheduleAppointment
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Action Modals State
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [modalType, setModalType] = useState<'none' | 'checkout' | 'reschedule' | 'client'>('none');
  
  // Checkout State
  const [checkoutPrice, setCheckoutPrice] = useState('');
  
  // Reschedule State
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleDuration, setRescheduleDuration] = useState('');

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

  // Modal Handlers
  const openCheckout = (app: Appointment) => {
      setSelectedApp(app);
      setCheckoutPrice(app.price.toString());
      setModalType('checkout');
  };

  const openReschedule = (app: Appointment) => {
      setSelectedApp(app);
      setRescheduleDate(app.date.toISOString().split('T')[0]);
      setRescheduleTime(app.date.toTimeString().slice(0, 5));
      setRescheduleDuration(app.durationMinutes.toString());
      setModalType('reschedule');
  };

  const openClientProfile = (app: Appointment) => {
      setSelectedApp(app);
      setModalType('client');
  };

  const handleCheckoutSubmit = (method: PaymentMethod) => {
      if (selectedApp && checkoutPrice) {
          onCloseAppointment(selectedApp.id, method, parseFloat(checkoutPrice));
          setModalType('none');
          setSelectedApp(null);
      }
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedApp && rescheduleDate && rescheduleTime) {
          const newDate = new Date(`${rescheduleDate}T${rescheduleTime}`);
          onRescheduleAppointment(selectedApp.id, newDate, parseInt(rescheduleDuration));
          setModalType('none');
          setSelectedApp(null);
      }
  };

  // Helper to find client data
  const getClientData = (app: Appointment) => {
      return clients.find(c => c.id === app.clientId);
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
                        <div key={app.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-3 bg-[#101b2a] rounded border border-[#2a3c52] hover:border-[#d6b980]/30 transition-colors group">
                             <div className="flex items-center gap-4 w-full md:w-auto flex-1">
                                <div className={`w-1 h-10 rounded-full ${app.status === 'completed' ? 'bg-green-500' : 'bg-[#d6b980]'}`}></div>
                                <div className="flex flex-col items-center min-w-[50px]">
                                    <span className="text-white font-serif text-base">{app.date.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-medium text-sm">{app.clientName}</p>
                                    <p className="text-slate-500 text-xs">{app.service}</p>
                                </div>
                             </div>
                             
                             {/* Action Buttons */}
                             <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-[#2a3c52] pt-2 md:pt-0">
                                {app.status === 'scheduled' ? (
                                    <>
                                        <button 
                                            onClick={() => openClientProfile(app)}
                                            className="p-2 bg-[#2a3c52] rounded text-slate-300 hover:text-[#d6b980] transition-colors"
                                            title="Картка клієнта"
                                        >
                                            <User className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => openReschedule(app)}
                                            className="p-2 bg-[#2a3c52] rounded text-slate-300 hover:text-white transition-colors"
                                            title="Перенести"
                                        >
                                            <Clock className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => openCheckout(app)}
                                            className="p-2 bg-[#d6b980] text-[#101b2a] rounded font-bold flex items-center gap-2 hover:bg-[#c2a56a] transition-colors text-xs uppercase tracking-wider px-4"
                                        >
                                            <CheckCircle className="w-4 h-4" /> <span>Оплата</span>
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-xs text-green-500 font-bold uppercase tracking-wider flex items-center gap-1 px-3 py-1 bg-green-900/20 rounded border border-green-900/50">
                                        <CheckCircle className="w-3 h-3" /> Оплачено
                                    </span>
                                )}
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

      {/* --- MODALS --- */}

      {/* 1. Checkout Modal */}
      {modalType === 'checkout' && selectedApp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0d1623]/90 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#1a2736] w-full max-w-sm rounded-lg border border-[#d6b980] shadow-2xl p-6 relative">
                 <button onClick={() => setModalType('none')} className="absolute right-4 top-4 text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
                 <div className="text-center mb-6">
                     <div className="w-16 h-16 rounded-full bg-[#d6b980]/10 flex items-center justify-center mx-auto mb-4 border border-[#d6b980]">
                         <CheckCircle className="w-8 h-8 text-[#d6b980]" />
                     </div>
                     <h3 className="text-xl font-serif text-white mb-1">Завершення візиту</h3>
                     <p className="text-slate-400 text-sm">{selectedApp.clientName}</p>
                 </div>

                 <div className="bg-[#101b2a] p-4 rounded border border-[#2a3c52] mb-6 text-center relative group">
                     <div className="absolute right-2 top-2 text-slate-500"><Edit2 className="w-3 h-3" /></div>
                     <span className="text-xs uppercase tracking-widest text-slate-500 block mb-1">До сплати (₴)</span>
                     <input 
                        type="number"
                        value={checkoutPrice}
                        onChange={(e) => setCheckoutPrice(e.target.value)}
                        className="w-full bg-transparent text-3xl font-serif text-white text-center focus:outline-none border-b border-[#d6b980]/30 focus:border-[#d6b980] pb-1 transition-colors"
                     />
                 </div>

                 <div className="space-y-3">
                     <button onClick={() => handleCheckoutSubmit('cash')} className="w-full py-3 border border-[#2a3c52] hover:border-[#d6b980] hover:bg-[#101b2a] rounded flex items-center justify-center gap-3 text-white transition-all"><Wallet className="w-5 h-5 text-slate-400" /> Готівка</button>
                     <button onClick={() => handleCheckoutSubmit('card')} className="w-full py-3 border border-[#2a3c52] hover:border-[#d6b980] hover:bg-[#101b2a] rounded flex items-center justify-center gap-3 text-white transition-all"><CreditCard className="w-5 h-5 text-slate-400" /> Картка</button>
                 </div>
            </div>
        </div>
      )}

      {/* 2. Reschedule Modal */}
      {modalType === 'reschedule' && selectedApp && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0d1623]/90 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[#1a2736] w-full max-w-md rounded-lg border border-[#d6b980] shadow-2xl p-6 relative">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-serif text-white">Перенесення візиту</h3><button onClick={() => setModalType('none')} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></div>
                <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                    <p className="text-sm text-slate-300 bg-[#101b2a] p-3 rounded border border-[#2a3c52]">Клієнт: <span className="text-white font-medium">{selectedApp.clientName}</span></p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Нова Дата</label><input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none [color-scheme:dark]" /></div>
                        <div className="space-y-2"><label className="text-xs font-medium text-[#d6b980] uppercase tracking-wide">Новий Час</label><input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none [color-scheme:dark]" /></div>
                    </div>
                    <button type="submit" className="w-full bg-[#d6b980] text-[#101b2a] py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-[#c2a56a] mt-2">Зберегти зміни</button>
                </form>
              </div>
          </div>
      )}

      {/* 3. Client Info Modal */}
      {modalType === 'client' && selectedApp && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0d1623]/90 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[#1a2736] w-full max-w-sm rounded-lg border border-[#d6b980] shadow-2xl p-6 relative">
                 <button onClick={() => setModalType('none')} className="absolute right-4 top-4 text-slate-500 hover:text-white"><X className="w-5 h-5"/></button>
                 <div className="text-center mb-6">
                     <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-[#d6b980] mb-3">
                         {/* Mock avatar based on name if client not found, purely visual */}
                         <img src={`https://ui-avatars.com/api/?name=${selectedApp.clientName}&background=d6b980&color=101b2a`} alt="Client" className="w-full h-full object-cover" />
                     </div>
                     <h3 className="text-xl font-serif text-white">{selectedApp.clientName}</h3>
                     <p className="text-slate-400 text-sm">{getClientData(selectedApp)?.phone || 'Телефон не вказано'}</p>
                 </div>
                 
                 <div className="bg-[#101b2a] p-4 rounded border border-[#2a3c52] mb-4">
                     <div className="flex items-center gap-2 text-[#d6b980] text-xs uppercase font-bold mb-2">
                         <Calendar className="w-3 h-3" /> Останній візит
                     </div>
                     <p className="text-white text-sm">{getClientData(selectedApp)?.lastVisit || 'Інформація відсутня'}</p>
                 </div>

                 <div className="bg-[#101b2a] p-4 rounded border border-[#2a3c52]">
                     <span className="text-[#d6b980] text-xs uppercase font-bold block mb-2">Нотатки</span>
                     <p className="text-slate-300 text-sm italic">
                         {getClientData(selectedApp)?.notes || "Немає нотаток."}
                     </p>
                 </div>

                 <div className="mt-6 flex gap-2">
                     <a href={`tel:${getClientData(selectedApp)?.phone}`} className="flex-1 bg-[#2a3c52] text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-[#354a61] transition-colors">
                         <Phone className="w-4 h-4" /> Подзвонити
                     </a>
                 </div>
              </div>
          </div>
      )}
    </div>
  );
};
