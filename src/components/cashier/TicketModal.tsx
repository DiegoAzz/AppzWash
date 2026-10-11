'use client';

import React from 'react';
import { WashOrder } from '@/lib/types';
import { useApp } from '@/lib/app-context';
import { X, Printer, Share2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface TicketModalProps {
  order: WashOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketModal({ order, isOpen, onClose }: TicketModalProps) {
  const { tenantName, tenantNit } = useApp();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const phone = (order.customerPhone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `🚗 *${tenantName}*\n` +
      `NIT: ${tenantNit}\n` +
      `--------------------------------\n` +
      `*COMPROBANTE DE SERVICIO #${order.orderNumber}*\n` +
      `Placa: *${order.plate}*\n` +
      `Vehículo: ${order.vehicleCategoryName}\n` +
      `Servicios:\n` +
      order.items.map((i) => ` • ${i.serviceName}: $${i.price.toLocaleString('es-CO')}`).join('\n') +
      `\n--------------------------------\n` +
      `*Total a Pagar: $${order.totalAmount.toLocaleString('es-CO')} COP*\n` +
      `Estado: ${order.status === 'DELIVERED' ? 'PAGADO Y ENTREGADO' : 'EN PROCESO DE LAVADO'}\n` +
      (order.preExistingDamage ? `Obs. Daños: ${order.preExistingDamage}\n` : '') +
      `--------------------------------\n` +
      `¡Gracias por confiar en nosotros!`
    );

    const url = phone
      ? `https://wa.me/${phone}?text=${message}`
      : `https://wa.me/?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-sm glass-panel rounded-2xl p-5 bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 my-auto">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 no-print">
          <span className="text-xs font-bold text-slate-300">Ticket de Servicio</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Thermal Receipt Paper Layout (58mm / 80mm preview) */}
        <div
          id="thermal-receipt"
          className="my-3 p-4 bg-white text-slate-950 font-mono rounded-lg shadow-inner text-xs border border-slate-300 select-none"
        >
          <div className="text-center pb-2 border-b border-dashed border-slate-400">
            <h2 className="font-extrabold text-sm tracking-tight">{tenantName.toUpperCase()}</h2>
            <p className="text-[10px] text-slate-600">NIT: {tenantNit}</p>
            <p className="text-[10px] text-slate-600">Cali / Bogotá, Colombia</p>
            <div className="mt-1 font-bold text-xs bg-slate-100 py-0.5 border border-slate-300">
              TICKET #{order.orderNumber}
            </div>
          </div>

          <div className="py-2 border-b border-dashed border-slate-400 text-[11px] space-y-1">
            <div className="flex justify-between">
              <span>PLACA:</span>
              <span className="font-black text-xs">{order.plate.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>CATEGORÍA:</span>
              <span>{order.vehicleCategoryName}</span>
            </div>
            {order.customerName && (
              <div className="flex justify-between">
                <span>CLIENTE:</span>
                <span className="truncate max-w-[150px]">{order.customerName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>OPERARIO:</span>
              <span>{order.washerName || 'Por asignar'}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>FECHA / HORA:</span>
              <span>{new Date(order.entryTime).toLocaleTimeString('es-CO')}</span>
            </div>
          </div>

          {/* Items */}
          <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
            <span className="text-[10px] font-bold block mb-1">DETALLE SERVICIOS:</span>
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between text-[11px]">
                <span className="truncate pr-1">{it.serviceName}</span>
                <span className="shrink-0 font-bold">${it.price.toLocaleString('es-CO')}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="py-2 border-b border-dashed border-slate-400 flex justify-between font-black text-sm">
            <span>TOTAL:</span>
            <span>${order.totalAmount.toLocaleString('es-CO')} COP</span>
          </div>

          {/* Damage report */}
          {order.preExistingDamage && (
            <div className="py-1.5 border-b border-dashed border-slate-400 text-[9px] text-slate-700">
              <span className="font-bold">OBS. ESTADO:</span> {order.preExistingDamage}
            </div>
          )}

          <div className="pt-2 text-center text-[9px] text-slate-500">
            <p>APPZ WASH Cloud SaaS Platform</p>
            <p>Conserve este recibo para reclamar su vehículo</p>
          </div>
        </div>

        {/* Buttons for actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            <Printer className="h-4 w-4 text-cyan-400" />
            <span>Imprimir (58/80mm)</span>
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-700/20"
          >
            <Share2 className="h-4 w-4" />
            <span>Enviar WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
