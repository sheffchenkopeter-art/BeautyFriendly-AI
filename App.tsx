import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { CalendarView } from './pages/CalendarView';
import { ClientsView } from './pages/ClientsView';
import { AIStylist } from './pages/AIStylist';
import { AppView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans md:pl-64 transition-all">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-5xl mx-auto p-4 md:p-8 h-full">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;