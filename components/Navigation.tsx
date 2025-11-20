
import React from 'react';
import { Calendar, Users, Sparkles, LayoutDashboard, LogOut, Settings, BarChart3, Scissors } from 'lucide-react';
import { AppView, User } from '../types';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  user: User;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, user, onLogout }) => {
  const navItems = [
    { id: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Головна' },
    { id: AppView.CALENDAR, icon: Calendar, label: 'Календар' },
    { id: AppView.SERVICES, icon: Scissors, label: 'Послуги' },
    { id: AppView.AI_STYLIST, icon: Sparkles, label: 'AI Стиліст' },
    { id: AppView.CLIENTS, icon: Users, label: 'Клієнти' },
    { id: AppView.ANALYTICS, icon: BarChart3, label: 'Аналітика' },
    { id: AppView.SETTINGS, icon: Settings, label: 'Налаштування' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-[#0d1623] border-r border-[#1e2d3d] text-white h-screen fixed left-0 top-0 p-6 z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          {/* Small BF Logo for Sidebar */}
          <div className="w-10 h-10 rounded-full border-2 border-[#d6b980] flex items-center justify-center bg-[#101b2a] shrink-0 shadow-[0_0_10px_rgba(214,185,128,0.1)]">
             <span className="text-lg font-serif text-[#d6b980] tracking-tighter italic font-bold ml-[-1px]">BF</span>
          </div>
          <h1 className="text-lg font-bold tracking-widest font-serif text-[#d6b980] uppercase whitespace-nowrap">Beauty Friendly</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-300 group ${
                currentView === item.id
                  ? 'bg-[#1a2736] text-[#d6b980] border-l-2 border-[#d6b980]'
                  : 'text-slate-400 hover:bg-[#1a2736]/50 hover:text-[#d6b980]'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${currentView === item.id ? 'text-[#d6b980]' : 'group-hover:text-[#d6b980]'}`} />
              <span className={`font-medium text-sm tracking-wide ${currentView === item.id ? 'font-semibold' : ''}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#1e2d3d]">
          <div className="flex items-center gap-3 px-2 mb-6">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-[#d6b980]/30" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1a2736] border border-[#d6b980]/30 flex items-center justify-center font-serif font-bold text-[#d6b980]">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-[#f1f5f9] truncate font-serif">{user.name}</p>
              <p className="text-[10px] text-[#d6b980] uppercase tracking-wider truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Вийти
          </button>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0d1623] border-t border-[#1e2d3d] px-6 py-3 flex justify-between items-center z-50 safe-area-pb">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center gap-1.5 ${
              currentView === item.id ? 'text-[#d6b980]' : 'text-slate-500'
            }`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
         <button
            onClick={() => onViewChange(AppView.SETTINGS)}
            className={`flex flex-col items-center gap-1.5 ${
              currentView === AppView.SETTINGS ? 'text-[#d6b980]' : 'text-slate-500'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
      </div>
    </>
  );
};
