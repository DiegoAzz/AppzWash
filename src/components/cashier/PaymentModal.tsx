'use client';

import React, { useState } from 'react';
import { WashOrder, PaymentMethod } from '@/lib/types';
import { useApp } from '@/lib/app-context';
import { X, DollarSign, CreditCard, Smartphone, CheckCircle, Plus } from 'lucide-react';

interface PaymentModalProps {
  order: WashOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (order: WashOrder) => void;
}

export function PaymentModal({ order, isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const { payOrder, storeProducts } = useApp();
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [reference, setReference] = useState('');
  const [extraItems, setExtraItems] = useState<{ id: string; name: string; price: number }[]>([]);

  if (!isOpen || !order) return null;

  const extraTotal = extraItems.reduce((acc, i) => acc + i.price, 0);
  const finalTotal = order.totalAmount + extraTotal;

  const handleAddStoreProduct = (prod: any) => {
    setExtraItems((prev) => [...prev, { id: `ext-${Date.now()}`, name: prod.name, price: prod.price }]);
  };

  const handleConfirm = () => {
    payOrder(order.id, method, reference.trim() || undefined);
    onPaymentSuccess({ ...order, totalAmount: finalTotal });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel rounded-2xl p-5 bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Cobro y Entrega de Vehículo</h2>
            <p className="text-xs text-slate-400">
              Placa: <span className="text-amber-400 font-bold font-mono">{order.plate}</span> | #{order.orderNumber}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {/* Services summary */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Servicio de Lavado:</span>
              <span className="font-semibold text-slate-200">${order.totalAmount.toLocaleString('es-CO')}</span>
            </div>
            {extraItems.map((ex, idx) => (
              <div key={idx} className="flex justify-between text-accent-cyan text-[11px]">
                <span>+ {ex.name}:</span>
                <span className="font-semibold">${ex.price.toLocaleString('es-CO')}</span>
              </div>
            ))}
            <div className="pt-1.5 border-t border-slate-800 flex justify-between font-black text-sm text-emerald-400">
              <span>Total a Cobrar:</span>
              <span>${finalTotal.toLocaleString('es-CO')} COP</span>
            </div>
          </div>

          {/* Quick Mini-Market Cross-selling */}
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1.5">
              Venta Rápida / Mini-Market (Opcional):
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {storeProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAddStoreProduct(p)}
                  className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-left text-xs transition-colors group flex items-center justify-between"
                >
                  <div className="truncate pr-1">
                    <p className="text-slate-300 truncate font-medium text-[11px]">{p.name}</p>
                    <p className="text-accent-cyan font-bold text-[10px]">${p.price.toLocaleString('es-CO')}</p>
                  </div>
                  <Plus className="h-3 w-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Método de Pago:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'CASH', label: 'Efectivo', icon: DollarSign },
                { id: 'TRANSFER_NEQUI', label: 'Nequi', icon: Smartphone },
                { id: 'TRANSFER_DAVIPLATA', label: 'Daviplata', icon: Smartphone },
                { id: 'CARD', label: 'Tarjeta POS', icon: CreditCard },
                { id: 'MIXED', label: 'Mixto', icon: DollarSign },
              ].map((m) => {
                const Icon = m.icon;
                const isSel = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id as PaymentMethod)}
                    className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition-all ${
                      isSel
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transfer Reference input */}
          {method !== 'CASH' && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Comprobante / Referencia de Pago (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ej. Nro Aprobación M-892182"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full bg-slate-950 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
        >
          <CheckCircle className="h-4 w-4" />
          <span>Confirmar Cobro y Entregar</span>
        </button>
      </div>
    </div>
  );
}
