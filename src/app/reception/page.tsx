'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ExpressIntakeModal } from '@/components/reception/ExpressIntakeModal';
import { TicketModal } from '@/components/cashier/TicketModal';
import { useApp } from '@/lib/app-context';
import { WashOrder } from '@/lib/types';
import { PlusCircle, Search, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ReceptionPage() {
  const { orders } = useApp();
  const [isIntakeOpen, setIsIntakeOpen] = useState(true);
  const [activeTicketOrder, setActiveTicketOrder] = useState<WashOrder | null>(null);

  const recentEntries = orders.slice(0, 10);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onOpenExpressIntake={() => setIsIntakeOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Recepción & Entrada Express
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Módulo táctil mobile-first para registro rápido de placas en portería y patio.
              </p>
            </div>
            <button
              onClick={() => setIsIntakeOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 font-bold text-xs text-white shadow-lg shadow-brand-600/30 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Registrar Vehículo</span>
            </button>
          </div>

          {/* Quick list of recent entries */}
          <div className="glass-panel rounded-2xl p-4 bg-slate-950/80 border border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Últimos Vehículos Ingresados
            </h2>
            <div className="divide-y divide-slate-800">
              {recentEntries.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black font-mono text-sm">
                      {ord.plate}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{ord.vehicleCategoryName}</p>
                      <p className="text-slate-400 text-[11px]">
                        {ord.items.map((i) => i.serviceName).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === 'READY'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : ord.status === 'DELIVERED'
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {ord.status}
                    </span>
                    <button
                      onClick={() => setActiveTicketOrder(ord)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                    >
                      Ver Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <ExpressIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onOrderCreated={(order) => setActiveTicketOrder(order)}
      />

      <TicketModal
        order={activeTicketOrder}
        isOpen={!!activeTicketOrder}
        onClose={() => setActiveTicketOrder(null)}
      />
    </div>
  );
}
