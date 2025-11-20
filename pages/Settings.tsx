import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, ChevronRight, Moon, LogOut, Save, Check, Calendar, Clock, Scissors, Layout, Sun } from 'lucide-react';
import { User as UserType, WorkSchedule, CalendarDailyView, AppTheme } from '../types';

interface SettingsProps {
    user: UserType;
    onUpdateUser: (updatedUser: Partial<UserType>) => void;
    onLogout: () => void;
    workSchedule: WorkSchedule;
    onUpdateSchedule: (schedule: WorkSchedule) => void;
    calendarDailyView: CalendarDailyView;
    onUpdateCalendarView: (view: CalendarDailyView) => void;
    onNavigateToServices: () => void;
    theme: AppTheme;
    onUpdateTheme: (theme: AppTheme) => void;
}

const DAYS_OF_WEEK = [
  'Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'
];

export const Settings: React.FC<SettingsProps> = ({ 
    user, onUpdateUser, onLogout, 
    workSchedule, onUpdateSchedule,
    calendarDailyView, onUpdateCalendarView,
    onNavigateToServices,
    theme, onUpdateTheme
}) => {
    const [name, setName] = useState(user.name);
    const [isSaved, setIsSaved] = useState(false);
    const [localSchedule, setLocalSchedule] = useState<WorkSchedule>(workSchedule);
    const [isScheduleSaved, setIsScheduleSaved] = useState(false);

    const handleSaveProfile = () => {
        onUpdateUser({ name });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleSaveSchedule = () => {
        onUpdateSchedule(localSchedule);
        setIsScheduleSaved(true);
        setTimeout(() => setIsScheduleSaved(false), 2000);
    };

    const toggleDay = (dayIndex: number) => {
        setLocalSchedule(prev => ({
            ...prev,
            [dayIndex]: {
                ...prev[dayIndex],
                isWorking: !prev[dayIndex].isWorking
            }
        }));
    };

    const updateTime = (dayIndex: number, field: 'start' | 'end', value: string) => {
        setLocalSchedule(prev => ({
            ...prev,
            [dayIndex]: {
                ...prev[dayIndex],
                [field]: value
            }
        }));
    };

    return (
        <div className="space-y-8 pb-24 md:pb-8 animate-in fade-in duration-500">
            <header className="border-b border-border pb-6">
                <h2 className="text-3xl font-serif text-main mb-2">Налаштування</h2>
                <p className="text-muted font-light">Персоналізація та управління акаунтом.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings Column */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Theme Selection - Visual Cards */}
                    <section className="bg-surface rounded-xl border border-border p-6 shadow-sm">
                         <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary rounded-lg text-accent">
                                <Layout className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-serif text-main font-medium">Оформлення</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {/* Dark Theme Card */}
                            <button onClick={() => onUpdateTheme('dark')} className={`group relative flex flex-col gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${theme === 'dark' ? 'border-accent bg-surface-soft shadow-lg scale-[1.02]' : 'border-transparent hover:bg-surface-soft hover:border-border'}`}>
                                <div className="w-full aspect-video rounded-lg bg-[#101B2A] border border-[#2a3c52] relative overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
                                     <div className="absolute top-3 left-3 w-8 h-2 bg-[#2a3c52] rounded-full"></div>
                                     <div className="absolute top-8 left-3 right-3 h-12 bg-[#1a2736] rounded border border-[#2a3c52]"></div>
                                     <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#D6B980] rounded-tl-xl"></div>
                                </div>
                                <div className="text-center">
                                    <span className={`text-sm font-medium block ${theme === 'dark' ? 'text-accent' : 'text-main'}`}>Old Money</span>
                                    <span className="text-[10px] text-muted uppercase tracking-wider">Dark</span>
                                </div>
                            </button>

                            {/* Light Theme Card */}
                            <button onClick={() => onUpdateTheme('light')} className={`group relative flex flex-col gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${theme === 'light' ? 'border-accent bg-surface-soft shadow-lg scale-[1.02]' : 'border-transparent hover:bg-surface-soft hover:border-border'}`}>
                                <div className="w-full aspect-video rounded-lg bg-[#F9F5EC] border border-[#E5E7EB] relative overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
                                     <div className="absolute top-3 left-3 w-8 h-2 bg-[#E5E7EB] rounded-full"></div>
                                     <div className="absolute top-8 left-3 right-3 h-12 bg-[#FFFFFF] rounded border border-[#E5E7EB]"></div>
                                     <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#B59A60] rounded-tl-xl"></div>
                                </div>
                                <div className="text-center">
                                    <span className={`text-sm font-medium block ${theme === 'light' ? 'text-accent' : 'text-main'}`}>Gallery</span>
                                    <span className="text-[10px] text-muted uppercase tracking-wider">Light</span>
                                </div>
                            </button>

                             {/* Neutral Theme Card */}
                             <button onClick={() => onUpdateTheme('neutral')} className={`group relative flex flex-col gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${theme === 'neutral' ? 'border-accent bg-surface-soft shadow-lg scale-[1.02]' : 'border-transparent hover:bg-surface-soft hover:border-border'}`}>
                                <div className="w-full aspect-video rounded-lg bg-[#0F172A] border border-[#334155] relative overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
                                     <div className="absolute top-3 left-3 w-8 h-2 bg-[#334155] rounded-full"></div>
                                     <div className="absolute top-8 left-3 right-3 h-12 bg-[#1E293B] rounded border border-[#334155]"></div>
                                     <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#94A3B8] rounded-tl-xl"></div>
                                </div>
                                <div className="text-center">
                                    <span className={`text-sm font-medium block ${theme === 'neutral' ? 'text-accent' : 'text-main'}`}>Studio</span>
                                    <span className="text-[10px] text-muted uppercase tracking-wider">Neutral</span>
                                </div>
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div>
                                <p className="text-main font-medium text-sm">Вигляд Календаря</p>
                                <p className="text-xs text-muted">Стиль відображення дня</p>
                            </div>
                            <div className="flex bg-primary rounded-lg p-1 border border-border">
                                <button 
                                    onClick={() => onUpdateCalendarView('cards')}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${calendarDailyView === 'cards' ? 'bg-accent text-primary shadow-sm' : 'text-muted hover:text-main'}`}
                                >
                                    Cards
                                </button>
                                <button 
                                    onClick={() => onUpdateCalendarView('timeline')}
                                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${calendarDailyView === 'timeline' ? 'bg-accent text-primary shadow-sm' : 'text-muted hover:text-main'}`}
                                >
                                    Timeline
                                </button>
                            </div>
                        </div>
                    </section>
                    
                     {/* Services Management Quick Link */}
                     <section className="bg-surface rounded-xl border border-border p-6 flex items-center justify-between group hover:border-accent transition-all cursor-pointer shadow-sm hover:shadow-md btn-premium" onClick={onNavigateToServices}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary border border-accent/30 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-colors">
                                <Scissors className="w-6 h-6 text-accent group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif text-main group-hover:text-accent transition-colors font-medium">Керування Послугами</h3>
                                <p className="text-sm text-muted">Налаштування прайс-листа та категорій</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted group-hover:text-accent transition-transform group-hover:translate-x-1" />
                    </section>

                    {/* Profile Section */}
                    <section className="bg-surface rounded-xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary rounded-lg text-accent"><User className="w-5 h-5" /></div>
                            <h3 className="text-lg font-serif text-main font-medium">Профіль Майстра</h3>
                        </div>
                        
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-semibold">Ім'я</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-premium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-semibold">Email</label>
                                <input 
                                    type="text" 
                                    value={user.email}
                                    disabled
                                    className="input-premium opacity-60 cursor-not-allowed"
                                />
                            </div>
                            <button 
                                onClick={handleSaveProfile}
                                className="mt-4 bg-accent text-primary px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-lg shadow-accent/20 btn-premium"
                            >
                                {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                {isSaved ? 'Збережено' : 'Зберегти зміни'}
                            </button>
                        </div>
                    </section>

                     {/* Work Schedule Section */}
                     <section className="bg-surface rounded-xl border border-border p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary rounded-lg text-accent"><Clock className="w-5 h-5" /></div>
                            <h3 className="text-lg font-serif text-main font-medium">Графік роботи</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-2">
                                {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
                                    const dayConfig = localSchedule[dayIdx];
                                    return (
                                        <div key={dayIdx} className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${dayConfig.isWorking ? 'bg-primary border-border' : 'bg-surface-soft border-transparent opacity-50'}`}>
                                            <div className="flex items-center gap-3 w-32">
                                                <input 
                                                    type="checkbox"
                                                    checked={dayConfig.isWorking}
                                                    onChange={() => toggleDay(dayIdx)}
                                                    className="w-4 h-4 accent-accent cursor-pointer rounded border-border bg-surface"
                                                />
                                                <span className={`text-sm font-medium ${dayConfig.isWorking ? 'text-main' : 'text-muted'}`}>
                                                    {DAYS_OF_WEEK[dayIdx]}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 flex-1">
                                                <input 
                                                    type="time" 
                                                    value={dayConfig.start}
                                                    onChange={(e) => updateTime(dayIdx, 'start', e.target.value)}
                                                    disabled={!dayConfig.isWorking}
                                                    className="bg-surface border border-border rounded px-2 py-1 text-xs text-main focus:border-accent disabled:opacity-30 focus:outline-none [color-scheme:dark]"
                                                />
                                                <span className="text-muted text-xs">-</span>
                                                <input 
                                                    type="time" 
                                                    value={dayConfig.end}
                                                    onChange={(e) => updateTime(dayIdx, 'end', e.target.value)}
                                                    disabled={!dayConfig.isWorking}
                                                    className="bg-surface border border-border rounded px-2 py-1 text-xs text-main focus:border-accent disabled:opacity-30 focus:outline-none [color-scheme:dark]"
                                                />
                                            </div>
                                            
                                            {!dayConfig.isWorking && (
                                                <span className="text-[10px] text-muted uppercase tracking-wider font-bold">Вихідний</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <button 
                                onClick={handleSaveSchedule}
                                className="mt-4 w-full bg-primary border border-accent text-accent px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-accent hover:text-primary transition-colors flex items-center justify-center gap-2 btn-premium"
                            >
                                {isScheduleSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                {isScheduleSaved ? 'Графік оновлено' : 'Оновити графік'}
                            </button>
                        </div>
                    </section>
                </div>

                {/* Sidebar / Status Column */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-accent to-accent-hover rounded-xl p-8 text-primary shadow-xl shadow-accent/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><CrownIcon className="w-32 h-32" /></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <CrownIcon className="w-8 h-8" />
                                <span className="text-[10px] font-bold uppercase bg-primary/20 px-3 py-1 rounded-full backdrop-blur-sm">Active</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold mb-1">{user.subscriptionPlan === 'pro' ? 'Gold Club' : user.subscriptionPlan === 'premium' ? 'Platinum' : 'Start'}</h3>
                            <p className="text-sm opacity-80 mb-8">Ваш тарифний план активний.</p>
                            <button className="w-full bg-primary text-accent py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-surface shadow-lg btn-premium">
                                Керувати підпискою
                            </button>
                        </div>
                    </div>

                    <div className="bg-surface rounded-xl border border-border p-4 space-y-2 shadow-sm">
                         {['Сповіщення', 'Безпека', 'Платежі'].map((item) => (
                             <button key={item} className="w-full flex items-center justify-between p-4 hover:bg-surface-soft rounded-lg group transition-colors">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                                    <span className="text-main text-sm font-medium">{item}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                            </button>
                         ))}
                    </div>

                     <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 p-4 text-danger hover:bg-danger/5 rounded-xl border border-danger/20 transition-colors text-sm font-medium btn-premium"
                     >
                        <LogOut className="w-4 h-4" />
                        Вийти з акаунту
                     </button>
                </div>
            </div>
        </div>
    );
};

const CrownIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
);