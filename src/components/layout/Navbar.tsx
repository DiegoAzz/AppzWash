'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/app-context';
import { Sparkles, Plus, Wallet, ShieldCheck, RefreshCw, Car } from 'lucide-react';

interface NavbarProps {
  onOpenExpressIntake?: () => void;
  onOpenCashModal?: () => void;
}

export function Navbar({ onOpenExpressIntake, onOpenCashModal }: NavbarProps) {
  const { tenantName, cashSession, resetToSampleData } = useApp();

  const currentCashTotal = (cashSession.initialCash || 0) + (cashSession.calculatedCashSales || 0);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand & Tenant */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-accent-cyan flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg tracking-tight text-white">
                  APPZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-brand-400">WASH</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  SaaS Multi-Tenant
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 font-medium truncate max-w-[200px] sm:max-w-none">
                <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                {tenantName}
              </p>
            </div>
          </Link>
        </div>

        {/* Center / Stats (Hidden on small mobile) */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Caja Actual:</span>
            <span className="font-bold text-emerald-400">
              ${currentCashTotal.toLocaleString('es-CO')} COP
            </span>
          </div>

          <div className="text-xs px-2.5 py-1 rounded bg-slate-800/50 text-slate-400 border border-slate-700/50">
            APPZ PLAY Engine 1.0
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={resetToSampleData}
            title="Restablecer datos de prueba"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors border border-slate-800 text-xs flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden xl:inline">Demo Reset</span>
          </button>

          {onOpenCashModal && (
            <button
              onClick={onOpenCashModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition-all hover:border-slate-600"
            >
              <Wallet className="h-4 w-4 text-emerald-400" />
              <span className="hidden sm:inline">Arqueo de Caja</span>
            </button>
          )}

          {onOpenExpressIntake && (
            <button
              onClick={onOpenExpressIntake}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-brand-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>Nuevo Ingreso</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
