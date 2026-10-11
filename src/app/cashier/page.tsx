'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CashSessionModal } from '@/components/cashier/CashSessionModal';
import { useApp } from '@/lib/app-context';
import { Wallet, DollarSign, ShoppingBag, Plus, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function CashierPage() {
  const { cashSession, storeProducts, orders } = useApp();
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [posSuccess, setPosSuccess] = useState<string | null>(null);

  const cashOrders = orders.filter((o) => o.status === 'DELIVERED' && o.paymentMethod === 'CASH');
  const transferOrders = orders.filter((o) => o.status === 'DELIVERED' && o.paymentMethod !== 'CASH');

  const totalTransferSales = transferOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalCashSales = cashSession.calculatedCashSales;
  const currentTotalInDrawer = cashSession.initialCash + totalCashSales;

  const handleSellProduct = (prod: any) => {
    setPosSuccess(`Venta rápida registrada: ${prod.name} ($${prod.price.toLocaleString('es-CO')} COP)`);
    setTimeout(() => setPosSuccess(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onOpenCashModal={() => setIsCashModalOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Caja, Arqueo & Ventas Rápidas POS
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Trazabilidad estricta contra fuga de dinero y punto de venta para la sala de espera.
              </p>
            </div>
            <button
              onClick={() => setIsCashModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-xs text-white shadow-lg shadow-emerald-700/30 flex items-center gap-2"
            >
              <Wallet className="h-4 w-4" />
              <span>Arqueo / Cierre Ciego</span>
            </button>
          </div>

          {posSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{posSuccess}</span>
            </div>
          )}

          {/* Shift Financial Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-2xl glass-panel bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Base Inicial en Gaveta</span>
              <p className="text-xl font-extrabold text-white">
                ${cashSession.initialCash.toLocaleString('es-CO')}
              </p>
              <span className="text-[10px] text-slate-500">Apertura de turno</span>
            </div>

            <div className="p-4 rounded-2xl glass-panel bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-emerald-400 block mb-1">Ventas en Efectivo</span>
              <p className="text-xl font-extrabold text-emerald-400">
                ${totalCashSales.toLocaleString('es-CO')}
              </p>
              <span className="text-[10px] text-slate-500">{cashOrders.length} tickets en efectivo</span>
            </div>

            <div className="p-4 rounded-2xl glass-panel bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-cyan-400 block mb-1">Transferencias (Nequi/Davi/POS)</span>
              <p className="text-xl font-extrabold text-cyan-400">
                ${totalTransferSales.toLocaleString('es-CO')}
              </p>
              <span className="text-[10px] text-slate-500">{transferOrders.length} pagos bancarizados</span>
            </div>

            <div className="p-4 rounded-2xl glass-panel bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-500/30">
              <span className="text-xs text-indigo-300 font-semibold block mb-1">
                Efectivo Total Esperado
              </span>
              <p className="text-2xl font-black text-white">
                ${currentTotalInDrawer.toLocaleString('es-CO')}
              </p>
              <span className="text-[10px] text-indigo-400">Base + Ventas Físicas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* POS Mini Market */}
            <div className="lg:col-span-2 glass-panel rounded-2xl p-5 bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-cyan-400" />
                  <h2 className="font-bold text-sm text-white">Ventas de Sala de Espera (Mini-Market)</h2>
                </div>
                <span className="text-xs text-slate-400">Venta cruzada directa</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {storeProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-xs text-slate-200">{prod.name}</p>
                      <p className="text-[11px] text-slate-400">Stock: {prod.stock} unids | Cat: {prod.category}</p>
                      <p className="text-xs font-bold text-emerald-400 mt-1">
                        ${prod.price.toLocaleString('es-CO')} COP
                      </p>
                    </div>

                    <button
                      onClick={() => handleSellProduct(prod)}
                      className="p-2 rounded-xl bg-brand-600/30 text-brand-300 border border-brand-500/40 hover:bg-brand-600 hover:text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift Activity & Anti-theft info */}
            <div className="glass-panel rounded-2xl p-5 bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Auditoría Antifraude</h3>
              </div>

              <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
                <p>
                  • Cada vehículo registrado en recepción emite un ticket que debe coincidir con un cobro en caja antes de ser marcado como entregado.
                </p>
                <p>
                  • El <strong>Arqueo Ciego</strong> impide que el cajero vea el monto calculado en pantalla al momento de contar los billetes, evitando ajustes arbitrarios.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsCashModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
                >
                  Abrir Formulario de Arqueo
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CashSessionModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
      />
    </div>
  );
}
