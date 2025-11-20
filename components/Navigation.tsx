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

  const mobileNavItems = [
    navItems[0], // Dashboard
    navItems[1], // Calendar
    navItems[3], // AI Stylist
    navItems[5], // Analytics
    navItems[4], // Clients
  ];

  return (
    <>
      {/* Desktop Sidebar - Sleek & Minimal */}
      <div className="hidden md:flex flex-col w-72 glass border-r-0 fixed left-0 top-0 p-8 z-50 h-screen">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent to-[#F3E5AB] flex items-center justify-center shadow-lg shadow-accent/20">
             <span className="text-xl font-serif text-[#0B1120] font-bold italic ml-[-1px]">BF</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-widest font-serif text-main uppercase leading-none">Beauty</h1>
            <span className="text-xs text-accent tracking-[0.3em] uppercase">Friendly</span>
          </div>
        </div>
        
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                currentView === item.id
                  ? 'text-primary font-bold'
                  : 'text-muted hover:text-main'
              }`}
            >
              {currentView === item.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-[#F3E5AB] opacity-100 rounded-xl -z-10"></div>
              )}
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${currentView === item.id ? 'text-primary' : 'group-hover:text-accent'}`} />
              <span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-border/30">
          <div className="flex items-center gap-3 mb-6 bg-surface/50 p-3 rounded-xl border border-white/5">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-accent/50 object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-surface border border-accent/30 flex items-center justify-center font-serif font-bold text-accent">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-main truncate font-serif">{user.name}</p>
              <p className="text-[10px] text-accent uppercase tracking-wider truncate opacity-80">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-muted hover:text-red-400 rounded-lg transition-colors text-xs uppercase tracking-widest hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Вийти
          </button>
        </div>
      </div>

      {/* Mobile Floating Dock - The "Expensive" Touch */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="glass rounded-2xl px-2 py-3 flex justify-between items-center shadow-2xl shadow-black/50">
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 relative ${
                currentView === item.id ? '-translate-y-1' : 'text-muted'
              }`}
            >
              <div className={`absolute inset-0 bg-accent/20 blur-md rounded-full transition-opacity duration-300 ${currentView === item.id ? 'opacity-100' : 'opacity-0'}`}></div>
              <item.icon className={`w-6 h-6 stroke-[1.5] relative z-10 ${currentView === item.id ? 'text-accent fill-accent/20' : ''}`} />
            </button>
          ))}
           <button
              onClick={() => onViewChange(AppView.SETTINGS)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                currentView === AppView.SETTINGS ? '-translate-y-1 text-accent' : 'text-muted'
              }`}
            >
              <Settings className="w-6 h-6 stroke-[1.5]" />
            </button>
        </div>
      </div>
    </>
  );
};