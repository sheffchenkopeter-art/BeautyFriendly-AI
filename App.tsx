import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { CalendarView } from './pages/CalendarView';
import { ClientsView } from './pages/ClientsView';
import { AIStylist } from './pages/AIStylist';
import { Login } from './pages/Login';
import { Subscription } from './pages/Subscription';
import { Settings } from './pages/Settings';
import { AppView, User } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (email: string) => {
    setUser({
      id: 'u1',
      name: 'Марія Коваль',
      email: email,
      role: 'Pro Stylist',
      hasSubscription: false, 
    });
  };

  const handleSubscribe = (plan: 'start' | 'pro' | 'premium') => {
    if (!user) return;
    setUser({
      ...user,
      hasSubscription: true,
      subscriptionPlan: plan
    });
  };

  const handleUpdateUser = (updatedFields: Partial<User>) => {
      if (!user) return;
      setUser({ ...user, ...updatedFields });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.DASHBOARD);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onChangeView={setCurrentView} />;
      case AppView.CALENDAR:
        return <CalendarView />;
      case AppView.CLIENTS:
        return <ClientsView />;
      case AppView.AI_STYLIST:
        return <AIStylist />;
      case AppView.SETTINGS:
        return user ? <Settings user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} /> : null;
      default:
        return <Dashboard onChangeView={setCurrentView} />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (!user.hasSubscription) {
    return <Subscription onSubscribe={handleSubscribe} />;
  }

  return (
    <div className="min-h-screen bg-[#101b2a] text-slate-100 font-sans md:pl-64 transition-all">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="max-w-6xl mx-auto p-4 md:p-10 h-full">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;