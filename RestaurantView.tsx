import React, { useState } from 'react';
import { useApp, formatDT } from '../context/AppContext';
import { Order, PaymentMethod } from '../types';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { ReceiptTicketModal } from '../components/ReceiptTicketModal';
import {
  Bell,
  Coffee,
  Clock,
  CheckCircle,
  AlertTriangle,
  QrCode,
  UtensilsCrossed,
  Printer,
  Plus,
  Trash2,
  Settings,
  History,
  Check,
  Smartphone,
  Info,
  LogOut,
  Lock,
  Hourglass,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Pencil,
  Search,
  ExternalLink,
} from 'lucide-react';

interface MenuImagePreset {
  id: string;
  name: string;
  category: string;
  url: string;
}

const MENU_IMAGE_PRESETS: MenuImagePreset[] = [
  // Cafés & Thés
  {
    id: 'p-cafe-direct',
    name: 'Café direct / Capucin',
    category: 'Cafés',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-espresso',
    name: 'Café Express / Serré',
    category: 'Cafés',
    url: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-cappuccino',
    name: 'Cappuccino Mousseux',
    category: 'Cafés',
    url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-cafe-creme',
    name: 'Café Crème au Lait',
    category: 'Cafés',
    url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-the-menthe',
    name: 'Thé à la menthe aux pignons',
    category: 'Cafés',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-the-rouge',
    name: 'Thé rouge traditionnel',
    category: 'Cafés',
    url: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600&auto=format&fit=crop&q=80',
  },

  // Boissons
  {
    id: 'p-citronnade',
    name: 'Citronnade tunisienne fraîche',
    category: 'Boissons',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-jus-orange',
    name: 'Jus d’orange pressé frais',
    category: 'Boissons',
    url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-jus-fraise',
    name: 'Cocktail de fruits / Fraise',
    category: 'Boissons',
    url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-soda',
    name: 'Soda Canette / Boisson gazeuse',
    category: 'Boissons',
    url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-eau',
    name: 'Bouteille d’eau minérale',
    category: 'Boissons',
    url: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-mojito',
    name: 'Mojito menthe & citron',
    category: 'Boissons',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  },

  // Viennoiseries & Pâtisseries
  {
    id: 'p-croissant',
    name: 'Croissant pur beurre',
    category: 'Viennoiseries',
    url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-pain-choc',
    name: 'Pain au chocolat',
    category: 'Viennoiseries',
    url: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-millefeuille',
    name: 'Mille-feuille vanille',
    category: 'Viennoiseries',
    url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-donut',
    name: 'Donut glacé chocolat',
    category: 'Viennoiseries',
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
  },

  // Pizzas
  {
    id: 'p-margherita',
    name: 'Pizza Margherita',
    category: 'Pizzas',
    url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-4saisons',
    name: 'Pizza 4 Saisons / Thon',
    category: 'Pizzas',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-4fromages',
    name: 'Pizza 4 Fromages fondants',
    category: 'Pizzas',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-pepperoni',
    name: 'Pizza Pepperoni / Salami',
    category: 'Pizzas',
    url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80',
  },

  // Sandwichs & Plats
  {
    id: 'p-baguette-farcie',
    name: 'Baguette Farcie / Makloub',
    category: 'Plats',
    url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-burger',
    name: 'Burger Gourmet & frites',
    category: 'Plats',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-salade',
    name: 'Salade fraîche composée',
    category: 'Plats',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-frites',
    name: 'Portion de frites dorées',
    category: 'Plats',
    url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
  },

  // Desserts
  {
    id: 'p-cheesecake',
    name: 'Cheesecake framboise',
    category: 'Desserts',
    url: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-crepe',
    name: 'Crêpe chocolat noisette',
    category: 'Desserts',
    url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-gaufre',
    name: 'Gaufre gourmande chantilly',
    category: 'Desserts',
    url: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-tiramisu',
    name: 'Tiramisu traditionnel au café',
    category: 'Desserts',
    url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
  },
];

