import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/app-context';

export const metadata: Metadata = {
  title: 'APPZ WASH — Software SaaS de Gestión para Lavaderos de Vehículos',
  description: 'Control de caja, liquidación de comisiones, flujo Kanban en tiempo real y facturación multi-tenant para lavaderos automotrices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
