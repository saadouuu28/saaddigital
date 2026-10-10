import React, { useState } from 'react';
import { useApp, getDefaultBusinessPhoto } from '../context/AppContext';
import { BusinessType, PaymentMethod } from '../types';
import {
  Building,
  CreditCard,
  ArrowRight,
  Coffee,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const RegisterView: React.FC = () => {
  const { addBusiness, currentMonthlyPrice, setActiveView, setSelectedBusinessId, loginRestaurant } = useApp();

  const [bizName, setBizName] = useState('');
  const [bizType, setBizType] = useState<BusinessType>('CAFE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+216 ');
  const [address, setAddress] = useState('Tunis');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('D17');
  const [d17Ref, setD17Ref] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim() || !email.trim() || !password.trim()) return;

    const slug = bizName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const createdBiz = addBusiness({
      slug,
      ownerId: `owner-${Date.now()}`,
      name: bizName,
      email: email.trim().toLowerCase(),
      password,
      type: bizType,
      address: address || 'Tunis, Tunisie',
      phone: phone || '+216 96 281 735',
      logo: getDefaultBusinessPhoto(bizType),
      coverImage: getDefaultBusinessPhoto(bizType),
      status: 'PENDING_PAYMENT', // Inscription en attente d'activation par l'admin !
      currency: 'DT',
      welcomeMessage: `Bienvenue chez ${bizName} !`,
      subscriptionPrice: currentMonthlyPrice,
      subscriptionExpiresAt: expiresAt,
      paymentMethod,
    });

    // Auto login into this newly created business to show the dedicated waiting screen
    loginRestaurant(email.trim().toLowerCase(), password);
    setSelectedBusinessId(createdBiz.id);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center text-slate-800">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-900">Compte enregistré !</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Votre établissement <strong>{bizName}</strong> a été créé. Pour débloquer l'accès, effectuez le paiement de {currentMonthlyPrice} DT sur le D17 <strong>96 281 735</strong>.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setActiveView('RESTAURANT')}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Voir l'écran d'attente d'activation →
            </button>

            <button
              onClick={() => setActiveView('ADMIN')}
              className="w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs rounded-xl"
            >
              (Démo) Ouvrir l'Admin pour activer ce compte
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 text-slate-800">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <Building className="w-3.5 h-3.5 text-amber-600" />
            <span>Nouveau Café / Restaurant</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Inscription Établissement
          </h1>
          <p className="text-xs text-slate-500">
            Abonnement à <strong>{currentMonthlyPrice} DT / mois</strong> (Paiement D17 postal).
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Nom de l'établissement *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Café El Medina"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Type d'activité</label>
                <div className="flex items-center gap-2">
                  <select
                    value={bizType}
                    onChange={(e) => setBizType(e.target.value as BusinessType)}
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="CAFE">☕ Café</option>
                    <option value="TEA_SALON">🫖 Salon de thé</option>
                    <option value="RESTAURANT">🍽️ Restaurant</option>
                    <option value="PIZZERIA">🍕 Pizzeria</option>
                  </select>
                  <img
                    src={getDefaultBusinessPhoto(bizType)}
                    alt={bizType}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                    title={`Aperçu photo réelle : ${bizType}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Téléphone gérant *</label>
                <input
                  type="text"
                  required
                  placeholder="+216 98 000 000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Email & Password for login */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Email de connexion *
                </label>
                <input
                  type="email"
                  required
                  placeholder="contact@cafe.tn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900"
                />
              </div>
            </div>

            {/* D17 Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Modalités de paiement de l'abonnement :</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Transférez <strong>{currentMonthlyPrice} DT</strong> via D17 au <span className="font-mono font-bold text-slate-900">96 281 735</span> (Ahmed Saad). L'admin activera votre compte dès réception.
              </p>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Référence de transaction D17 (ou remarque)
              </label>
              <input
                type="text"
                placeholder="Ex: D17-TX-123456 ou 'Transfert effectué'"
                value={d17Ref}
                onChange={(e) => setD17Ref(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Créer mon compte (En attente d'activation)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
