'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { X, Wallet, AlertTriangle, CheckCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface CashSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CashSessionModal({ isOpen, onClose }: CashSessionModalProps) {
  const { cashSession, closeCashSession, openNewCashSession } = useApp();

  const [actualCashInput, setActualCashInput] = useState('');
  const [closingNotes, setClosingNotes] = useState('');
  const [newBaseInput, setNewBaseInput] = useState('150000');
  const [closingResult, setClosingResult] = useState<{ difference: number } | null>(null);

  if (!isOpen) return null;

  const totalCalculatedExpected = (cashSession.initialCash || 0) + (cashSession.calculatedCashSales || 0);

  const handleCloseSession = (e: React.FormEvent) => {
    e.preventDefault();
    const actual = parseFloat(actualCashInput) || 0;
    const res = closeCashSession(actual, closingNotes);
    setClosingResult(res);
  };

  const handleOpenNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    const base = parseFloat(newBaseInput) || 0;
    openNewCashSession(base);
    setClosingResult(null);
    setActualCashInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel rounded-2xl p-5 bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Arqueo y Cierre de Caja</h2>
              <p className="text-xs text-slate-400">Control estricto antifuga de dinero</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        {cashSession.status === 'OPEN' ? (
          <div className="pt-4 space-y-4">
            {/* Status cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Base Inicial:</span>
                <span className="font-bold text-slate-200 text-sm">
                  ${cashSession.initialCash.toLocaleString('es-CO')} COP
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Ventas Efectivo:</span>
                <span className="font-bold text-emerald-400 text-sm">
                  ${cashSession.calculatedCashSales.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/90 border border-brand-500/30 flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Total Esperado en Gaveta:</span>
              <span className="font-extrabold text-sm text-cyan-300">
                ${totalCalculatedExpected.toLocaleString('es-CO')} COP
              </span>
            </div>

            {/* Blind closing count form */}
            {!closingResult ? (
              <form onSubmit={handleCloseSession} className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Arqueo Ciego:</strong> Ingrese el dinero en efectivo real contado físicamente en la gaveta.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Efectivo Físico Contado ($ COP) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ej. 225000"
                    value={actualCashInput}
                    onChange={(e) => setActualCashInput(e.target.value)}
                    className="w-full bg-slate-950 text-base font-bold text-emerald-400 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Observaciones de Cierre (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Pago a proveedor de jabón $20.000..."
                    value={closingNotes}
                    onChange={(e) => setClosingNotes(e.target.value)}
                    className="w-full bg-slate-950 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-700/20 transition-all"
                >
                  Efectuar Arqueo y Cerrar Turno
                </button>
              </form>
            ) : (
              /* Post-close summary */
              <div className="space-y-3 pt-2">
                <div
                  className={`p-4 rounded-xl border text-center ${
                    closingResult.difference === 0
                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                      : closingResult.difference > 0
                      ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-300'
                      : 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                  }`}
                >
                  {closingResult.difference === 0 && (
                    <div className="flex flex-col items-center gap-1">
                      <CheckCircle className="h-6 w-6 text-emerald-400" />
                      <p className="font-bold text-sm">¡Caja Cuadrada Exacta!</p>
                      <p className="text-xs text-slate-400">Diferencia: $0 COP</p>
                    </div>
                  )}
                  {closingResult.difference > 0 && (
                    <div className="flex flex-col items-center gap-1">
                      <Sparkles className="h-6 w-6 text-cyan-400" />
                      <p className="font-bold text-sm">Sobrante de Dinero</p>
                      <p className="text-base font-extrabold text-cyan-400">
                        +${closingResult.difference.toLocaleString('es-CO')} COP
                      </p>
                    </div>
                  )}
                  {closingResult.difference < 0 && (
                    <div className="flex flex-col items-center gap-1">
                      <AlertTriangle className="h-6 w-6 text-rose-400" />
                      <p className="font-bold text-sm">Descuadre / Faltante de Dinero</p>
                      <p className="text-base font-extrabold text-rose-400">
                        -${Math.abs(closingResult.difference).toLocaleString('es-CO')} COP
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Finalizar
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Caja Cerrada -> Abrir nuevo turno */
          <form onSubmit={handleOpenNewSession} className="pt-4 space-y-4">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 text-center">
              La caja actual se encuentra <strong>CERRADA</strong>. Ingrese la base inicial para abrir un nuevo turno de operaciones.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Base Inicial de Gaveta ($ COP)
              </label>
              <input
                type="number"
                required
                value={newBaseInput}
                onChange={(e) => setNewBaseInput(e.target.value)}
                className="w-full bg-slate-950 text-base font-bold text-emerald-400 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/20"
            >
              Abrir Nuevo Turno de Caja
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
