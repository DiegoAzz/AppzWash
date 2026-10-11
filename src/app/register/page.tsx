'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Mail,
  Lock,
  Building,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Send,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/lib/app-context';

export default function RegisterPage() {
  const router = useRouter();
  const { registerTenant } = useApp();

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Form, Step 2: OTP Verification

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    city: 'Bogotá',
    plan: 'PRO',
  });

  // OTP state
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Countdown timer for resending code
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Generate random 6-digit code
  const generateAndSendCode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setCountdown(30);
    setCanResend(false);
    setOtpError('');
  };

  // Step 1: Submit form and send code
  const handleInitiateRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      generateAndSendCode();
      setIsLoading(false);
      setStep(2);
    }, 600);
  };

  // Step 2: Validate code and create tenant
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setOtpError('El código ingresado es incorrecto. Por favor verifica e intenta nuevamente.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      registerTenant({
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
      });

      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => {
        router.push('/');
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-xl z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> APPZ PLAY SAAS PLATFORM
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {step === 1 ? 'Registra tu Autolavado en APPZ WASH' : 'Verificación de Correo Electrónico'}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            {step === 1
              ? 'Comienza con 15 días gratis de prueba. Controla cajas, comisiones y colas desde hoy.'
              : `Hemos enviado un código de seguridad de 6 dígitos a ${formData.email}`}
          </p>

          {/* Stepper pills */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                step === 1
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              <span>1. Datos del Lavadero</span>
            </div>
            <div className="w-6 h-0.5 bg-slate-800" />
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                step === 2
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              <span>2. Validación de Correo</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Correo Verificado y Lavadero Creado!</h3>
              <p className="text-slate-400 text-sm">
                Inicializando espacio de trabajo para <strong className="text-blue-400">{formData.businessName}</strong>...
              </p>
            </div>
          ) : step === 1 ? (
            /* STEP 1: FORMULARIO DE DATOS */
            <form onSubmit={handleInitiateRegistration} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre del Negocio */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Nombre Comercial del Lavadero *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ej: Autolavado El Parche VIP"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Nombre del Dueño */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Nombre del Propietario / Gerente *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Diego Alejandro"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  />
                </div>

                {/* Teléfono / WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Teléfono / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+57 310 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Correo Electrónico (Para Validación) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="gerencia@lavadero.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Ciudad */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Ciudad / Ubicación
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Ej: Medellín / Bogotá / Cali"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Botón de Enviar a Validación */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Generando código de seguridad...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Continuar y Enviar Código al Correo</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-slate-400 text-xs">
                  ¿Ya tienes cuenta registrada?{' '}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                    Iniciar Sesión
                  </Link>
                </span>
              </div>
            </form>
          ) : (
            /* STEP 2: VERIFICACIÓN DEL CÓDIGO OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Notificación informativa simulada de correo para testing */}
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">
                    Código de verificación enviado a <span className="text-blue-400">{formData.email}</span>
                  </p>
                  <p className="text-slate-300">
                    Tu código de seguridad de 6 dígitos es:{' '}
                    <span className="font-mono font-bold text-sm text-yellow-300 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30 tracking-widest">
                      {generatedOtp}
                    </span>
                  </p>
                </div>
              </div>

              {otpError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
                  Ingresa el código de 6 dígitos
                </label>
                <div className="relative max-w-xs mx-auto">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="000000"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-center font-mono text-2xl tracking-[0.5em] placeholder:tracking-normal placeholder-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || enteredOtp.length !== 6}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Validando y creando empresa...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>Verificar Código y Activar Empresa</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Cambiar correo o datos</span>
                  </button>

                  <button
                    type="button"
                    disabled={!canResend}
                    onClick={generateAndSendCode}
                    className="hover:text-blue-400 disabled:opacity-40 disabled:hover:text-slate-400 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{canResend ? 'Reenviar código' : `Reenviar en ${countdown}s`}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Desarrollado y respaldado por <strong className="text-slate-400">APPZ PLAY</strong> • Multi-tenant Cloud
        </p>
      </div>
    </div>
  );
}
