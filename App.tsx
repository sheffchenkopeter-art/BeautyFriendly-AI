
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { CalendarView } from './pages/CalendarView';
import { ClientsView } from './pages/ClientsView';
import { AIStylist } from './pages/AIStylist';
import { Login } from './pages/Login';
import { Subscription } from './pages/Subscription';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';
import { AppView, User, Client, Appointment, WorkSchedule, WalletState, Transaction, PaymentMethod, ExpenseCategory } from './types';
import { MOCK_CLIENTS, MOCK_APPOINTMENTS, DEFAULT_SCHEDULE, INITIAL_WALLET_STATE } from './constants';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  
  // Data State
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule>(DEFAULT_SCHEDULE);
  
  // Financial State
  const [wallets, setWallets] = useState<WalletState>(INITIAL_WALLET_STATE);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Auto-close appointments older than 12 hours on mount
  useEffect(() => {
    const checkAutoClose = () => {
      const now = new Date();
      const twelveHoursInMs = 12 * 60 * 60 * 1000;
      const cutoffTime = new Date(now.getTime() - twelveHoursInMs);
      
      let cashToAdd = 0;
      const newTransactions: Transaction[] = [];
      let hasChanges = false;

      const updatedAppointments = appointments.map(app => {
        // If appointment is scheduled AND older than 12 hours
        if (app.status === 'scheduled' && new Date(app.date) < cutoffTime) {
           hasChanges = true;
           // Logic: Auto-close as Cash (default safety mechanism)
           cashToAdd += app.price;
           
           newTransactions.push({
             id: `auto-${Date.now()}-${app.id}`,
             date: new Date(), // Transaction recorded now
             amount: app.price,
             type: 'income',
             category: ExpenseCategory.SERVICE,
             description: `Авто-закриття: ${app.service} (${app.clientName})`,
             paymentMethod: 'cash'
           });
           
           return { ...app, status: 'completed' as const, paymentMethod: 'cash' as PaymentMethod };
        }
        return app;
      });

      // Only update state if changes actually happened to prevent render loops
      if (hasChanges) {
        setAppointments(updatedAppointments);
        setWallets(prev => ({ ...prev, cash: prev.cash + cashToAdd }));
        setTransactions(prev => [...prev, ...newTransactions]);
      }
    };

    checkAutoClose();
  }, []); // Run once on mount

  // --- Auth Handlers ---
  const handleLogin = (email: string) => {
    // Mock user data for demo
    setUser({
      id: 'u1',
      name: 'Олександра', 
      email: email,
      role: 'Top Stylist',
      hasSubscription: false // User starts without subscription
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleSubscribe = (plan: 'start' | 'pro' | 'premium') => {
    if (user) {
      setUser({ ...user, hasSubscription: true, subscriptionPlan: plan });
    }
  };

  const handleUpdateUser = (updates: Partial<User>) => {
      if (user) {
          setUser({ ...user, ...updates });
      }
  }

  // --- Data Handlers ---
  const handleAddClient = (newClient: Client) => {
    setClients(prev => [...prev, newClient]);
  };

  const handleAddAppointment = (newApp: Appointment) => {
    setAppointments(prev => [...prev, newApp]);
  };

  // Manual close (Checkout)
  const handleCloseAppointment = (id: string, method: PaymentMethod, finalPrice?: number) => {
      const app = appointments.find(a => a.id === id);
      if (!app || app.status === 'completed') return;

      // Determine final price (use edited price if provided, otherwise default)
      const priceToUse = finalPrice !== undefined ? finalPrice : app.price;

      // Update Appointment Status and Price history
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed', paymentMethod: method, price: priceToUse } : a));

      // Update Wallet Balance
      setWallets(prev => ({
          ...prev,
          [method]: prev[method] + priceToUse
      }));

      // Add Income Transaction
      const newTransaction: Transaction = {
          id: Date.now().toString(),
          date: new Date(),
          amount: priceToUse,
          type: 'income',
          category: ExpenseCategory.SERVICE,
          description: `Візит: ${app.service} (${app.clientName})`,
          paymentMethod: method
      };
      setTransactions(prev => [...prev, newTransaction]);
  };

  const handleAddExpense = (amount: number, category: ExpenseCategory, description: string, method: PaymentMethod) => {
      // Update Wallet (subtract money)
      setWallets(prev => ({
          ...prev,
          [method]: prev[method] - amount
      }));

      // Add Expense Transaction
      const newTransaction: Transaction = {
          id: Date.now().toString(),
          date: new Date(),
          amount: amount,
          type: 'expense',
          category,
          description,
          paymentMethod: method
      };
      setTransactions(prev => [...prev, newTransaction]);
  };

  // --- Render Logic ---

  // 1. Authentication Guard
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // 2. Subscription Guard
  if (!user.hasSubscription) {
    return <Subscription onSubscribe={handleSubscribe} />;
  }

  // 3. Main App View
  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard 
                  onChangeView={setCurrentView} 
                  appointments={appointments}
                  transactions={transactions}
                  user={user}
               />;
      case AppView.CALENDAR:
        return <CalendarView 
                  appointments={appointments} 
                  clients={clients} 
                  onAddAppointment={handleAddAppointment}
                  workSchedule={workSchedule}
                  onCloseAppointment={handleCloseAppointment}
               />;
      case AppView.CLIENTS:
        return <ClientsView clients={clients} onAddClient={handleAddClient} />;
      case AppView.AI_STYLIST:
        return <AIStylist />;
      case AppView.ANALYTICS:
        return <Analytics 
                  wallets={wallets} 
                  transactions={transactions} 
                  onAddExpense={handleAddExpense} 
               />;
      case AppView.SETTINGS:
        return <Settings 
                  user={user} 
                  onUpdateUser={handleUpdateUser}
                  onLogout={handleLogout}
                  workSchedule={workSchedule}
                  onUpdateSchedule={setWorkSchedule}
               />;
      default:
        return <Dashboard 
                  onChangeView={setCurrentView} 
                  appointments={appointments} 
                  transactions={transactions}
                  user={user}
               />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#101b2a] text-slate-200 font-sans selection:bg-[#d6b980] selection:text-[#101b2a]">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 md:ml-64 h-screen overflow-y-auto bg-[#101b2a] scroll-smooth">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
