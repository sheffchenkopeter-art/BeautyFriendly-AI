import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { CalendarView } from './pages/CalendarView';
import { ClientsView } from './pages/ClientsView';
import { AIStylist } from './pages/AIStylist';
import { Login } from './pages/Login';
import { Subscription } from './pages/Subscription';
import { Settings } from './pages/Settings';
import { AppView, User, Client, Appointment, WorkSchedule } from './types';
import { MOCK_CLIENTS, MOCK_APPOINTMENTS, DEFAULT_SCHEDULE } from './constants';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  
  // Data State
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule>(DEFAULT_SCHEDULE);

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

  const handleUpdateSchedule = (newSchedule: WorkSchedule) => {
    setWorkSchedule(newSchedule);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.DASHBOARD);
  };

  // Data Handlers
  const handleAddClient = (newClient: Client) => {
    setClients(prev => [...prev, newClient]);
  };

  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment]);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onChangeView={setCurrentView} appointments={appointments} />;
      case AppView.CALENDAR:
        return (
          <CalendarView 
            appointments={appointments} 
            clients={clients}
            onAddAppointment={handleAddAppointment}
            workSchedule={workSchedule}
          />
        );
      case AppView.CLIENTS:
        return (
          <ClientsView 
            clients={clients} 
            onAddClient={handleAddClient} 
          />
        );
      case AppView.AI_STYLIST:
        return <AIStylist />;
      case AppView.SETTINGS:
        return user ? (
          <Settings 
            user={user} 
            onUpdateUser={handleUpdateUser} 
            onLogout={handleLogout} 
            workSchedule={workSchedule}
            onUpdateSchedule={handleUpdateSchedule}
          />
        ) : null;
      default:
        return <Dashboard onChangeView={setCurrentView} appointments={appointments} />;
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