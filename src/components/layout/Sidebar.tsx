'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Kanban,
  PlusCircle,
  Users,
  Wallet,
  Tag,
  Settings,
  ShieldAlert,
  Building,
  LogIn,
  Flame,
} from 'lucide-react';

const operationalItems = [
  { name: 'Kanban Operativo', href: '/', icon: Kanban },
  { name: 'Recepción Express', href: '/reception', icon: PlusCircle },
  { name: 'Comisiones Operarios', href: '/commissions', icon: Users },
  { name: 'Caja y Ventas POS', href: '/cashier', icon: Wallet },
  { name: 'Catálogo de Tarifas', href: '/services', icon: Tag },
  { name: 'Lavadero / Perfil', href: '/settings', icon: Settings },
];

const platformItems = [
  { name: 'Super-Admin (APPZ PLAY)', href: '/admin', icon: ShieldAlert },
  { name: 'Registrar Empresa', href: '/register', icon: Building },
  { name: 'Cambiar de Cuenta', href: '/login', icon: LogIn },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col w-64 glass-panel border-r border-slate-800/80 bg-slate-950/70 p-4 shrink-0">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Módulos del Lavadero
          </p>
          {operationalItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* SaaS Platform section */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-2">
            Plataforma SaaS APPZ PLAY
          </p>
          {platformItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Operational Helper Card */}
        <div className="mt-auto pt-6">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-indigo-500/20 text-xs">
            <div className="flex items-center gap-2 mb-1.5 font-semibold text-blue-300">
              <Flame className="h-4 w-4 text-cyan-400" />
              <span>APPZ WASH Multi-Tenant</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Cada empresa tiene sus órdenes, lavadores y caja aislados de forma independiente.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800 bg-slate-950/95 px-2 py-1.5 flex items-center justify-around">
        {operationalItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span>{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
