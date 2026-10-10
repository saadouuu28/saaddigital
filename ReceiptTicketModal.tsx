import React from 'react';
import { Order, Business } from '../types';
import { formatDT } from '../context/AppContext';
import { Printer, X } from 'lucide-react';

interface ReceiptTicketModalProps {
  order: Order;
  business: Business;
  onClose: () => void;
}

export const ReceiptTicketModal: React.FC<ReceiptTicketModalProps> = ({ order, business, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-neutral-900 rounded-xl shadow-2xl max-w-sm w-full p-6 relative border border-neutral-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Ticket Receipt Content */}
        <div id="thermal-receipt" className="font-mono text-xs leading-relaxed">
          <div className="text-center pb-3 border-b border-dashed border-neutral-400 mb-3">
            <h2 className="text-base font-bold tracking-tight uppercase">{business.name}</h2>
            <p className="text-[11px] text-neutral-600">{business.address}</p>
            <p className="text-[11px] text-neutral-600">Tél: {business.phone}</p>
            <div className="mt-2 inline-block bg-neutral-900 text-white font-bold px-3 py-1 rounded text-sm">
              {order.tableLabel}
            </div>
          </div>

          <div className="flex justify-between text-[11px] text-neutral-600 mb-3 pb-2 border-b border-dashed border-neutral-300">
            <span>COMMANDE #{order.orderNumber}</span>
            <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Items */}
          <div className="space-y-2 mb-3 pb-3 border-b border-dashed border-neutral-400">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                  <div className="font-semibold text-neutral-900">
                    {item.quantity}x {item.productName}
                  </div>
                  {item.note && (
                    <div className="text-[10px] text-amber-700 italic pl-2">↳ {item.note}</div>
                  )}
                </div>
                <div className="text-right tabular-nums font-semibold whitespace-nowrap">
                  {formatDT(item.subtotal)}
                </div>
              </div>
            ))}
          </div>

          {order.customerNote && (
            <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3 text-[11px] text-amber-900">
              <span className="font-bold">NOTE CLIENT:</span> {order.customerNote}
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center text-sm font-bold border-b border-neutral-900 pb-2 mb-3">
            <span>TOTAL À PAYER:</span>
            <span className="tabular-nums text-base">{formatDT(order.total)}</span>
          </div>

          <div className="text-center text-[10px] text-neutral-500 pt-1">
            <p>Commande passée via MyMenuQR</p>
            <p>Merci pour votre visite !</p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 text-white font-medium text-xs rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            Imprimer Ticket
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 border border-neutral-300 text-neutral-700 font-medium text-xs rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
