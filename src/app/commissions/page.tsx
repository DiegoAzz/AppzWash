'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { CommissionSettlementView } from '@/components/commissions/CommissionSettlementView';
import { CashSessionModal } from '@/components/cashier/CashSessionModal';

export default function CommissionsPage() {
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar onOpenCashModal={() => setIsCashModalOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              Liquidación de Comisiones de Operarios
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Cálculo automatizado en tiempo real, deducciones de almuerzos/anticipos y pago de nómina diaria.
            </p>
          </div>

          <CommissionSettlementView />
        </main>
      </div>

      <CashSessionModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
      />
    </div>
  );
}
