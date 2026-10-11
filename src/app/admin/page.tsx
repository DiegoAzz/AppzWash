'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Building2,
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Plus,
  Search,
  ArrowLeft,
  Calendar,
  Lock,
  Unlock,
} from 'lucide-react';
import { useApp } from '@/lib/app-context';

export default function SuperAdminPage() {
  const router = useRouter();
  const { availableTenants, switchTenant, toggleTenantStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = availableTenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = availableTenants.filter((t) => t.status === 'ACTIVE').length;
  const trialCount = availableTenants.filter((t) => t.status === 'TRIAL').length;
  const estimatedMRR = activeCount * 80000; // Ej: $80,000 COP / mes por lavadero

  const handleImpersonate = (tenantId: string) => {
    switchTenant(tenantId);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Volver a la App"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" /> APPZ PLAY SUPER-ADMIN
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
                  Gestión Global de Empresas (Tenants)
                </h1>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-1 ml-11">
              Control de suscripciones SaaS, cortes de servicio por pago y monitoreo de lavaderos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Registrar Nuevo Lavadero
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Lavaderos</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{availableTenants.length}</div>
            <span className="text-xs text-slate-500 mt-1 block">Empresas registradas en BD</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Suscripciones Activas</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">{activeCount}</div>
            <span className="text-xs text-slate-500 mt-1 block">Pagando membresía mensual</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">En Prueba (Trial 15d)</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">{trialCount}</div>
            <span className="text-xs text-slate-500 mt-1 block">Prospectos en período libre</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">MRR Estimado</span>
              <DollarSign className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-400">
              ${estimatedMRR.toLocaleString('es-CO')} <span className="text-xs text-slate-500">COP/mes</span>
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Ingreso recurrente proyectado</span>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por lavadero, ciudad o dueño..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div className="text-xs text-slate-400">
            Mostrando <strong className="text-white">{filteredTenants.length}</strong> de{' '}
            <strong className="text-white">{availableTenants.length}</strong> lavaderos
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Lavadero / Empresa</th>
                  <th className="py-3.5 px-4">Propietario & Contacto</th>
                  <th className="py-3.5 px-4">Ciudad</th>
                  <th className="py-3.5 px-4">Plan SaaS</th>
                  <th className="py-3.5 px-4">Estado Suscripción</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                          {tenant.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div>{tenant.name}</div>
                          <span className="text-xs text-slate-500 font-mono">id: {tenant.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-slate-200">{tenant.ownerName}</div>
                      <div className="text-xs text-slate-400">{tenant.phone} • {tenant.email}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{tenant.city}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {tenant.status === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle className="w-3 h-3" /> Activo (Al día)
                        </span>
                      )}
                      {tenant.status === 'TRIAL' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <Calendar className="w-3 h-3" /> Prueba (Trial)
                        </span>
                      )}
                      {tenant.status === 'SUSPENDED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3" /> Suspendido (Mora)
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Active / Suspended */}
                        <button
                          onClick={() => toggleTenantStatus(tenant.id)}
                          title={tenant.status === 'SUSPENDED' ? 'Activar acceso' : 'Suspender por falta de pago'}
                          className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                            tenant.status === 'SUSPENDED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                          }`}
                        >
                          {tenant.status === 'SUSPENDED' ? (
                            <Unlock className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </button>

                        {/* Entrar al lavadero */}
                        <button
                          onClick={() => handleImpersonate(tenant.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Entrar a Operación</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
