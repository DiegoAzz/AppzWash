'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useApp } from '@/lib/app-context';
import { Settings, ShieldCheck, Building, Database, Server, Smartphone, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { tenantName, tenantNit } = useApp();
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6 max-w-5xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              Configuración del Lavadero & Multi-Tenancy
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Datos comerciales del Tenant, plan de suscripción SaaS e infraestructura.
            </p>
          </div>

          {savedToast && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>Configuración guardada correctamente en el perfil del Tenant.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Form */}
            <div className="md:col-span-2 glass-panel rounded-2xl p-5 bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
                <Building className="h-4 w-4 text-brand-400" />
                <h2 className="font-bold text-sm text-white">Perfil Comercial del Lavadero</h2>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Nombre Comercial del Lavadero
                  </label>
                  <input
                    type="text"
                    defaultValue={tenantName}
                    className="w-full bg-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      NIT / RUT Fiscal
                    </label>
                    <input
                      type="text"
                      defaultValue={tenantNit}
                      className="w-full bg-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Teléfono de Contacto (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      defaultValue="+57 312 456 7890"
                      className="w-full bg-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Dirección de la Sede Principal
                  </label>
                  <input
                    type="text"
                    defaultValue="Av. Circunvalar # 45-12, Sector Los Robles"
                    className="w-full bg-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>

            {/* SaaS Subscription Info */}
            <div className="space-y-4">
              <div className="glass-panel rounded-2xl p-5 bg-slate-950/80 border border-brand-500/30 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">Plan de Suscripción</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[10px]">
                    PLAN PRO ACTIVO
                  </span>
                </div>

                <div className="space-y-1 text-slate-400 text-[11px]">
                  <p>• Multi-sede habilitado</p>
                  <p>• Liquidación instantánea de comisiones</p>
                  <p>• Impresión térmica 58mm/80mm</p>
                  <p>• Aislamiento lógico PostgreSQL RLS</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                  <span>Próximo corte de facturación:</span>
                  <p className="font-bold text-white text-xs mt-0.5">30 de Noviembre, 2026</p>
                </div>
              </div>

              {/* Infrastructure Details */}
              <div className="glass-panel rounded-2xl p-5 bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <h3 className="font-bold text-white flex items-center gap-1.5">
                  <Server className="h-4 w-4 text-cyan-400" />
                  <span>Infraestructura VPS Hostinger</span>
                </h3>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Contenedores Docker optimizados con PostgreSQL 16 y Nginx Reverse Proxy. Capacidad para hasta 200 lavaderos concurrentes.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
