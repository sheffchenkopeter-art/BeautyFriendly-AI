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

  // Mobile items: Prioritize Analytics over Services for daily usage
  const mobileNavItems = [
    navItems[0], // Dashboard
    navItems[1], // Calendar
    navItems[3], // AI Stylist (Center)
    navItems[5], // Analytics (Replaces Services/Clients for better business tracking)
    navItems[4], // Clients
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-surface-soft border-r border-border text-main h-screen fixed left-0 top-0 p-6 z-50 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-12 px-2">
          {/* Small BF Logo for Sidebar */}
          <div className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center bg-primary shrink-0 shadow-md">
             <span className="text-lg font-serif text-accent tracking-tighter italic font-bold ml-[-1px]">BF</span>
          </div>
          {/* Fixed: Adjusted text size and tracking to prevent overflow */}
          <h1 className="text-base font-bold tracking-wide font-serif text-accent uppercase leading-tight">
            Beauty Friendly
          </h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-300 group ${
                currentView === item.id
                  ? 'bg-surface text-accent border-l-2 border-accent shadow-sm'
                  : 'text-muted hover:bg-surface hover:text-accent'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${currentView === item.id ? 'text-accent' : 'group-hover:text-accent'}`} />
              <span className={`font-medium text-sm tracking-wide ${currentView === item.id ? 'font-semibold' : ''}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="flex items-center gap-3 px-2 mb-6">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border border-accent/30" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-surface border border-accent/30 flex items-center justify-center font-serif font-bold text-accent">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-main truncate font-serif">{user.name}</p>
              <p className="text-[10px] text-accent uppercase tracking-wider truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-muted hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Вийти
          </button>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-soft border-t border-border px-6 pt-4 flex justify-between items-center z-50 shadow-lg transition-colors duration-300"
        // Adding extra padding bottom to lift icons above the safe area swipe indicator
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        {mobileNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center gap-1 transition-transform active:scale-95 ${
              currentView === item.id ? 'text-accent' : 'text-muted'
            }`}
          >
            {/* Increased icon size from w-5 h-5 to w-7 h-7 for better touch targets */}
            <item.icon className="w-7 h-7 stroke-[1.5]" />
          </button>
        ))}
         <button
            onClick={() => onViewChange(AppView.SETTINGS)}
            className={`flex flex-col items-center gap-1 transition-transform active:scale-95 ${
              currentView === AppView.SETTINGS ? 'text-accent' : 'text-muted'
            }`}
          >
            <Settings className="w-7 h-7 stroke-[1.5]" />
          </button>
      </div>
    </>
  );
};