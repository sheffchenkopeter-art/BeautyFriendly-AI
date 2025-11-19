import React from 'react';
import { Calendar, Users, Sparkles, LayoutDashboard, LogOut } from 'lucide-react';
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
    { id: AppView.AI_STYLIST, icon: Sparkles, label: 'AI Стиліст' },
    { id: AppView.CLIENTS, icon: Users, label: 'Клієнти' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-purple-500 p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">BeautyFriendly AI</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 mb-4">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full bg-slate-800" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Вийти
          </button>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 safe-area-pb">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center gap-1 ${
              currentView === item.id ? 'text-purple-600' : 'text-slate-400'
            }`}
          >
            <item.icon className={`w-6 h-6 ${currentView === item.id ? 'fill-current/10' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
        <button
           onClick={onLogout}
           className="flex flex-col items-center gap-1 text-slate-400"
        >
           <LogOut className="w-6 h-6" />
           <span className="text-[10px] font-medium">Вихід</span>
        </button>
      </div>
    </>
  );
};