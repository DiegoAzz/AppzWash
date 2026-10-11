'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { WashOrder, WashOrderStatus } from '@/lib/types';
import { OrderCard } from './OrderCard';
import { Search, Clock, Car, CheckCircle2, Droplets, Sparkles, Filter } from 'lucide-react';

interface KanbanBoardProps {
  onOpenTicket: (order: WashOrder) => void;
  onOpenPayment: (order: WashOrder) => void;
}

const COLUMNS: {
  id: WashOrderStatus;
  title: string;
  icon: React.ElementType;
  color: string;
  badgeBg: string;
}[] = [
  { id: 'WAITING', title: 'En Espera', icon: Clock, color: 'text-amber-400', badgeBg: 'bg-amber-400/10 text-amber-300 border-amber-400/20' },
  { id: 'IN_WASH', title: 'En Lavado', icon: Droplets, color: 'text-cyan-400', badgeBg: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20' },
  { id: 'DETAILING', title: 'Secado / Detallado', icon: Sparkles, color: 'text-indigo-400', badgeBg: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/20' },
  { id: 'READY', title: 'Listo para Entrega', icon: CheckCircle2, color: 'text-emerald-400', badgeBg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20' },
  { id: 'DELIVERED', title: 'Entregado / Cobrado', icon: Car, color: 'text-slate-400', badgeBg: 'bg-slate-400/10 text-slate-300 border-slate-400/20' },
];

export function KanbanBoard({ onOpenTicket, onOpenPayment }: KanbanBoardProps) {
  const { orders } = useApp();
  const [searchPlate, setSearchPlate] = useState('');

  const filteredOrders = orders.filter((o) =>
    o.plate.toLowerCase().includes(searchPlate.toLowerCase()) ||
    (o.customerName && o.customerName.toLowerCase().includes(searchPlate.toLowerCase()))
  );

  const activeVehiclesCount = orders.filter((o) => o.status !== 'DELIVERED').length;
  const deliveredTodayCount = orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top operational bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 glass-panel rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Vehículos en Patio:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs">
              {activeVehiclesCount} activos
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Entregados hoy:</span>
            <span className="text-emerald-400 font-bold">{deliveredTodayCount}</span>
          </div>
        </div>

        {/* Filter / Search by Plate */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por placa o cliente..."
            value={searchPlate}
            onChange={(e) => setSearchPlate(e.target.value)}
            className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 pl-9 pr-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colOrders = filteredOrders.filter((o) => o.status === col.id);
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              className="flex flex-col rounded-2xl glass-panel p-3 min-w-[280px] bg-slate-950/60 border border-slate-800/80"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${col.color}`} />
                  <h3 className="font-semibold text-xs text-slate-200">{col.title}</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold border ${col.badgeBg}`}
                >
                  {colOrders.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-250px)] pr-1">
                {colOrders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-600 border border-dashed border-slate-800/60 rounded-xl">
                    Sin vehículos
                  </div>
                ) : (
                  colOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onOpenTicket={onOpenTicket}
                      onOpenPayment={onOpenPayment}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
