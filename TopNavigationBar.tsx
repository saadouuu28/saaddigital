import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Coffee,
  Smartphone,
  Globe,
  PlusCircle,
  Bell,
  BellOff,
  LogOut,
  Store,
  UserCheck,
  Lock,
} from 'lucide-react';

export const TopNavigationBar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    orders,
    payments,
    waiterCalls,
    soundEnabled,
    setSoundEnabled,
    isAdminLoggedIn,
    logoutAdmin,
    loggedRestaurant,
    logoutRestaurant,
    setSelectedBusinessId,
    businesses,
    selectedBusinessId,
  } = useApp();

  const newOrdersCount = orders.filter((o) => o.status === 'NEW').length;
  const pendingPaymentsCount = payments.filter((p) => p.status === 'PENDING').length;
  const activeCallsCount = waiterCalls.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 text-xs shadow-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('LANDING')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs group-hover:bg-amber-400 transition-all">
              QR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                  MyMenuQR
                </span>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                  .tn
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Clean Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
          {/* Landing / Vitrine */}
          <button
            type="button"
            onClick={() => setActiveView('LANDING')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeView === 'LANDING'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>Accueil</span>
          </button>

          {/* Espace Café / Restaurant */}
          <button
            type="button"
            onClick={() => setActiveView('RESTAURANT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap relative ${
              activeView === 'RESTAURANT'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {loggedRestaurant?.logo && (loggedRestaurant.logo.startsWith('http') || loggedRestaurant.logo.startsWith('/')) ? (
              <img
                src={loggedRestaurant.logo}
                alt=""
                className="w-4 h-4 rounded-full object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <Coffee className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>
              {loggedRestaurant ? loggedRestaurant.name : 'Espace Café'}
            </span>
            {(newOrdersCount > 0 || activeCallsCount > 0) && (
              <span className="ml-0.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight">
                {newOrdersCount + activeCallsCount}
              </span>
            )}
          </button>

          {/* Client Mobile Order */}
          <button
            type="button"
            onClick={() => setActiveView('CLIENT')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeView === 'CLIENT'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Menu Table 7</span>
          </button>

          {/* Admin Space */}
          <button
            type="button"
            onClick={() => setActiveView('ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap relative ${
              activeView === 'ADMIN'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isAdminLoggedIn ? (
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Administration</span>
            {pendingPaymentsCount > 0 && (
              <span className="ml-0.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight animate-pulse">
                {pendingPaymentsCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Tools: Quick actions & Audio chime toggle */}
        <div className="flex items-center gap-2">
          {/* Quick Register button if not logged */}
          <button
            type="button"
            onClick={() => setActiveView('REGISTER')}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-semibold text-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Inscription Café</span>
          </button>

          {/* Sound Notification Bell Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[11px] ${
              soundEnabled
                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            title={soundEnabled ? 'Sonnette de commande active (cliquez pour couper)' : 'Sonnette coupée'}
          >
            {soundEnabled ? (
              <>
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline font-medium">Son 🔔</span>
              </>
            ) : (
              <>
                <BellOff className="w-3.5 h-3.5" />
                <span className="hidden md:inline font-medium">Muet</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
