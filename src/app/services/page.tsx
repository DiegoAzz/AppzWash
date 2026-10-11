'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useApp } from '@/lib/app-context';
import { Tag, Car, Bike, Truck, Sparkles, DollarSign, Percent, ShieldCheck } from 'lucide-react';

export default function ServicesPage() {
  const { categories, services, rates } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              Catálogo de Servicios & Matriz Tarifaria
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Configuración de precios por categoría de vehículo y esquemas de comisión para lavadores.
            </p>
          </div>

          {/* Pricing Matrix Table */}
          <div className="glass-panel rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800 mb-8">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-brand-400" />
                <h2 className="font-bold text-sm text-white">Matriz Dinámica: Precios vs. Comisiones</h2>
              </div>
              <span className="text-xs text-slate-400">Moneda: COP</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300">
                    <th className="p-3.5 font-bold">Servicio / Descripción</th>
                    {categories.map((cat) => (
                      <th key={cat.id} className="p-3.5 font-bold text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-white">{cat.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal uppercase">
                            {cat.code}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {services.map((srv) => (
                    <tr key={srv.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-200 text-xs">{srv.name}</p>
                        <p className="text-[11px] text-slate-500">
                          Cat: {srv.category} | ~{srv.estimatedMinutes} min
                        </p>
                      </td>

                      {categories.map((cat) => {
                        const rate = rates.find(
                          (r) => r.serviceId === srv.id && r.vehicleCategoryId === cat.id
                        );

                        if (!rate) {
                          return (
                            <td key={cat.id} className="p-3.5 text-center text-slate-600">
                              No aplica
                            </td>
                          );
                        }

                        const calculatedCommission =
                          rate.commissionType === 'PERCENTAGE'
                            ? (rate.price * rate.commissionValue) / 100
                            : rate.commissionValue;

                        return (
                          <td key={cat.id} className="p-3.5 text-center">
                            <div className="flex flex-col items-center">
                              <span className="font-black text-emerald-400 text-xs">
                                ${rate.price.toLocaleString('es-CO')}
                              </span>
                              <span className="text-[10px] text-indigo-300 font-medium">
                                Com: ${calculatedCommission.toLocaleString('es-CO')} (
                                {rate.commissionType === 'PERCENTAGE'
                                  ? `${rate.commissionValue}%`
                                  : 'Fijo'}
                                )
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Informational Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl glass-panel bg-slate-950/70 border border-slate-800 text-xs space-y-2">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Percent className="h-4 w-4 text-cyan-400" />
                <span>Comisión Porcentual</span>
              </h3>
              <p className="text-slate-400 leading-relaxed">
                El operario recibe un % pactado (ej. 40%) del valor antes de propina. Si el servicio sube de precio, su comisión se actualiza automáticamente.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-panel bg-slate-950/70 border border-slate-800 text-xs space-y-2">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-amber-400" />
                <span>Tarifa Fija de Operario</span>
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Ideal para servicios especializados como desmanchado de cojinería o pulido, donde se acuerda un valor neto fijo por vehículo finalizado.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-panel bg-slate-950/70 border border-slate-800 text-xs space-y-2">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Aislamiento Multi-Tenant</span>
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Cada lavadero define sus propias tarifas y categorías sin interferir con otros lavaderos suscritos a la plataforma APPZ WASH.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
