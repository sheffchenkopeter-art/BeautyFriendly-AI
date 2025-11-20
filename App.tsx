import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { CalendarView } from './pages/CalendarView';
import { ClientsView } from './pages/ClientsView';
import { ServicesView } from './pages/ServicesView';
import { AIStylist } from './pages/AIStylist';
import { Login } from './pages/Login';
import { Subscription } from './pages/Subscription';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';
import { AppView, User, Client, Appointment, WorkSchedule, WalletState, Transaction, PaymentMethod, ExpenseCategory, CalendarDailyView, ServiceItem, ServiceCategory, AppTheme } from './types';
import { MOCK_CLIENTS, MOCK_APPOINTMENTS, DEFAULT_SCHEDULE, INITIAL_WALLET_STATE, DEFAULT_SERVICES, DEFAULT_CATEGORIES } from './constants';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [calendarDailyView, setCalendarDailyView] = useState<CalendarDailyView>('cards');
  const [theme, setTheme] = useState<AppTheme>('dark');

  // Data States
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(DEFAULT_CATEGORIES);
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES); 
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule>(DEFAULT_SCHEDULE);
  const [wallets, setWallets] = useState<WalletState>(INITIAL_WALLET_STATE);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Auto-close logic
  useEffect(() => {
    const checkAutoClose = () => {
      const now = new Date();
      const cutoffTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
      let cashToAdd = 0;
      const newTransactions: Transaction[] = [];
      let hasChanges = false;

      const updatedAppointments = appointments.map(app => {
        if (app.status === 'scheduled' && new Date(app.date) < cutoffTime) {
           hasChanges = true;
           cashToAdd += app.price;
           newTransactions.push({
             id: `auto-${Date.now()}-${app.id}`,
             date: new Date(),
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

      if (hasChanges) {
        setAppointments(updatedAppointments);
        setWallets(prev => ({ ...prev, cash: prev.cash + cashToAdd }));
        setTransactions(prev => [...prev, ...newTransactions]);
      }
    };
    checkAutoClose();
  }, []);

  // Handlers
  const handleLogin = (email: string) => setUser({ id: 'u1', name: 'Олександра', email: email, role: 'Top Stylist', hasSubscription: false });
  const handleLogout = () => { setUser(null); setCurrentView(AppView.DASHBOARD); };
  const handleSubscribe = (plan: 'start' | 'pro' | 'premium') => { if (user) setUser({ ...user, hasSubscription: true, subscriptionPlan: plan }); };
  const handleUpdateUser = (updates: Partial<User>) => { if (user) setUser({ ...user, ...updates }); }
  
  const handleAddClient = (newClient: Client) => setClients(prev => [...prev, newClient]);
  const handleAddCategory = (title: string) => setServiceCategories(prev => [...prev, { id: Date.now().toString(), title }]);
  const handleDeleteCategory = (id: string) => { setServiceCategories(prev => prev.filter(c => c.id !== id)); setServices(prev => prev.filter(s => s.categoryId !== id)); };
  const handleAddService = (newService: ServiceItem) => setServices(prev => [...prev, newService]);
  const handleUpdateService = (updatedService: ServiceItem) => setServices(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  const handleDeleteService = (id: string) => setServices(prev => prev.filter(s => s.id !== id));
  const handleAddAppointment = (newApp: Appointment) => setAppointments(prev => [...prev, newApp]);
  const handleRescheduleAppointment = (id: string, newDate: Date, newDuration: number) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, date: newDate, durationMinutes: newDuration } : a));
  const handleCancelAppointment = (id: string) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  
  const handleCloseAppointment = (id: string, method: PaymentMethod, finalPrice?: number) => {
      const app = appointments.find(a => a.id === id);
      if (!app || app.status === 'completed') return;
      const priceToUse = finalPrice !== undefined ? finalPrice : app.price;
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed', paymentMethod: method, price: priceToUse } : a));
      setWallets(prev => ({ ...prev, [method]: prev[method] + priceToUse }));
      setTransactions(prev => [...prev, { id: Date.now().toString(), date: new Date(), amount: priceToUse, type: 'income', category: ExpenseCategory.SERVICE, description: `Візит: ${app.service} (${app.clientName})`, paymentMethod: method }]);
  };
  const handleAddExpense = (amount: number, category: ExpenseCategory, description: string, method: PaymentMethod) => {
      setWallets(prev => ({ ...prev, [method]: prev[method] - amount }));
      setTransactions(prev => [...prev, { id: Date.now().toString(), date: new Date(), amount: amount, type: 'expense', category, description, paymentMethod: method }]);
  };

  if (!user) return <Login onLogin={handleLogin} />;
  if (!user.hasSubscription) return <Subscription onSubscribe={handleSubscribe} />;

  // Render Logic
  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard onChangeView={setCurrentView} appointments={appointments} transactions={transactions} clients={clients} user={user} onCloseAppointment={handleCloseAppointment} onRescheduleAppointment={handleRescheduleAppointment} />;
      case AppView.CALENDAR: return <CalendarView appointments={appointments} clients={clients} services={services} categories={serviceCategories} onAddAppointment={handleAddAppointment} workSchedule={workSchedule} onCloseAppointment={handleCloseAppointment} onRescheduleAppointment={handleRescheduleAppointment} onCancelAppointment={handleCancelAppointment} dailyViewMode={calendarDailyView} onToggleDailyView={setCalendarDailyView} />;
      case AppView.CLIENTS: return <ClientsView clients={clients} onAddClient={handleAddClient} />;
      case AppView.SERVICES: return <ServicesView categories={serviceCategories} services={services} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} onAddService={handleAddService} onUpdateService={handleUpdateService} onDeleteService={handleDeleteService} />;
      case AppView.AI_STYLIST: return <AIStylist />;
      case AppView.ANALYTICS: return <Analytics wallets={wallets} transactions={transactions} onAddExpense={handleAddExpense} />;
      case AppView.SETTINGS: return <Settings user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} workSchedule={workSchedule} onUpdateSchedule={setWorkSchedule} calendarDailyView={calendarDailyView} onUpdateCalendarView={setCalendarDailyView} onNavigateToServices={() => setCurrentView(AppView.SERVICES)} theme={theme} onUpdateTheme={setTheme} />;
      default: return <Dashboard onChangeView={setCurrentView} appointments={appointments} transactions={transactions} clients={clients} user={user} onCloseAppointment={handleCloseAppointment} onRescheduleAppointment={handleRescheduleAppointment} />;
    }
  };

  return (
    <div className={`flex min-h-screen w-full bg-primary text-main font-sans selection:bg-accent selection:text-primary theme-${theme} transition-colors duration-300`}>
      <Navigation currentView={currentView} onViewChange={setCurrentView} user={user} onLogout={handleLogout} />
      <main className="flex-1 md:ml-72 h-screen overflow-y-auto bg-primary flex flex-col relative scroll-smooth">
        {/* Layout Wrapper: Centers content and prevents stretching */}
        <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 pb-28 md:pb-8">
            {renderContent()}
        </div>
        
        {/* Professional Footer */}
        <footer className="py-6 text-center border-t border-border mt-auto bg-surface/30 backdrop-blur-sm hidden md:block">
            <p className="text-xs text-muted font-medium tracking-wider">
                © 2025 <span className="text-accent font-serif font-bold">BeautyFriendly Studio</span> • AI Assistant for Stylists
            </p>
        </footer>
      </main>
    </div>
  );
}

export default App;