import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { CalendarView } from './pages/CalendarView';
import { ClientsView } from './pages/ClientsView';
import { AIStylist } from './pages/AIStylist';
import { Login } from './pages/Login';
import { Subscription } from './pages/Subscription';
import { AppView, User } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (email: string) => {
    // Simulate backend auth response
    // Default to NO subscription to show the subscription flow
    setUser({
      id: 'u1',
      name: 'Марія Коваль',
      email: email,
      role: 'Pro Stylist',
      hasSubscription: false, // User logs in but hasn't paid yet
    });
  };

  const handleSubscribe = (plan: 'start' | 'pro' | 'premium') => {
    if (!user) return;
    // Update user with active subscription
    setUser({
      ...user,
      hasSubscription: true,
      subscriptionPlan: plan
    });
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
      default:
        return <Dashboard onChangeView={setCurrentView} />;
    }
  };

  // Auth Flow
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Subscription Flow
  if (!user.hasSubscription) {
    return <Subscription onSubscribe={handleSubscribe} />;
  }

  // Main App Flow
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans md:pl-64 transition-all">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="max-w-5xl mx-auto p-4 md:p-8 h-full">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;