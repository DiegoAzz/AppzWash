'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Sparkles, Building, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/app-context';

export default function LoginPage() {
  const router = useRouter();
  const { availableTenants, currentTenantId, switchTenant } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTenantSlug, setSelectedTenantSlug] = useState(currentTenantId || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (selectedTenantSlug) {
        switchTenant(selectedTenantSlug);
      }
      setIsLoading(false);
      router.push('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> APPZ WASH SAAS
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Iniciar Sesión
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Ingresa a la plataforma operativa de tu autolavado
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Selector de Lavadero / Tenant */}
            {availableTenants && availableTenants.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Seleccionar Empresa / Lavadero
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <select
                    value={selectedTenantSlug}
                    onChange={(e) => setSelectedTenantSlug(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  >
                    {availableTenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.city || 'Principal'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="admin@autolavado.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Ingresando...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Acceder al Sistema</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-slate-400 text-xs">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1">
                  Registrar mi Lavadero <ArrowRight className="w-3 h-3" />
                </Link>
              </span>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/admin" className="text-xs text-slate-500 hover:text-slate-400 underline">
            Acceso Super-Admin (APPZ PLAY Management)
          </Link>
        </div>
      </div>
    </div>
  );
}
