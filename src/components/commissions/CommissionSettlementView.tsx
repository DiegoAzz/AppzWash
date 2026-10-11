'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Washer, WasherAdvance } from '@/lib/types';
import { Users, DollarSign, PlusCircle, CheckCircle2, AlertCircle, Calendar, Receipt } from 'lucide-react';

export function CommissionSettlementView() {
  const { washers, orders, advances, addWasherAdvance, settleWasherPayroll } = useApp();
  const [selectedWasherId, setSelectedWasherId] = useState<string>(washers[0]?.id || '');
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceReason, setAdvanceReason] = useState('Almuerzo corriente ejecutivo');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const currentWasher = washers.find((w) => w.id === selectedWasherId);

  // Delivered orders by this washer
  const washerOrders = orders.filter((o) => o.washerId === selectedWasherId && o.status === 'DELIVERED');
  const pendingOrders = orders.filter((o) => o.washerId === selectedWasherId && o.status !== 'DELIVERED');

  const grossCommission = washerOrders.reduce((acc, o) => acc + o.washerCommissionTotal, 0);

  // Undeducted advances
  const washerAdvances = advances.filter((a) => a.washerId === selectedWasherId && !a.isDeducted);
  const totalAdvances = washerAdvances.reduce((acc, a) => acc + a.amount, 0);
  const netPayable = Math.max(0, grossCommission - totalAdvances);

  const handleCreateAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(advanceAmount);
    if (!amt || !selectedWasherId) return;

    addWasherAdvance(selectedWasherId, amt, advanceReason);
    setAdvanceAmount('');
    setSuccessToast(`Anticipo de $${amt.toLocaleString('es-CO')} registrado para ${currentWasher?.name}`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleSettle = () => {
    if (!selectedWasherId) return;
    const result = settleWasherPayroll(selectedWasherId);
    setSuccessToast(
      `¡Liquidación exitosa! Se pagó un neto de $${result.netPaid.toLocaleString('es-CO')} COP (${result.paidOrdersCount} servicios).`
    );
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-lg">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Operarios tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {washers.map((w) => {
          const isSelected = w.id === selectedWasherId;
          const count = orders.filter((o) => o.washerId === w.id && o.status === 'DELIVERED').length;
          return (
            <button
              key={w.id}
              onClick={() => setSelectedWasherId(w.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-500 shadow-md shadow-brand-600/30'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{w.name}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {count} vehículos
              </span>
            </button>
          );
        })}
      </div>

      {currentWasher && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Financial Summary (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl glass-panel bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Comisión Bruta (Hoy)
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-white">
                  ${grossCommission.toLocaleString('es-CO')}
                </p>
                <span className="text-[10px] text-slate-500">{washerOrders.length} servicios entregados</span>
              </div>

              <div className="p-4 rounded-2xl glass-panel bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] font-semibold text-rose-400 block mb-1">
                  Adelantos / Descuentos
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-rose-400">
                  -${totalAdvances.toLocaleString('es-CO')}
                </p>
                <span className="text-[10px] text-slate-500">{washerAdvances.length} deducciones</span>
              </div>

              <div className="p-4 rounded-2xl glass-panel bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                  Neto a Pagar
                </span>
                <p className="text-lg sm:text-xl font-black text-emerald-300">
                  ${netPayable.toLocaleString('es-CO')}
                </p>
                <span className="text-[10px] text-emerald-500 font-semibold">Listo para liquidar</span>
              </div>
            </div>

            {/* Breakdown of services */}
            <div className="p-4 rounded-2xl glass-panel bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="font-bold text-xs text-slate-200">
                  Detalle de Vehículos Lavados por {currentWasher.name}
                </h3>
                <span className="text-[11px] text-slate-400">
                  Esquema:{' '}
                  {currentWasher.commissionType === 'PERCENTAGE'
                    ? `${currentWasher.defaultCommissionValue}%`
                    : `$${currentWasher.defaultCommissionValue.toLocaleString('es-CO')} fijo`}
                </span>
              </div>

              {washerOrders.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-500">
                  Aún no tiene vehículos marcados como entregados en este turno.
                </p>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {washerOrders.map((ord) => (
                    <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-amber-400/90 text-slate-950 font-bold font-mono text-[11px]">
                          {ord.plate}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-200">{ord.vehicleCategoryName}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                            {ord.items.map((i) => i.serviceName).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">
                          Precio: ${ord.totalAmount.toLocaleString('es-CO')}
                        </span>
                        <span className="font-bold text-indigo-400">
                          Comisión: ${ord.washerCommissionTotal.toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settle Action Button */}
            <button
              onClick={handleSettle}
              disabled={netPayable === 0 && washerAdvances.length === 0}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
            >
              <Receipt className="h-4 w-4" />
              <span>Cerrar y Pagar Liquidación de ${netPayable.toLocaleString('es-CO')} COP</span>
            </button>
          </div>

          {/* Right Column: Advances & Deductions */}
          <div className="space-y-4">
            {/* Add Advance Form */}
            <div className="p-4 rounded-2xl glass-panel bg-slate-950/80 border border-slate-800">
              <h3 className="font-bold text-xs text-slate-200 mb-3 flex items-center gap-1.5">
                <PlusCircle className="h-4 w-4 text-rose-400" />
                <span>Registrar Anticipo / Descuento</span>
              </h3>

              <form onSubmit={handleCreateAdvance} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Valor del Anticipo ($ COP)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ej. 15000"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    className="w-full bg-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-700 text-rose-300 font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Concepto / Motivo
                  </label>
                  <select
                    value={advanceReason}
                    onChange={(e) => setAdvanceReason(e.target.value)}
                    className="w-full bg-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-700 text-slate-200 focus:outline-none focus:border-brand-500"
                  >
                    <option value="Almuerzo corriente ejecutivo">Almuerzo corriente ($15.000)</option>
                    <option value="Adelanto de nómina / Efectivo">Adelanto de nómina en efectivo</option>
                    <option value="Implementos / Guantes / Botas">Implementos de trabajo</option>
                    <option value="Otro motivo">Otro descuento</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-700/20 transition-colors"
                >
                  Descontar de Comisión
                </button>
              </form>
            </div>

            {/* Active Deductions List */}
            <div className="p-4 rounded-2xl glass-panel bg-slate-950/80 border border-slate-800 text-xs">
              <h4 className="font-bold text-slate-300 mb-2">Descuentos Pendientes</h4>
              {washerAdvances.length === 0 ? (
                <p className="text-slate-500 text-[11px]">Sin anticipos registrados para el turno.</p>
              ) : (
                <div className="space-y-2">
                  {washerAdvances.map((adv) => (
                    <div
                      key={adv.id}
                      className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-slate-200">{adv.reason}</p>
                        <p className="text-[10px] text-slate-500">
                          {new Date(adv.date).toLocaleTimeString('es-CO')}
                        </p>
                      </div>
                      <span className="font-bold text-rose-400">
                        -${adv.amount.toLocaleString('es-CO')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
