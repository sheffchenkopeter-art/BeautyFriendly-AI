import React, { useState } from 'react';
import { Clock, Calendar as CalendarIcon, DollarSign, Send, Loader2, ChevronRight, User, CheckCircle, Wallet, CreditCard, X, Edit2, Phone, Calendar } from 'lucide-react';
import { Appointment, AppView, Transaction, User as UserType, PaymentMethod, Client } from '../types';
import { generateStylingAdvice } from '../services/geminiService';
import { AIAvatar } from '../components/AIAvatar';

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
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [modalType, setModalType] = useState<'none' | 'checkout' | 'reschedule' | 'client'>('none');
  const [checkoutPrice, setCheckoutPrice] = useState('');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleDuration, setRescheduleDuration] = useState('');

  const today = new Date();
  const todayAppointments = appointments.filter(app => 
    app.date.getDate() === today.getDate() && 
    app.date.getMonth() === today.getMonth() &&
    app.date.getFullYear() === today.getFullYear()
  );

  const dailyIncome = transactions
    .filter(t => t.type === 'income' && t.date.getDate() === today.getDate() && t.date.getMonth() === today.getMonth() && t.date.getFullYear() === today.getFullYear())
    .reduce((acc, t) => acc + t.amount, 0);

  const handleAiQuickAsk = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!aiPrompt.trim()) return;
      setIsAiLoading(true);
      setAiResponse(''); 
      try {
          const response = await generateStylingAdvice(aiPrompt);
          setAiResponse(response);
      } catch (err) {
          setAiResponse("Вибачте, зараз я не можу відповісти. Спробуйте пізніше.");
      } finally {
          setIsAiLoading(false);
      }
  };

  const openCheckout = (app: Appointment) => { setSelectedApp(app); setCheckoutPrice(app.price.toString()); setModalType('checkout'); };
  const openReschedule = (app: Appointment) => { setSelectedApp(app); setRescheduleDate(app.date.toISOString().split('T')[0]); setRescheduleTime(app.date.toTimeString().slice(0, 5)); setRescheduleDuration(app.durationMinutes.toString()); setModalType('reschedule'); };
  const openClientProfile = (app: Appointment) => { setSelectedApp(app); setModalType('client'); };
  const handleCheckoutSubmit = (method: PaymentMethod) => { if (selectedApp && checkoutPrice) { onCloseAppointment(selectedApp.id, method, parseFloat(checkoutPrice)); setModalType('none'); setSelectedApp(null); } };
  const handleRescheduleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (selectedApp && rescheduleDate && rescheduleTime) { const newDate = new Date(`${rescheduleDate}T${rescheduleTime}`); onRescheduleAppointment(selectedApp.id, newDate, parseInt(rescheduleDuration)); setModalType('none'); setSelectedApp(null); } };
  const getClientData = (app: Appointment) => { return clients.find(c => c.id === app.clientId); };

  return (
    <div className="space-y-8 pb-32 md:pb-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-4xl font-serif text-main mb-2 tracking-tight">Вітаємо, {user.name.split(' ')[0]}</h2>
            <p className="text-muted font-light text-sm tracking-wide">
                {today.toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Premium Income Card */}
        <div className="glass p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between h-full card-hover group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors"></div>
            
            <div className="flex items-center gap-3 mb-4 text-accent text-xs uppercase tracking-[0.2em] font-bold z-10">
                <div className="p-1.5 bg-accent/10 rounded-md"><DollarSign className="w-4 h-4" /></div>
                Каса
            </div>
            <div className="z-10">
                <p className="text-5xl font-serif text-main font-medium tracking-tight">
                    <span className="text-2xl align-top opacity-50 mr-1">₴</span>{dailyIncome.toLocaleString()}
                </p>
            </div>
            <button onClick={() => onChangeView(AppView.ANALYTICS)} className="mt-6 text-xs text-muted hover:text-accent flex items-center gap-2 transition-colors z-10 uppercase tracking-widest font-bold group-hover:translate-x-1 duration-300">
                Детальніше <ChevronRight className="w-3 h-3" />
            </button>
        </div>

        {/* AI Agent Widget - Glassmorphism */}
        <div className="lg:col-span-2 glass p-8 rounded-2xl relative transition-colors duration-300 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-1 rounded-full border border-accent/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                    <AIAvatar className="w-12 h-12" />
                </div>
                <div>
                    <h3 className="text-main font-serif text-xl italic">AI Stylist</h3>
                    <p className="text-[10px] text-accent uppercase tracking-[0.25em] font-bold mt-1">Beauty Intelligence</p>
                </div>
            </div>

            {!aiResponse ? (
                <div className="flex-1 flex flex-col justify-center">
                    <form onSubmit={handleAiQuickAsk} className="relative mb-6 group">
                        <input 
                            type="text" 
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Запитайте про формулу, догляд або тренд..."
                            className="w-full bg-surface-soft/50 border-b border-border py-4 pl-4 pr-14 text-main focus:border-accent focus:bg-surface-soft focus:outline-none transition-all placeholder:text-muted/50 rounded-t-lg"
                        />
                        <button type="submit" disabled={isAiLoading || !aiPrompt} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent hover:text-white hover:bg-accent rounded-full disabled:opacity-30 transition-all">
                            {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </form>
                     <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {['Формула 9.1', 'Ідея боб-каре', 'Догляд блонд'].map(tag => (
                            <button key={tag} onClick={() => setAiPrompt(tag)} className="text-[10px] px-4 py-2 rounded-full border border-border text-muted hover:border-accent hover:text-accent hover:bg-accent/5 whitespace-nowrap transition-all uppercase tracking-wider">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-surface-soft/80 backdrop-blur-md rounded-xl p-6 border border-border animate-in fade-in slide-in-from-bottom-4 relative">
                    <button onClick={() => { setAiResponse(''); setAiPrompt(''); }} className="absolute top-4 right-4 text-muted hover:text-main"><X className="w-4 h-4"/></button>
                    <p className="text-sm text-main leading-7 font-light whitespace-pre-wrap">{aiResponse}</p>
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mt-8">
        <section>
             <div className="flex justify-between items-end mb-6 px-2">
                <h3 className="text-2xl font-serif text-main">Сьогодні</h3>
                <button onClick={() => onChangeView(AppView.CALENDAR)} className="text-accent text-xs uppercase font-bold tracking-widest hover:underline underline-offset-4">Весь розклад</button>
            </div>
             <div className="glass rounded-2xl overflow-hidden min-h-[200px]">
                {todayAppointments.length > 0 ? (
                    <div className="divide-y divide-border/50">
                    {todayAppointments.map(app => (
                        <div key={app.id} className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 hover:bg-surface-soft/40 transition-colors group">
                             <div className="flex items-center gap-6 w-full md:w-auto flex-1">
                                <div className="flex flex-col items-center justify-center min-w-[60px] text-center">
                                    <span className="text-main font-serif text-xl">{app.date.toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}</span>
                                    <div className={`w-1 h-8 mt-2 rounded-full ${app.status === 'completed' ? 'bg-green-500' : 'bg-accent'}`}></div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-main font-medium text-lg">{app.clientName}</p>
                                    <p className="text-muted text-sm font-light mt-1">{app.service}</p>
                                </div>
                             </div>
                             
                             <div className="flex items-center gap-3 w-full md:w-auto justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                                {app.status === 'scheduled' ? (
                                    <>
                                        <button onClick={() => openClientProfile(app)} className="p-2.5 border border-border rounded-lg text-muted hover:text-accent hover:border-accent transition-all"><User className="w-4 h-4" /></button>
                                        <button onClick={() => openReschedule(app)} className="p-2.5 border border-border rounded-lg text-muted hover:text-main hover:border-muted transition-all"><Clock className="w-4 h-4" /></button>
                                        <button onClick={() => openCheckout(app)} className="py-2.5 px-6 bg-accent text-primary rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-accent-hover flex items-center gap-2 transition-all shadow-lg shadow-accent/10"><CheckCircle className="w-4 h-4" /> Оплата</button>
                                    </>
                                ) : (
                                    <span className="text-xs text-green-500 font-bold uppercase tracking-wider flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20"><CheckCircle className="w-4 h-4" /> Оплачено</span>
                                )}
                             </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-muted/50 italic">
                        <CalendarIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p>На сьогодні записів немає.</p>
                    </div>
                )}
             </div>
        </section>
      </div>

      {/* Modals logic included implicitly (same as previous Dashboard.tsx, just styled by global CSS) */}
      {modalType !== 'none' && selectedApp && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-primary/90 backdrop-blur-sm animate-in fade-in">
               {/* Render modal content based on type (Checkout, Reschedule, etc.) - using glass classes */}
               <div className="glass w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
                  <button onClick={() => setModalType('none')} className="absolute right-6 top-6 text-muted hover:text-main"><X className="w-6 h-6"/></button>
                  
                  {modalType === 'checkout' && (
                      <>
                         <div className="text-center mb-8">
                             <h3 className="text-2xl font-serif text-main mb-2">Оплата</h3>
                             <p className="text-muted">{selectedApp.clientName}</p>
                         </div>
                         <div className="mb-8">
                             <label className="text-xs text-accent uppercase tracking-widest block mb-2 text-center">Сума (₴)</label>
                             <input type="number" value={checkoutPrice} onChange={(e) => setCheckoutPrice(e.target.value)} className="w-full bg-transparent text-5xl font-serif text-main text-center focus:outline-none border-b border-accent/30 pb-2" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <button onClick={() => handleCheckoutSubmit('cash')} className="py-4 border border-border hover:border-accent hover:bg-surface-soft rounded-xl flex flex-col items-center gap-2 text-main transition-all"><Wallet className="w-6 h-6 text-muted" /><span className="text-xs uppercase tracking-wider">Готівка</span></button>
                             <button onClick={() => handleCheckoutSubmit('card')} className="py-4 border border-border hover:border-accent hover:bg-surface-soft rounded-xl flex flex-col items-center gap-2 text-main transition-all"><CreditCard className="w-6 h-6 text-muted" /><span className="text-xs uppercase tracking-wider">Картка</span></button>
                         </div>
                      </>
                  )}
                  
                  {/* Similar styling for other modals... */}
                  {modalType === 'client' && (
                     <>
                        <div className="text-center mb-8">
                             <div className="w-24 h-24 mx-auto rounded-full border-2 border-accent p-1 mb-4">
                                 <img src={`https://ui-avatars.com/api/?name=${selectedApp.clientName}&background=d6b980&color=101b2a`} alt="Client" className="w-full h-full rounded-full object-cover" />
                             </div>
                             <h3 className="text-2xl font-serif text-main">{selectedApp.clientName}</h3>
                             <p className="text-muted text-sm mt-1">{getClientData(selectedApp)?.phone}</p>
                         </div>
                         <div className="space-y-4">
                             <div className="bg-surface-soft p-4 rounded-xl border border-border flex justify-between items-center">
                                 <span className="text-xs text-accent uppercase tracking-widest font-bold">Останній візит</span>
                                 <span className="text-main font-medium">{getClientData(selectedApp)?.lastVisit || '-'}</span>
                             </div>
                             <a href={`tel:${getClientData(selectedApp)?.phone}`} className="btn-primary w-full py-4 flex items-center justify-center gap-2 rounded-xl"><Phone className="w-4 h-4" /> Подзвонити</a>
                         </div>
                     </>
                  )}

                   {modalType === 'reschedule' && (
                     <>
                        <h3 className="text-2xl font-serif text-main mb-6 text-center">Перенесення</h3>
                        <form onSubmit={handleRescheduleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] uppercase tracking-widest text-muted mb-2 block">Дата</label><input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} className="input-premium bg-surface-soft rounded-lg border-none px-4" /></div>
                                <div><label className="text-[10px] uppercase tracking-widest text-muted mb-2 block">Час</label><input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="input-premium bg-surface-soft rounded-lg border-none px-4" /></div>
                            </div>
                            <button type="submit" className="btn-primary w-full py-4 rounded-xl text-xs">Зберегти</button>
                        </form>
                     </>
                  )}
               </div>
          </div>
      )}
    </div>
  );
};