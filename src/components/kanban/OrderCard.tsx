'use client';

import React from 'react';
import { WashOrder, WashOrderStatus } from '@/lib/types';
import { useApp } from '@/lib/app-context';
import {
  Clock,
  User,
  Car,
  Truck,
  Bike,
  Sparkles,
  ArrowRight,
  Printer,
  CheckCircle,
  AlertCircle,
  DollarSign,
} from 'lucide-react';

interface OrderCardProps {
  order: WashOrder;
  onOpenTicket: (order: WashOrder) => void;
  onOpenPayment: (order: WashOrder) => void;
}

export function OrderCard({ order, onOpenTicket, onOpenPayment }: OrderCardProps) {
  const { updateOrderStatus, assignWasher, washers } = useApp();

  // Elapsed time calculation
  const getElapsedMinutes = () => {
    const start = new Date(order.entryTime).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((now - start) / 60000));
  };

  const elapsed = getElapsedMinutes();

  const getCategoryIcon = () => {
    if (order.vehicleCategoryId.includes('moto')) return <Bike className="h-3.5 w-3.5" />;
    if (order.vehicleCategoryId.includes('heavy')) return <Truck className="h-3.5 w-3.5" />;
    return <Car className="h-3.5 w-3.5" />;
  };

  const handleNextStatus = () => {
    switch (order.status) {
      case 'WAITING':
        updateOrderStatus(order.id, 'IN_WASH');
        break;
      case 'IN_WASH':
        updateOrderStatus(order.id, 'DETAILING');
        break;
      case 'DETAILING':
        updateOrderStatus(order.id, 'READY');
        break;
      case 'READY':
        onOpenPayment(order);
        break;
    }
  };

  return (
    <div className="glass-card rounded-xl p-3.5 transition-all duration-200 hover:border-slate-600/80 hover:shadow-lg hover:shadow-slate-950/40 flex flex-col gap-2.5">
      {/* Header: Plate & Category */}
      <div className="flex items-center justify-between">
        {/* Colombian Plate Styled Badge */}
        <div className="flex items-center gap-1.5">
          <div className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-sm font-mono tracking-wider border border-amber-300 shadow-sm">
            {order.plate.toUpperCase()}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">#{order.orderNumber}</span>
        </div>

        {/* Time elapsed badge */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
          <Clock className="h-3 w-3 text-cyan-400" />
          <span>{elapsed}m</span>
        </div>
      </div>

      {/* Vehicle Type & Client */}
      <div className="flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-1 text-slate-400">
          {getCategoryIcon()}
          <span className="truncate max-w-[140px]">{order.vehicleCategoryName}</span>
        </div>
        {order.customerName && (
          <span className="text-slate-400 text-[11px] truncate max-w-[100px]">
            {order.customerName}
          </span>
        )}
      </div>

      {/* Services List */}
      <div className="py-1 border-t border-slate-800/80">
        {order.items.map((item) => (
          <div key={item.id} className="text-xs text-slate-200 font-medium truncate flex justify-between">
            <span className="truncate pr-1">• {item.serviceName}</span>
            <span className="text-brand-300 shrink-0 font-semibold">
              ${item.price.toLocaleString('es-CO')}
            </span>
          </div>
        ))}
      </div>

      {/* Damage / Notes alert */}
      {order.preExistingDamage && (
        <div className="flex items-start gap-1 p-1.5 rounded-md bg-amber-950/30 border border-amber-800/40 text-[10px] text-amber-300">
          <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
          <span className="truncate">{order.preExistingDamage}</span>
        </div>
      )}

      {/* Operator Assignment */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          <User className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <select
            value={order.washerId || ''}
            onChange={(e) => assignWasher(order.id, e.target.value)}
            className="bg-slate-900/90 text-slate-200 rounded px-1.5 py-0.5 border border-slate-800 text-[11px] focus:outline-none focus:border-brand-500"
          >
            <option value="">(Sin asignar)</option>
            {washers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => onOpenTicket(order)}
          title="Ver Comprobante / Imprimir Ticket"
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Printer className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Action Button depending on status */}
      {order.status !== 'DELIVERED' && (
        <button
          onClick={handleNextStatus}
          className={`w-full mt-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            order.status === 'READY'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-700/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-700/20'
          }`}
        >
          {order.status === 'WAITING' && (
            <>
              <span>Iniciar Lavado</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
          {order.status === 'IN_WASH' && (
            <>
              <span>A Secado/Detallado</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
          {order.status === 'DETAILING' && (
            <>
              <span>Marcar Listo</span>
              <CheckCircle className="h-3.5 w-3.5 text-emerald-300" />
            </>
          )}
          {order.status === 'READY' && (
            <>
              <DollarSign className="h-3.5 w-3.5" />
              <span>Cobrar y Entregar</span>
            </>
          )}
        </button>
      )}

      {order.status === 'DELIVERED' && (
        <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-800/40">
          <span>Cobrado: {order.paymentMethod}</span>
          <span className="font-bold">${order.totalAmount.toLocaleString('es-CO')}</span>
        </div>
      )}
    </div>
  );
}
