
import React, { useState } from 'react';
import { User, Bell, Shield, CreditCard, ChevronRight, Moon, LogOut, Save, Check, Calendar, Clock, Scissors } from 'lucide-react';
import { User as UserType, WorkSchedule, CalendarDailyView } from '../types';

interface SettingsProps {
    user: UserType;
    onUpdateUser: (updatedUser: Partial<UserType>) => void;
    onLogout: () => void;
    workSchedule: WorkSchedule;
    onUpdateSchedule: (schedule: WorkSchedule) => void;
    calendarDailyView: CalendarDailyView;
    onUpdateCalendarView: (view: CalendarDailyView) => void;
    onNavigateToServices: () => void; // New prop
}

const DAYS_OF_WEEK = [
  'Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'
];

export const Settings: React.FC<SettingsProps> = ({ 
    user, onUpdateUser, onLogout, 
    workSchedule, onUpdateSchedule,
    calendarDailyView, onUpdateCalendarView,
    onNavigateToServices
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
        <div className="space-y-8 pb-24 md:pb-8">
            <header className="border-b border-[#1e2d3d] pb-6">
                <h2 className="text-2xl font-serif text-white mb-2">Налаштування</h2>
                <p className="text-slate-400 font-light">Керування профілем та додатком.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings Column */}
                <div className="lg:col-span-2 space-y-6">
                    
                     {/* Services Management Quick Link (Requested feature) */}
                     <section className="bg-[#1a2736] rounded border border-[#2a3c52] p-6 flex items-center justify-between group hover:border-[#d6b980] transition-colors cursor-pointer" onClick={onNavigateToServices}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#101b2a] border border-[#d6b980]/30 flex items-center justify-center">
                                <Scissors className="w-5 h-5 text-[#d6b980]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-serif text-white group-hover:text-[#d6b980] transition-colors">Керування Послугами</h3>
                                <p className="text-xs text-slate-500">Налаштування прайс-листа та категорій послуг</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-[#d6b980]" />
                    </section>

                    {/* Profile Section */}
                    <section className="bg-[#1a2736] rounded border border-[#2a3c52] p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-5 h-5 text-[#d6b980]" />
                            <h3 className="text-lg font-serif text-white">Профіль</h3>
                        </div>
                        
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Ім'я</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#101b2a] border border-[#2a3c52] rounded px-4 py-3 text-white focus:border-[#d6b980] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2">Email</label>
                                <input 
                                    type="text" 
                                    value={user.email}
                                    disabled
                                    className="w-full bg-[#101b2a]/50 border border-[#2a3c52] rounded px-4 py-3 text-slate-500 cursor-not-allowed"
                                />
                            </div>
                            <button 
                                onClick={handleSaveProfile}
                                className="mt-2 bg-[#d6b980] text-[#101b2a] px-6 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#c2a56a] transition-colors flex items-center gap-2"
                            >
                                {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                {isSaved ? 'Збережено' : 'Зберегти зміни'}
                            </button>
                        </div>
                    </section>

                     {/* Work Schedule Section */}
                     <section className="bg-[#1a2736] rounded border border-[#2a3c52] p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="w-5 h-5 text-[#d6b980]" />
                            <h3 className="text-lg font-serif text-white">Графік роботи</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                                {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
                                    const dayConfig = localSchedule[dayIdx];
                                    return (
                                        <div key={dayIdx} className={`flex items-center gap-4 p-3 rounded border transition-colors ${dayConfig.isWorking ? 'bg-[#101b2a] border-[#2a3c52]' : 'bg-[#101b2a]/30 border-[#1e2d3d] opacity-60'}`}>
                                            <div className="flex items-center gap-3 w-32">
                                                <input 
                                                    type="checkbox"
                                                    checked={dayConfig.isWorking}
                                                    onChange={() => toggleDay(dayIdx)}
                                                    className="w-4 h-4 accent-[#d6b980] cursor-pointer rounded border-slate-600 bg-[#1a2736]"
                                                />
                                                <span className={`text-sm font-medium ${dayConfig.isWorking ? 'text-white' : 'text-slate-500'}`}>
                                                    {DAYS_OF_WEEK[dayIdx]}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 flex-1">
                                                <input 
                                                    type="time" 
                                                    value={dayConfig.start}
                                                    onChange={(e) => updateTime(dayIdx, 'start', e.target.value)}
                                                    disabled={!dayConfig.isWorking}
                                                    className="bg-[#1a2736] border border-[#2a3c52] rounded px-2 py-1 text-xs text-white focus:border-[#d6b980] disabled:opacity-30 [color-scheme:dark]"
                                                />
                                                <span className="text-slate-500">-</span>
                                                <input 
                                                    type="time" 
                                                    value={dayConfig.end}
                                                    onChange={(e) => updateTime(dayIdx, 'end', e.target.value)}
                                                    disabled={!dayConfig.isWorking}
                                                    className="bg-[#1a2736] border border-[#2a3c52] rounded px-2 py-1 text-xs text-white focus:border-[#d6b980] disabled:opacity-30 [color-scheme:dark]"
                                                />
                                            </div>
                                            
                                            {!dayConfig.isWorking && (
                                                <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Вихідний</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <button 
                                onClick={handleSaveSchedule}
                                className="mt-4 bg-[#101b2a] border border-[#d6b980] text-[#d6b980] px-6 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#d6b980] hover:text-[#101b2a] transition-colors flex items-center gap-2"
                            >
                                {isScheduleSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                {isScheduleSaved ? 'Графік оновлено' : 'Оновити графік'}
                            </button>
                        </div>
                    </section>

                    {/* Interface Preferences */}
                    <section className="bg-[#1a2736] rounded border border-[#2a3c52] p-6">
                         <div className="flex items-center gap-3 mb-6">
                            <Moon className="w-5 h-5 text-[#d6b980]" />
                            <h3 className="text-lg font-serif text-white">Інтерфейс</h3>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-[#2a3c52]">
                            <div>
                                <p className="text-white font-medium">Тема оформлення</p>
                                <p className="text-xs text-slate-400">Поточна тема: Old Money (Dark)</p>
                            </div>
                            <span className="text-[#d6b980] text-xs border border-[#d6b980] px-2 py-1 rounded">Active</span>
                        </div>
                         <div className="flex items-center justify-between py-3 border-b border-[#2a3c52]">
                            <div>
                                <p className="text-white font-medium">Вигляд Календаря (День)</p>
                                <p className="text-xs text-slate-400">Відображення записів на день</p>
                            </div>
                            <div className="flex bg-[#101b2a] rounded p-1 border border-[#2a3c52]">
                                <button 
                                    onClick={() => onUpdateCalendarView('cards')}
                                    className={`px-3 py-1 text-xs rounded transition-colors ${calendarDailyView === 'cards' ? 'bg-[#d6b980] text-[#101b2a]' : 'text-slate-400'}`}
                                >
                                    Cards
                                </button>
                                <button 
                                    onClick={() => onUpdateCalendarView('timeline')}
                                    className={`px-3 py-1 text-xs rounded transition-colors ${calendarDailyView === 'timeline' ? 'bg-[#d6b980] text-[#101b2a]' : 'text-slate-400'}`}
                                >
                                    Timeline
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar / Status Column */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#d6b980] to-[#b09b6a] rounded p-6 text-[#101b2a]">
                        <div className="flex items-center justify-between mb-4">
                            <CrownIcon className="w-8 h-8" />
                            <span className="text-xs font-bold uppercase bg-[#101b2a]/10 px-2 py-1 rounded">Active</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold mb-1">{user.subscriptionPlan === 'pro' ? 'Gold Club' : user.subscriptionPlan === 'premium' ? 'Platinum' : 'Start'}</h3>
                        <p className="text-sm opacity-80 mb-6">Ваш тарифний план активний.</p>
                        <button className="w-full bg-[#101b2a] text-[#d6b980] py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#1a2736]">
                            Керувати підпискою
                        </button>
                    </div>

                    <div className="bg-[#1a2736] rounded border border-[#2a3c52] p-4 space-y-2">
                         <button className="w-full flex items-center justify-between p-3 hover:bg-[#2a3c52] rounded group transition-colors">
                            <div className="flex items-center gap-3">
                                <Bell className="w-4 h-4 text-slate-400 group-hover:text-[#d6b980]" />
                                <span className="text-slate-300 text-sm group-hover:text-white">Сповіщення</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                         <button className="w-full flex items-center justify-between p-3 hover:bg-[#2a3c52] rounded group transition-colors">
                            <div className="flex items-center gap-3">
                                <Shield className="w-4 h-4 text-slate-400 group-hover:text-[#d6b980]" />
                                <span className="text-slate-300 text-sm group-hover:text-white">Безпека</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                         <button className="w-full flex items-center justify-between p-3 hover:bg-[#2a3c52] rounded group transition-colors">
                            <div className="flex items-center gap-3">
                                <CreditCard className="w-4 h-4 text-slate-400 group-hover:text-[#d6b980]" />
                                <span className="text-slate-300 text-sm group-hover:text-white">Платежі</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>

                     <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 p-4 text-red-400 hover:bg-red-400/10 rounded border border-red-400/20 transition-colors text-sm"
                     >
                        <LogOut className="w-4 h-4" />
                        Вийти з акаунту
                     </button>
                </div>
            </div>
        </div>
    );
};

// Simple icon component for this file
const CrownIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
);