export const RestaurantView: React.FC = () => {
  const {
    currentBusiness,
    restaurantTab,
    setRestaurantTab,
    categories,
    products,
    tables,
    orders,
    waiterCalls,
    resolveWaiterCall,
    updateOrderStatus,
    toggleProductAvailability,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    addTable,
    deleteTable,
    requestSubscriptionRenewal,
    currentMonthlyPrice,
    setSelectedTableId,
    setActiveView,
    loggedRestaurantId,
    loginRestaurant,
    logoutRestaurant,
    confirmPayment,
    payments,
  } = useApp();

  // Local login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Modals & sub-states
  const [selectedOrderForTicket, setSelectedOrderForTicket] = useState<Order | null>(null);
  const [activeQrTableId, setActiveQrTableId] = useState<string>('table-7');

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(categories[0]?.id || 'cat-cafes');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('');
  const [selectedImageCategory, setSelectedImageCategory] = useState<string>('Tous');
  const [customImageUrlInput, setCustomImageUrlInput] = useState<string>('');

  const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
  const [newTableLabel, setNewTableLabel] = useState('');
  const [newTableZone, setNewTableZone] = useState('Intérieur');

  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = loginRestaurant(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Erreur d’identification.');
    }
  };

  // Quick Demo Login helper
  const handleQuickDemoLogin = (email: string) => {
    loginRestaurant(email, 'password123');
  };

  // 1. If not logged in -> Show Clean Restaurant Auth Interface
  if (!loggedRestaurantId || !currentBusiness) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center text-slate-800">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold mx-auto shadow-xs">
              <Coffee className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Espace Café & Restaurant
            </h1>
            <p className="text-xs text-slate-500">
              Connectez-vous pour gérer vos commandes en direct, votre menu et vos tables.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Adresse Email du Café
              </label>
              <input
                type="email"
                required
                placeholder="cafe@medina.tn"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-amber-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-amber-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Se connecter à mon établissement
            </button>
          </form>

          {/* Quick Demo Pre-fill */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] text-slate-600 block text-center font-medium">
              Accès démo en 1 clic :
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('cafe@medina.tn')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs text-left transition-colors flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80"
                  alt="Café"
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate text-[11px]">Café El Medina</div>
                  <span className="text-[9px] text-emerald-600 font-medium block">☕ Café</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('roma@marsa.tn')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs text-left transition-colors flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80"
                  alt="Resto"
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate text-[11px]">Restaurant Roma</div>
                  <span className="text-[9px] text-emerald-600 font-medium block">🍽️ Restaurant</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('pizzahouse@ariana.tn')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs text-left transition-colors flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80"
                  alt="Pizzeria"
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate text-[11px]">Pizza House</div>
                  <span className="text-[9px] text-emerald-600 font-medium block">🍕 Pizzeria</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('bongout@sousse.tn')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs text-left transition-colors flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200&auto=format&fit=crop&q=80"
                  alt="Salon de thé"
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate text-[11px]">Le Bon Goût</div>
                  <span className="text-[9px] text-amber-700 font-medium block">🫖 Salon de Thé</span>
                </div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setActiveView('REGISTER')}
              className="text-xs text-amber-600 hover:underline font-semibold"
            >
              Nouveau café ? Créez votre compte ici ({currentMonthlyPrice} DT/mois) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. If logged in BUT account is PENDING_PAYMENT -> Dedicated waiting screen requested by user!
  if (currentBusiness.status === 'PENDING_PAYMENT') {
    const pendingPaymentObj = payments.find(
      (p) => p.businessId === currentBusiness.id && p.status === 'PENDING'
    );

    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center text-slate-800">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto animate-pulse">
            <Hourglass className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs uppercase tracking-wider">
              En attente d'activation
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {currentBusiness.name}
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Votre compte a été enregistré avec succès ! L'accès à votre tableau de bord et à vos commandes QR sera débloqué dès validation de votre paiement par l'administrateur SAAD DIGITAL.
            </p>
          </div>

          {/* D17 Payment Box */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-left space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Instructions de règlement D17 :</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Effectuez le transfert de votre abonnement mensuel de <strong className="text-slate-900">{currentMonthlyPrice} DT</strong> via l'application D17 :
            </p>
            <div className="p-3 bg-white rounded-xl border border-amber-200 text-center font-mono">
              <div className="text-xs text-slate-500">Numéro D17 :</div>
              <div className="text-xl font-black text-amber-600 tracking-wider">96 281 735</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Ahmed Saad (SAAD DIGITAL)</div>
            </div>
            {pendingPaymentObj && (
              <div className="text-[11px] text-slate-500 pt-1">
                Référence enregistrée : <span className="font-mono text-slate-800 font-bold">{pendingPaymentObj.referenceNumber}</span>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            {/* Simulation button to activate right now */}
            {pendingPaymentObj && (
              <button
                type="button"
                onClick={() => confirmPayment(pendingPaymentObj.id)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>(Démo) Activer mon compte immédiatement</span>
              </button>
            )}

            <button
              type="button"
              onClick={logoutRestaurant}
              className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Logged in and ACTIVE -> Show clean light dashboard
  const newOrders = orders.filter((o) => o.status === 'NEW');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  const todayRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((acc, curr) => acc + curr.total, 0);

  const selectedTableObj = tables.find((t) => t.id === activeQrTableId) || tables[0];

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdCategory(categories[0]?.id || 'cat-cafes');
    setNewProdDescription('');
    setNewProdImage('');
    setNewProdBadge('');
    setSelectedImageCategory('Tous');
    setCustomImageUrlInput('');
    setIsAddProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: any) => {
    setEditingProductId(prod.id);
    setNewProdName(prod.name);
    setNewProdPrice(prod.price.toString());
    setNewProdCategory(prod.categoryId);
    setNewProdDescription(prod.description || '');
    setNewProdImage(prod.image);
    setNewProdBadge(prod.badge || '');
    setSelectedImageCategory('Tous');
    setCustomImageUrlInput('');
    setIsAddProductModalOpen(true);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newProdPrice);
    if (!newProdName.trim() || isNaN(priceNum)) return;

    const defaultFallbackImg =
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80';
    const finalImage = newProdImage || defaultFallbackImg;

    if (editingProductId) {
      updateProduct(editingProductId, {
        categoryId: newProdCategory,
        name: newProdName,
        description: newProdDescription || 'Préparé frais à la commande.',
        price: priceNum,
        image: finalImage,
        badge: newProdBadge || undefined,
      });
    } else {
      addProduct({
        businessId: currentBusiness.id,
        categoryId: newProdCategory,
        name: newProdName,
        description: newProdDescription || 'Préparé frais à la commande.',
        price: priceNum,
        image: finalImage,
        isAvailable: true,
        badge: newProdBadge || undefined,
        prepTimeMinutes: 5,
      });
    }

    setIsAddProductModalOpen(false);
    setEditingProductId(null);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDescription('');
    setNewProdImage('');
    setNewProdBadge('');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (typeof uploadEvent.target?.result === 'string') {
        setNewProdImage(uploadEvent.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: MenuImagePreset) => {
    setNewProdImage(preset.url);
    if (!newProdName.trim() || !editingProductId) {
      setNewProdName(preset.name.split('/')[0].trim());
      // Suggest category matching preset
      const match = categories.find((c) =>
        c.name.toLowerCase().includes(preset.category.toLowerCase().slice(0, 4))
      );
      if (match) {
        setNewProdCategory(match.id);
      }
    }
  };

  const handleApplyCustomUrl = () => {
    if (customImageUrlInput.trim()) {
      setNewProdImage(customImageUrlInput.trim());
      setCustomImageUrlInput('');
    }
  };

  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableLabel.trim()) return;
    addTable(newTableLabel, newTableZone);
    setIsAddTableModalOpen(false);
    setNewTableLabel('');
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName, 'Utensils');
    setIsAddCategoryModalOpen(false);
    setNewCatName('');
  };

  const handleTestTableClient = (tableId: string) => {
    setSelectedTableId(tableId);
    setActiveView('CLIENT');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100 shadow-xs">
              {currentBusiness.logo && (currentBusiness.logo.startsWith('http') || currentBusiness.logo.startsWith('/')) ? (
                <img
                  src={currentBusiness.logo}
                  alt={currentBusiness.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl bg-amber-50 text-amber-700 font-bold">
                  {currentBusiness.logo || '☕'}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {currentBusiness.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Abonnement ACTIF
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {currentBusiness.address} · {currentBusiness.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTestTableClient('table-7')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Tester Menu Table 7</span>
            </button>

            <button
              onClick={logoutRestaurant}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation in Light Mode */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-slate-100 text-xs font-semibold">
          <button
            onClick={() => setRestaurantTab('orders')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors relative ${
              restaurantTab === 'orders'
                ? 'border-amber-500 text-amber-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Commandes en direct</span>
            {newOrders.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full leading-tight">
                {newOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setRestaurantTab('menu')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              restaurantTab === 'menu'
                ? 'border-amber-500 text-amber-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Menu & Produits ({products.length})</span>
          </button>

          <button
            onClick={() => setRestaurantTab('tables')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              restaurantTab === 'tables'
                ? 'border-amber-500 text-amber-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Tables & QR Codes ({tables.length})</span>
          </button>

          <button
            onClick={() => setRestaurantTab('history')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              restaurantTab === 'history'
                ? 'border-amber-500 text-amber-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historique ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Waiter Calls Banner */}
        {waiterCalls.length > 0 && (
          <div className="space-y-2">
            {waiterCalls.map((call) => (
              <div
                key={call.id}
                className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
                    🔔
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-amber-900">
                      APPEL SERVEUR : {call.tableLabel}
                    </h3>
                    <p className="text-[11px] text-amber-700">
                      {call.type === 'CALL_WAITER'
                        ? 'Le client souhaite un serveur à sa table.'
                        : 'Le client demande l’addition.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => resolveWaiterCall(call.id)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Acquitter
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB: ORDERS (LIVE KDS) */}
        {restaurantTab === 'orders' && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900">
                  Commandes reçues en temps réel
                </h2>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-600">
                  Nouvelles : <strong className="text-amber-600">{newOrders.length}</strong>
                </span>
                <span className="text-slate-600">
                  En préparation : <strong className="text-blue-600">{preparingOrders.length}</strong>
                </span>
                <span className="text-slate-600">
                  Prêtes : <strong className="text-emerald-600">{readyOrders.length}</strong>
                </span>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* NOUVELLES */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center justify-between border-b border-amber-200 pb-2">
                  <span>Nouvelles commandes</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono font-bold">
                    {newOrders.length}
                  </span>
                </h3>

                {newOrders.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                    Aucune commande en attente.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white border-2 border-amber-400 rounded-2xl p-4 shadow-sm space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-xs font-bold text-amber-600">
                              #{ord.orderNumber}
                            </span>
                            <h4 className="text-base font-extrabold text-slate-900">
                              🪑 {ord.tableLabel}
                            </h4>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                          {ord.items.map((it) => (
                            <div key={it.id} className="flex justify-between items-center text-slate-800">
                              <span>
                                <strong className="text-amber-700">{it.quantity}x</strong> {it.productName}
                              </span>
                              <span className="font-mono text-slate-500">{formatDT(it.subtotal)}</span>
                            </div>
                          ))}
                        </div>

                        {ord.customerNote && (
                          <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                            <strong>Note :</strong> {ord.customerNote}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-1 font-bold text-xs">
                          <span className="text-slate-500">Total :</span>
                          <span className="font-mono text-slate-900 text-sm">{formatDT(ord.total)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'PREPARING')}
                            className="py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accepter</span>
                          </button>
                          <button
                            onClick={() => setSelectedOrderForTicket(ord)}
                            className="py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-500" />
                            <span>Ticket</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* EN PRÉPARATION */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center justify-between border-b border-blue-200 pb-2">
                  <span>En préparation</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono font-bold">
                    {preparingOrders.length}
                  </span>
                </h3>

                {preparingOrders.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                    Aucune préparation en cours.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {preparingOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-xs font-bold text-blue-600">
                              #{ord.orderNumber}
                            </span>
                            <h4 className="text-base font-extrabold text-slate-900">
                              🪑 {ord.tableLabel}
                            </h4>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                          {ord.items.map((it) => (
                            <div key={it.id} className="flex justify-between items-center text-slate-800">
                              <span>
                                <strong className="text-blue-600">{it.quantity}x</strong> {it.productName}
                              </span>
                              <span className="font-mono text-slate-500">{formatDT(it.subtotal)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-1 font-bold text-xs">
                          <span className="text-slate-500">Total :</span>
                          <span className="font-mono text-slate-900 text-sm">{formatDT(ord.total)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'READY')}
                            className="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Prête !</span>
                          </button>
                          <button
                            onClick={() => setSelectedOrderForTicket(ord)}
                            className="py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-500" />
                            <span>Ticket</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PRÊTES */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center justify-between border-b border-emerald-200 pb-2">
                  <span>Prêtes à servir</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                    {readyOrders.length}
                  </span>
                </h3>

                {readyOrders.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                    Aucune commande en attente de service.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {readyOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white border border-emerald-300 rounded-2xl p-4 shadow-sm space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-xs font-bold text-emerald-600">
                              #{ord.orderNumber}
                            </span>
                            <h4 className="text-base font-extrabold text-slate-900">
                              🪑 {ord.tableLabel}
                            </h4>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                          {ord.items.map((it) => (
                            <div key={it.id} className="flex justify-between items-center text-slate-800">
                              <span>
                                <strong className="text-emerald-700">{it.quantity}x</strong> {it.productName}
                              </span>
                              <span className="font-mono text-slate-500">{formatDT(it.subtotal)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-1 font-bold text-xs">
                          <span className="text-slate-500">Total :</span>
                          <span className="font-mono text-slate-900 text-sm">{formatDT(ord.total)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'COMPLETED')}
                            className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Servie / Clôturer</span>
                          </button>
                          <button
                            onClick={() => setSelectedOrderForTicket(ord)}
                            className="py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-500" />
                            <span>Ticket</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: MENU & PRODUCTS */}
        {restaurantTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Carte & Menu Digital</h3>
                <p className="text-xs text-slate-500">Gérez les prix en Dinars (DT) et la disponibilité instantanée.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  + Catégorie
                </button>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Ajouter un produit</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Produit</th>
                    <th className="py-3 px-4">Catégorie</th>
                    <th className="py-3 px-4">Prix</th>
                    <th className="py-3 px-4 text-center">Disponibilité</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((prod) => {
                    const cat = categories.find((c) => c.id === prod.categoryId);
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 bg-slate-100"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{prod.name}</div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{prod.description}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{cat?.name || 'Général'}</td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-700 text-sm">
                          {formatDT(prod.price)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleProductAvailability(prod.id)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
                              prod.isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {prod.isAvailable ? 'Disponible' : 'Épuisé'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Modifier produit et photo"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer ${prod.name} ?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: TABLES & QR */}
        {restaurantTab === 'tables' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tables & Chevalets QR</h3>
                <p className="text-xs text-slate-500">Chaque table possède son QR unique prêt à être imprimé.</p>
              </div>

              <button
                onClick={() => setIsAddTableModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Ajouter une table</span>
              </button>
            </div>

            <div className="grid lg:grid-cols-12 gap-6 items-start">
              {/* Tables Table */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Table</th>
                      <th className="py-3 px-4">Zone</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-center">QR Code</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tables.map((tbl) => (
                      <tr
                        key={tbl.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          activeQrTableId === tbl.id ? 'bg-amber-50/50' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-slate-900">{tbl.label}</td>
                        <td className="py-3 px-4 text-slate-600">{tbl.zone || 'Intérieur'}</td>
                        <td className="py-3 px-4">
                          {tbl.status === 'FREE' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              Libre
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                              En cours
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setActiveQrTableId(tbl.id)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs"
                          >
                            Afficher
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleTestTableClient(tbl.id)}
                            className="px-2.5 py-1 bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 rounded font-semibold text-[11px]"
                          >
                            Tester
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* QR Stand Preview */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="text-center">
                  <h4 className="text-sm font-bold text-slate-900">Chevalet de table</h4>
                  <p className="text-xs text-slate-500">Prêt pour impression et support de table</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-center">
                  <QRCodeDisplay
                    value={`https://saad-digital.tn/order?b=${currentBusiness.slug}&t=${selectedTableObj.id}`}
                    size={160}
                    label={selectedTableObj.label}
                    businessName={currentBusiness.name}
                    showActions={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HISTORY */}
        {restaurantTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Historique des Commandes</h3>
                <p className="text-xs text-slate-500">Journal de toutes les commandes enregistrées</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Total recettes :</span>
                <div className="text-lg font-bold font-mono text-amber-700">
                  {formatDT(todayRevenue)}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">#</th>
                    <th className="py-2.5 px-4">Table</th>
                    <th className="py-2.5 px-4">Articles</th>
                    <th className="py-2.5 px-4">Total</th>
                    <th className="py-2.5 px-4">Statut</th>
                    <th className="py-2.5 px-4 text-right">Ticket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">#{ord.orderNumber}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{ord.tableLabel}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{formatDT(ord.total)}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrderForTicket(ord)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selectedOrderForTicket && (
        <ReceiptTicketModal
          order={selectedOrderForTicket}
          business={currentBusiness}
          onClose={() => setSelectedOrderForTicket(null)}
        />
      )}

      {/* Modals for Add / Edit Product */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                  {editingProductId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingProductId ? 'Modifier le produit du menu' : 'Ajouter un produit au menu'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {editingProductId
                      ? 'Changez le prix, la description ou la photo de ce produit.'
                      : 'Choisissez une photo de menu, fixez le prix en DT et publiez immédiatement.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Fermer ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Café direct ou Croissant pur beurre"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 text-sm focus:outline-hidden focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Catégorie *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Prix unitaire (en DT) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      placeholder="2.500"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold text-sm focus:outline-hidden focus:border-amber-500 pr-10"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 font-mono">
                      DT
                    </span>
                  </div>
                </div>
              </div>

              {/* CASE AVEC IMAGES DU MENU (Section demandée par l'utilisateur) */}
              <div className="border-2 border-amber-300/80 rounded-2xl p-3.5 bg-amber-50/20 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </div>
                    <label className="block text-slate-800 font-bold text-xs">
                      Case Photos du Menu (Sélectionnez une image) :
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    {newProdImage && (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Photo sélectionnée
                      </span>
                    )}
                    <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-colors shadow-2xs">
                      <Upload className="w-3 h-3 text-amber-600" />
                      <span>📁 Mon fichier</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Category filter tabs for menu images */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                  {['Tous', 'Cafés', 'Boissons', 'Viennoiseries', 'Pizzas', 'Plats', 'Desserts'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedImageCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        selectedImageCategory === cat
                          ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid of Menu Photos */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-52 overflow-y-auto pr-1">
                  {MENU_IMAGE_PRESETS.filter((p) =>
                    selectedImageCategory === 'Tous' ? true : p.category === selectedImageCategory
                  ).map((preset) => {
                    const isSelected = newProdImage === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`relative group rounded-xl overflow-hidden border-2 text-left transition-all aspect-square bg-slate-100 shadow-2xs ${
                          isSelected
                            ? 'border-amber-500 ring-3 ring-amber-500/30 scale-95'
                            : 'border-slate-200 hover:border-amber-400 hover:shadow-xs'
                        }`}
                        title={`Choisir : ${preset.name}`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-1">
                          <span className="text-[9px] font-bold text-white line-clamp-1 leading-tight">
                            {preset.name.split('/')[0]}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom URL Option & Selected Image Preview */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex-1 min-w-[200px] flex items-center gap-1.5">
                    <input
                      type="url"
                      placeholder="Ou collez l'URL d'une image web (https://...)"
                      value={customImageUrlInput}
                      onChange={(e) => setCustomImageUrlInput(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-[11px] text-slate-800 focus:outline-hidden focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      disabled={!customImageUrlInput.trim()}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold text-[11px] transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>

                  {newProdImage && (
                    <button
                      type="button"
                      onClick={() => setNewProdImage('')}
                      className="text-[10px] text-rose-600 hover:underline font-semibold"
                    >
                      Effacer la photo choisie
                    </button>
                  )}
                </div>

                {/* Live Card Preview */}
                {newProdImage && (
                  <div className="bg-white rounded-xl p-2.5 border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={newProdImage}
                        alt="Aperçu sélectionné"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-100"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                          Aperçu carte client
                        </span>
                        <h5 className="text-xs font-extrabold text-slate-900 truncate">
                          {newProdName || 'Nom du produit'}
                        </h5>
                        <p className="text-[11px] font-mono font-bold text-slate-700">
                          {newProdPrice ? `${newProdPrice} DT` : 'Prix DT'}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
                      ✓ Image prête
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Description / Ingrédients (optionnelle)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Préparé avec du lait frais entier et café torréfié..."
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {editingProductId ? 'Mettre à jour le produit' : 'Enregistrer le produit au menu'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Table */}
      {isAddTableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Ajouter une table</h3>
            <form onSubmit={handleCreateTable} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Numéro ou Nom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Table 11 ou Terrasse 3"
                  value={newTableLabel}
                  onChange={(e) => setNewTableLabel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                >
                  Créer la table
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddTableModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Category */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Nouvelle catégorie</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jus & Cocktails"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                >
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
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
