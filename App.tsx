import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopNavigationBar } from './components/TopNavigationBar';
import { LandingPage } from './views/LandingPage';
import { AdminView } from './views/AdminView';
import { RestaurantView } from './views/RestaurantView';
import { ClientOrderView } from './views/ClientOrderView';
import { RegisterView } from './views/RegisterView';

const MainRouter: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <TopNavigationBar />

      <main className="flex-1">
        {activeView === 'LANDING' && <LandingPage />}
        {activeView === 'ADMIN' && <AdminView />}
        {activeView === 'RESTAURANT' && <RestaurantView />}
        {activeView === 'CLIENT' && <ClientOrderView />}
        {activeView === 'REGISTER' && <RegisterView />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
