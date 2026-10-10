import React, { useState } from 'react';
import { useApp, formatDT, getDefaultBusinessPhoto } from '../context/AppContext';
import { Business, BusinessType } from '../types';
import {
  Building2,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
  Shield,
  Ban,
  Check,
  QrCode,
  Settings,
  DollarSign,
  Trash2,
  Sliders,
  Clock,
  LogOut,
  Lock,
  ExternalLink,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    businesses,
    subscriptions,
    payments,
    pricingHistory,
    currentMonthlyPrice,
    updatePricing,
    confirmPayment,
    rejectPayment,
    addBusiness,
    suspendBusiness,
    activateBusiness,
    deleteBusiness,
    setSelectedBusinessId,
    setActiveView,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
  } = useApp();

  // Admin Login state
  const [adminEmail, setAdminEmail] = useState('admin@saad-digital.tn');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Modals & Pricing State
  const [isAddBizModalOpen, setIsAddBizModalOpen] = useState(false);
  const [isEditPricingModalOpen, setIsEditPricingModalOpen] = useState(false);
  const [newPriceValue, setNewPriceValue] = useState(currentMonthlyPrice.toString());
  const [priceChangeReason, setPriceChangeReason] = useState('Augmentation tarifaire standard');
  const [priceUpdateSuccess, setPriceUpdateSuccess] = useState<string | null>(null);

  // Form add business
  const [newBizName, setNewBizName] = useState('');
  const [newBizType, setNewBizType] = useState<BusinessType>('CAFE');
  const [newBizPhone, setNewBizPhone] = useState('+216 ');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(adminPassword);
  };

  // 1. If Admin is NOT logged in -> Dedicated Admin Auth View
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center text-slate-800">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold mx-auto shadow-xs">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Administration SAAD DIGITAL
            </h1>
            <p className="text-xs text-slate-500">
              Espace réservé à la gestion centrale des cafés, abonnements et paiements D17.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Identifiant Administrateur
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-blue-500 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mot de passe secret
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Se connecter en tant qu'Administrateur
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => loginAdmin()}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Accès Démo 1-Clic Administrateur
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Admin is logged in -> Clean Light Admin Panel
  const pendingPayments = payments.filter((p) => p.status === 'PENDING');
  const activeSubsCount = businesses.filter((b) => b.status === 'ACTIVE').length;
  const monthlyRevenue = activeSubsCount * currentMonthlyPrice;

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || b.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim()) return;

    const slug = newBizName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    addBusiness({
      slug,
      ownerId: `owner-${Date.now()}`,
      name: newBizName,
      type: newBizType,
      address: 'Tunis, Tunisie',
      phone: newBizPhone || '+216 96 281 735',
      logo: getDefaultBusinessPhoto(newBizType),
      coverImage: getDefaultBusinessPhoto(newBizType),
      status: 'ACTIVE',
      currency: 'DT',
      welcomeMessage: `Bienvenue chez ${newBizName} !`,
      subscriptionPrice: currentMonthlyPrice,
      subscriptionExpiresAt: expiresAt,
      paymentMethod: 'D17',
    });

    setIsAddBizModalOpen(false);
    setNewBizName('');
  };

  const handleImpersonate = (bizId: string) => {
    setSelectedBusinessId(bizId);
    setActiveView('RESTAURANT');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Admin Header */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight">SAAD DIGITAL</h1>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Gestion des abonnements & activation des comptes cafés (D17 : <strong>96 281 735</strong>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddBizModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ajouter un café</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-slate-100 text-xs font-semibold">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              adminTab === 'dashboard'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tableau de bord</span>
          </button>

          <button
            onClick={() => setAdminTab('payments')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors relative ${
              adminTab === 'payments'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Paiements D17 & Activations</span>
            {pendingPayments.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight">
                {pendingPayments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('businesses')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              adminTab === 'businesses'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Établissements ({businesses.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('pricing')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              adminTab === 'pricing'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tarification ({currentMonthlyPrice} DT)</span>
          </button>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* TAB: DASHBOARD */}
        {adminTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Établissements</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {businesses.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Cafés & Restos</div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Abonnements actifs
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                  {activeSubsCount}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Accès ouvert 100%</div>
              </div>

              <div className="bg-white border border-amber-200 p-4 rounded-2xl shadow-xs bg-amber-50/50">
                <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  En attente D17
                </span>
                <div className="text-2xl font-bold font-mono text-amber-700 mt-1">
                  {pendingPayments.length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">À activer manuellement</div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
                <span className="text-xs text-slate-500 font-medium">Revenus mensuels</span>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {monthlyRevenue} DT
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {activeSubsCount} × {currentMonthlyPrice} DT
                </div>
              </div>
            </div>

            {/* Pending Payments Alert Card if any */}
            {pendingPayments.length > 0 && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-amber-900">
                      {pendingPayments.length} café(s) en attente d'activation
                    </h3>
                    <p className="text-[11px] text-amber-800">
                      Un café a envoyé son paiement ({currentMonthlyPrice} DT) via D17. Vérifiez le reçu et activez son accès en 1 clic.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAdminTab('payments')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Voir les paiements D17
                </button>
              </div>
            )}

            {/* Recent establishments list */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Derniers établissements</h3>
                <button
                  onClick={() => setAdminTab('businesses')}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Tous voir →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Café / Resto</th>
                      <th className="py-2.5 px-3">Statut</th>
                      <th className="py-2.5 px-3">Abonnement</th>
                      <th className="py-2.5 px-3">Expiration</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {businesses.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={b.logo && b.logo.startsWith('http') ? b.logo : getDefaultBusinessPhoto(b.type)}
                              alt={b.name}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-100"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900 truncate">{b.name}</div>
                              <div className="text-[11px] text-slate-400 truncate">{b.address}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {b.status === 'ACTIVE' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              Actif
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                              En attente
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-800">{b.subscriptionPrice} DT/mois</td>
                        <td className="py-3 px-3 text-slate-500 font-mono">
                          {new Date(b.subscriptionExpiresAt).toLocaleDateString('fr-TN')}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleImpersonate(b.id)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px]"
                          >
                            Ouvrir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PAYMENTS D17 & ACTIVATIONS (CORE FOCUS OF THE PROMPT) */}
        {adminTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <h3 className="text-sm font-bold text-slate-900">
                Paiements D17 & Activations de comptes
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Vérifiez les transferts D17 reçus sur le <strong>96 281 735</strong> et cliquez sur "Activer le compte" pour débloquer l'accès pour 30 jours.
              </p>
            </div>

            {/* Pending List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Demandes d'activation en attente ({pendingPayments.length})
              </h4>

              {pendingPayments.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                  Toutes les demandes de paiement ont été traitées. Aucun compte en attente.
                </div>
              ) : (
                <div className="grid gap-3">
                  {pendingPayments.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border-2 border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{p.businessName}</span>
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {p.method}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Réf : <strong className="text-slate-900 font-mono">{p.referenceNumber}</strong> · Date : {p.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold font-mono text-amber-700">
                            {p.amount} DT
                          </div>
                          <span className="text-[10px] text-slate-400">1 mois d'accès</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => confirmPayment(p.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Activer le compte ({p.amount || currentMonthlyPrice} DT)</span>
                          </button>
                          <button
                            onClick={() => rejectPayment(p.id)}
                            className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs"
                          >
                            Refuser
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmed Transactions Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs space-y-2 p-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Historique des encaissements validés
              </h4>
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Café</th>
                    <th className="py-2.5 px-3">Montant</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Statut</th>
                    <th className="py-2.5 px-3">Référence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3 font-semibold text-slate-900">{pay.businessName}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700">{pay.amount} DT</td>
                      <td className="py-3 px-3 text-slate-600">{pay.method}</td>
                      <td className="py-3 px-3 text-slate-500 font-mono">{pay.date}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {pay.status === 'CONFIRMED' ? 'Confirmé' : pay.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 font-mono">{pay.referenceNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ALL BUSINESSES */}
        {adminTab === 'businesses' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => setIsAddBizModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un café</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Établissement</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Abonnement</th>
                    <th className="py-3 px-4">Expiration</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBusinesses.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.logo && b.logo.startsWith('http') ? b.logo : getDefaultBusinessPhoto(b.type)}
                            alt={b.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">{b.name}</div>
                            <div className="text-[11px] text-slate-400 truncate">{b.phone} · {b.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{b.type}</td>
                      <td className="py-3 px-4">
                        {b.status === 'ACTIVE' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            Actif
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                            En attente
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{b.subscriptionPrice} DT/mois</td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {new Date(b.subscriptionExpiresAt).toLocaleDateString('fr-TN')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleImpersonate(b.id)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                          >
                            Gérer
                          </button>
                          {b.status === 'ACTIVE' ? (
                            <button
                              onClick={() => suspendBusiness(b.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Suspendre"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => activateBusiness(b.id)}
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                              title="Activer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer ${b.name} ?`)) deleteBusiness(b.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: PRICING */}
        {adminTab === 'pricing' && (
          <div className="space-y-6">
            {/* Success notification */}
            {priceUpdateSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs shadow-xs animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">{priceUpdateSuccess}</span>
              </div>
            )}

            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Column: Current Price & Increase Form */}
              <div className="lg:col-span-7 space-y-6">
                {/* Active Price Card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Prix mensuel actuel</h3>
                      <p className="text-xs text-slate-500">Tarif facturé à chaque café/restaurant par mois</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      En vigueur
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold font-mono text-amber-600 tracking-tight">
                      {currentMonthlyPrice}
                    </span>
                    <span className="text-lg font-bold text-slate-700">DT / mois</span>
                  </div>

                  {/* Impact projection */}
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-1">
                    <div className="flex justify-between items-center text-amber-900 font-semibold">
                      <span>Revenus mensuels projetés :</span>
                      <span className="font-mono text-sm font-bold text-amber-800">
                        {activeSubsCount * currentMonthlyPrice} DT / mois
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-700">
                      Calculé sur les <strong>{activeSubsCount} établissements actifs</strong> abonnés.
                    </p>
                  </div>
                </div>

                {/* Increase Price Form */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Augmenter le prix mensuel</h4>
                      <p className="text-xs text-slate-500">
                        Ajustez le tarif en 1 clic ou saisissez une nouvelle valeur.
                      </p>
                    </div>
                  </div>

                  {/* Quick increment buttons */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Augmentations rapides suggérées :
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[5, 10, 20].map((inc) => (
                        <button
                          key={inc}
                          type="button"
                          onClick={() => {
                            const next = currentMonthlyPrice + inc;
                            setNewPriceValue(next.toString());
                            updatePricing(next, `Augmentation de +${inc} DT (nouveau tarif ${next} DT/mois)`);
                            setPriceUpdateSuccess(`Prix mensuel augmenté à ${next} DT / mois (+${inc} DT) !`);
                            setTimeout(() => setPriceUpdateSuccess(null), 4000);
                          }}
                          className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs group"
                        >
                          <span className="text-amber-600 font-extrabold group-hover:scale-110 transition-transform">+</span>
                          <span>+{inc} DT</span>
                          <span className="text-[10px] text-slate-400 font-normal">({currentMonthlyPrice + inc} DT)</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Price Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const val = parseFloat(newPriceValue);
                      if (isNaN(val) || val <= 0) return;
                      updatePricing(val, priceChangeReason || 'Ajustement du prix d’abonnement');
                      setPriceUpdateSuccess(`Prix mensuel mis à jour à ${val} DT / mois avec succès !`);
                      setTimeout(() => setPriceUpdateSuccess(null), 4000);
                    }}
                    className="space-y-4 pt-2 border-t border-slate-100 text-xs"
                  >
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Nouveau prix (en DT) *
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="1"
                            min="1"
                            required
                            value={newPriceValue}
                            onChange={(e) => setNewPriceValue(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold text-base focus:outline-hidden focus:border-amber-500 pr-12"
                          />
                          <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">
                            DT
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Motif / Libellé
                        </label>
                        <input
                          type="text"
                          value={priceChangeReason}
                          onChange={(e) => setPriceChangeReason(e.target.value)}
                          placeholder="Ex: Augmentation annuelle 2026"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[11px] text-slate-500">
                        La modification s'applique immédiatement à tous les espaces et calculs.
                      </p>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Enregistrer le nouveau prix</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: D17 Account info & History */}
              <div className="lg:col-span-5 space-y-6">
                {/* D17 Account Details */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>Compte de réception D17</span>
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ce numéro postal D17 est affiché automatiquement aux gérants de cafés lors de l'inscription et du renouvellement de leur abonnement.
                  </p>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Numéro D17 récepteur :</span>
                      <span className="font-mono font-bold text-slate-900 text-sm bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        96 281 735
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Bénéficiaire :</span>
                      <span className="font-semibold text-slate-900">Ahmed Saad (SAAD DIGITAL)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Opérateur :</span>
                      <span className="font-medium text-slate-700">La Poste Tunisienne (D17)</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Plans History */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Historique des tarifs</h4>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1 text-xs">
                    {pricingHistory.map((plan) => (
                      <div key={plan.id} className="py-2.5 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900">
                              {plan.monthlyPrice} DT / mois
                            </span>
                            {plan.isActive ? (
                              <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Actif
                              </span>
                            ) : (
                              <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-500 text-[10px]">
                                Expiré
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{plan.description}</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {plan.startDate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Business */}
      {isAddBizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Ajouter un établissement</h3>
            <form onSubmit={handleCreateBusiness} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Café de Paris"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Téléphone</label>
                <input
                  type="text"
                  value={newBizPhone}
                  onChange={(e) => setNewBizPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                >
                  Créer et activer
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddBizModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
