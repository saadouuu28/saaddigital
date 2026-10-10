import React, { useState } from 'react';
import { useApp, formatDT } from '../context/AppContext';
import { Product } from '../types';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Coffee,
  X,
  Smartphone,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export const ClientOrderView: React.FC = () => {
  const {
    currentBusiness,
    categories,
    products,
    tables,
    selectedTableId,
    setSelectedTableId,
    placeOrder,
    sendWaiterCall,
    orders,
    latestClientOrderId,
  } = useApp();

  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Pre-fill demo cart with "Café direct" + "Croissant" as described in the user's brief
  const [cart, setCart] = useState<{ [productId: string]: number }>({
    'prod-1': 1,
    'prod-8': 1,
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerNote, setCustomerNote] = useState('');
  const [waiterCallFeedback, setWaiterCallFeedback] = useState<string | null>(null);

  const currentTable = tables.find((t) => t.id === selectedTableId) || tables[0] || {
    id: 'table-7',
    label: 'Table 7',
    number: '7',
  };

  const isBusinessBlocked =
    currentBusiness?.status === 'EXPIRED' || currentBusiness?.status === 'SUSPENDED';

  const activeOrder = orders.find((o) => o.id === latestClientOrderId);

  const filteredProducts = products.filter((p) => {
    if (!p.isAvailable) return false;
    if (activeCategory === 'ALL') return true;
    return p.categoryId === activeCategory;
  });

  const cartItems = Object.entries(cart)
    .map(([prodId, qty]) => {
      const prod = products.find((p) => p.id === prodId);
      if (!prod || qty <= 0) return null;
      return {
        product: prod,
        quantity: qty,
        subtotal: prod.price * qty,
      };
    })
    .filter(Boolean) as { product: Product; quantity: number; subtotal: number }[];

  const cartTotal = cartItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  const cartItemCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleAddToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [productId]: current - 1,
      };
    });
  };

  const handleConfirmOrder = () => {
    if (cartItems.length === 0 || !currentBusiness) return;

    placeOrder(
      currentBusiness.id,
      currentTable.id,
      cartItems.map((ci) => ({ product: ci.product, quantity: ci.quantity })),
      customerNote
    );

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      console.warn('Confetti unavailable');
    }

    setCart({});
    setIsCartOpen(false);
  };

  const handleCallWaiter = (type: 'CALL_WAITER' | 'REQUEST_BILL') => {
    if (!currentBusiness) return;
    sendWaiterCall(currentBusiness.id, currentTable.id, type);
    const msg =
      type === 'CALL_WAITER'
        ? '🔔 Un serveur a été prévenu et arrive à votre table !'
        : '💳 Votre addition a été demandée, le serveur arrive.';
    setWaiterCallFeedback(msg);
    setTimeout(() => setWaiterCallFeedback(null), 4000);
  };

  const mobileContent = (
    <div className="flex flex-col min-h-full bg-slate-50 text-slate-800 select-none relative font-sans">
      {/* Real Establishment Photo Cover Header */}
      <div className="relative h-32 w-full overflow-hidden bg-slate-900 shrink-0">
        <img
          src={
            currentBusiness?.coverImage ||
            currentBusiness?.logo ||
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1000&auto=format&fit=crop&q=80'
          }
          alt={currentBusiness?.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-black/20" />

        {/* Floating Table Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm border border-white/50">
          <span>🪑</span>
          <select
            aria-label="Table"
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(e.target.value)}
            className="bg-transparent text-slate-900 font-bold focus:outline-hidden text-xs cursor-pointer"
          >
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Establishment Brand Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3 text-white">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/90 shadow-md shrink-0 bg-white">
            <img
              src={
                currentBusiness?.logo ||
                'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80'
              }
              alt={currentBusiness?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-extrabold text-white leading-tight drop-shadow-sm truncate">
              {currentBusiness?.name || 'Café El Medina'}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-200 mt-0.5">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Service Ouvert
              </span>
              <span>·</span>
              <span className="truncate text-slate-300">{currentBusiness?.address}</span>
            </div>
          </div>
        </div>
      </div>

      {isBusinessBlocked ? (
        <div className="p-8 text-center space-y-3 bg-white m-4 rounded-2xl border border-slate-200">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">Service temporairement suspendu</h3>
          <p className="text-xs text-slate-500">
            Le menu digital de cet établissement est en attente de renouvellement.
          </p>
        </div>
      ) : (
        <>
          {/* Active Live Order Tracker Banner */}
          {activeOrder && activeOrder.status !== 'COMPLETED' && (
            <div className="m-3 p-3.5 rounded-2xl bg-white border-2 border-amber-300 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-amber-700">
                  Commande #{activeOrder.orderNumber}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {currentTable.label}
                </span>
              </div>

              {/* Status Stepper in Light Mode */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[10px] font-semibold">
                <div
                  className={`p-1.5 rounded-lg ${
                    activeOrder.status === 'NEW'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  🟠 Reçue
                </div>
                <div
                  className={`p-1.5 rounded-lg ${
                    activeOrder.status === 'PREPARING'
                      ? 'bg-blue-600 text-white font-bold animate-pulse'
                      : activeOrder.status === 'READY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  🟡 En cuisine
                </div>
                <div
                  className={`p-1.5 rounded-lg ${
                    activeOrder.status === 'READY'
                      ? 'bg-emerald-600 text-white font-bold animate-bounce'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  🟢 Prête !
                </div>
              </div>

              <div className="text-[11px] text-slate-600 flex justify-between items-center pt-1 border-t border-slate-100">
                <span>{activeOrder.items.length} article(s) · {formatDT(activeOrder.total)}</span>
                <span className="text-amber-700 font-semibold">
                  {activeOrder.status === 'NEW' && 'Transmise au serveur'}
                  {activeOrder.status === 'PREPARING' && 'En cours de préparation...'}
                  {activeOrder.status === 'READY' && 'Votre commande arrive !'}
                </span>
              </div>
            </div>
          )}

          {/* Feedback banner */}
          {waiterCallFeedback && (
            <div className="mx-3 mt-2 p-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold text-center shadow-xs">
              {waiterCallFeedback}
            </div>
          )}

          {/* Category Horizontal Scroll Tab Bar */}
          <div className="sticky top-[89px] z-20 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
              }`}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products List in Light Mode */}
          <div className="flex-1 p-3 space-y-3 pb-28">
            {filteredProducts.map((prod) => {
              const qtyInCart = cart[prod.id] || 0;
              return (
                <div
                  key={prod.id}
                  className="bg-white border border-slate-200 rounded-2xl p-3 flex gap-3 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="relative shrink-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-cover rounded-xl bg-slate-100 border border-slate-200"
                    />
                    {prod.badge && (
                      <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono font-bold text-amber-700 text-xs">
                        {formatDT(prod.price)}
                      </span>

                      {qtyInCart > 0 ? (
                        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(prod.id)}
                            className="p-1 text-slate-600 hover:text-slate-900 active:scale-90"
                            aria-label="Diminuer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-slate-900 font-mono px-1">
                            {qtyInCart}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(prod.id)}
                            className="p-1 text-amber-700 hover:text-amber-600 active:scale-90"
                            aria-label="Augmenter"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(prod.id)}
                          className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3 text-amber-600" />
                          <span>Ajouter</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Assistance Actions (Call Waiter / Ask Bill) */}
          <div className="fixed bottom-20 left-0 right-0 max-w-sm sm:max-w-md mx-auto px-4 pointer-events-none z-30">
            <div className="flex gap-2 pointer-events-auto">
              <button
                onClick={() => handleCallWaiter('CALL_WAITER')}
                className="flex-1 py-1.5 px-3 bg-white/95 backdrop-blur-md border border-slate-300 text-slate-700 text-[11px] font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>🔔 Appeler serveur</span>
              </button>
              <button
                onClick={() => handleCallWaiter('REQUEST_BILL')}
                className="flex-1 py-1.5 px-3 bg-white/95 backdrop-blur-md border border-slate-300 text-slate-700 text-[11px] font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>💳 Demander l'addition</span>
              </button>
            </div>
          </div>

          {/* Floating Cart Button */}
          {cartItemCount > 0 && (
            <div className="fixed bottom-4 left-0 right-0 max-w-sm sm:max-w-md mx-auto px-4 z-40">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="w-full py-3.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-between active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center font-mono text-[11px]">
                    {cartItemCount}
                  </div>
                  <span>Voir mon panier</span>
                </div>
                <div className="font-mono text-sm">
                  {formatDT(cartTotal)} →
                </div>
              </button>
            </div>
          )}
        </>
      )}

      {/* Cart Drawer in Light Mode */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl max-w-sm sm:max-w-md w-full p-5 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span>Mon Panier</span>
                </h3>
                <p className="text-[11px] text-slate-500">{currentTable.label} · {currentBusiness?.name}</p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-1 overflow-y-auto space-y-2.5 py-1 text-xs">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                >
                  <div className="flex-1 pr-2">
                    <div className="font-bold text-slate-900">{item.product.name}</div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {formatDT(item.product.price)} / unité
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="p-1 rounded bg-white border border-slate-200 text-slate-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-slate-900 px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleAddToCart(item.product.id)}
                      className="p-1 rounded bg-white border border-slate-200 text-amber-700"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-amber-700 ml-2 min-w-[65px] text-right">
                      {formatDT(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">
                  Instructions particulières (sans sucre, bien cuit...)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Café direct bien chaud, sans sucre..."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            {/* Total & Confirmation */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-600">TOTAL À PAYER :</span>
                <span className="font-mono text-base text-amber-700">
                  {formatDT(cartTotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>CONFIRMER LA COMMANDE</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-400">
                Règlement en espèces ou D17 directement au serveur en fin de repas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-3 flex flex-col items-center">
      {/* Simulation Bar */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between text-xs text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs">
        <span className="flex items-center gap-1.5 font-medium text-slate-800">
          <Smartphone className="w-3.5 h-3.5 text-amber-600" />
          <span>Aperçu Client Smartphone · Table 7</span>
        </span>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="text-amber-700 hover:underline font-semibold text-[11px]"
        >
          {isPhoneFrame ? 'Mode Plein Écran' : 'Mode Smartphone'}
        </button>
      </div>

      {isPhoneFrame ? (
        <div className="relative w-full max-w-[390px] h-[780px] bg-white border-[10px] border-slate-800 rounded-[48px] shadow-2xl overflow-hidden flex flex-col">
          {/* Top Speaker notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-40 flex items-center justify-center">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto pt-5">
            {mobileContent}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl min-h-[700px] border border-slate-200 rounded-3xl overflow-hidden shadow-xl bg-white">
          {mobileContent}
        </div>
      )}
    </div>
  );
};
