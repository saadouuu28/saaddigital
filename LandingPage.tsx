import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Coffee,
  ShieldCheck,
  QrCode,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, setSelectedBusinessId, setSelectedTableId, currentMonthlyPrice } = useApp();

  const handleTestClient = () => {
    setSelectedBusinessId('cafe-el-medina');
    setSelectedTableId('table-7');
    setActiveView('CLIENT');
  };

  const handleTestCafe = () => {
    setSelectedBusinessId('cafe-el-medina');
    setActiveView('RESTAURANT');
  };

  const handleTestAdmin = () => {
    setActiveView('ADMIN');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Digitalisez votre café ou restaurant en{' '}
                <span className="text-amber-600">toute simplicité</span>.
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                Gérez votre <strong>menu digital</strong>, vos <strong>tables</strong> et vos <strong>commandes via QR Code</strong> en temps réel. Sans commissions sur vos ventes, accessible immédiatement sur smartphone sans installation d'application.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  Paiement D17 ({currentMonthlyPrice} DT/mois)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  Validation manuelle sécurisée
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  Zéro Commission
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveView('REGISTER')}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <span>Inscrire mon établissement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleTestCafe}
                  className="px-5 py-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Coffee className="w-4 h-4 text-amber-600" />
                  <span>Espace Café (Gérant)</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestClient}
                  className="px-5 py-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Scanner Table 7 (Client)</span>
                </button>
              </div>
            </div>

            {/* Right Interactive Mockup */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-lg space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80"
                      alt="Café El Medina"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Café El Medina</h2>
                      <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Service actif · Table 7
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">
                    {currentMonthlyPrice} DT / mois
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                  <div className="flex justify-between text-xs font-mono font-bold text-amber-600">
                    <span>#COMMANDE 1052</span>
                    <span className="text-slate-400">À l'instant</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span>1x Café direct</span>
                      <span className="font-mono">2.500 DT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1x Croissant au beurre</span>
                      <span className="font-mono">1.500 DT</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total :</span>
                    <span className="text-amber-600 font-mono">4.000 DT</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <button
                    onClick={handleTestClient}
                    className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    📱 Tester le Scan QR
                  </button>
                  <button
                    onClick={handleTestAdmin}
                    className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-medium transition-colors"
                  >
                    👑 Accès Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 6 Steps Process Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xs uppercase tracking-widest text-amber-600 font-bold">Processus</h2>
            <h3 className="text-2xl font-extrabold text-slate-900">Le fonctionnement simple en 6 étapes</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">1</span>
              <h4 className="text-sm font-bold text-slate-900">1. Inscription</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Le café s'inscrit en 2 minutes avec son nom, son numéro et son mot de passe.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">2</span>
              <h4 className="text-sm font-bold text-slate-900">2. Paiement D17</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Il transfère {currentMonthlyPrice} DT sur le D17 (96 281 735). L'admin valide et son compte s'ouvre aussitôt.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">3</span>
              <h4 className="text-sm font-bold text-slate-900">3. Menu & Tables</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Le gérant saisit ses produits en Dinars (DT) et imprime ses chevalets de tables.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">4</span>
              <h4 className="text-sm font-bold text-slate-900">4. Le client scanne</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Assis à table, le client scanne avec son smartphone et consulte la carte avec photos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">5</span>
              <h4 className="text-sm font-bold text-slate-900">5. Commande en direct</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                La commande retentit sur l'écran du café avec sonnette 🔔. Le serveur clique sur Accepter.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">6</span>
              <h4 className="text-sm font-bold text-slate-900">6. Service rapide</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Le personnel sert la table sans erreur de commande et encaisse en fin de repas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing simple */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Un tarif simple et transparent</h2>
          <div className="p-8 rounded-3xl bg-slate-50 border-2 border-amber-400 max-w-sm mx-auto shadow-md space-y-4">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Formule Tout-en-un</span>
            <div className="text-4xl font-extrabold font-mono text-amber-600">
              {currentMonthlyPrice} DT <span className="text-sm font-normal text-slate-500">/ mois</span>
            </div>
            <p className="text-xs text-slate-600">
              Payable simplement par <strong>D17</strong> vers le <strong>96 281 735</strong> ou en espèces.
            </p>
            <button
              onClick={() => setActiveView('REGISTER')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
            >
              Inscrire mon café
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
