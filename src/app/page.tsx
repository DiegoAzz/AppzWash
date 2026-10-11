'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { ExpressIntakeModal } from '@/components/reception/ExpressIntakeModal';
import { TicketModal } from '@/components/cashier/TicketModal';
import { PaymentModal } from '@/components/cashier/PaymentModal';
import { CashSessionModal } from '@/components/cashier/CashSessionModal';
import { WashOrder } from '@/lib/types';

export default function OperationsPage() {
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [activeTicketOrder, setActiveTicketOrder] = useState<WashOrder | null>(null);
  const [activePaymentOrder, setActivePaymentOrder] = useState<WashOrder | null>(null);

  const handleOrderCreated = (order: WashOrder) => {
    setActiveTicketOrder(order);
  };

  const handlePaymentSuccess = (order: WashOrder) => {
    setActiveTicketOrder(order);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        onOpenExpressIntake={() => setIsIntakeOpen(true)}
        onOpenCashModal={() => setIsCashModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
          <KanbanBoard
            onOpenTicket={(order) => setActiveTicketOrder(order)}
            onOpenPayment={(order) => setActivePaymentOrder(order)}
          />
        </main>
      </div>

      {/* Modals */}
      <ExpressIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onOrderCreated={handleOrderCreated}
      />

      <TicketModal
        order={activeTicketOrder}
        isOpen={!!activeTicketOrder}
        onClose={() => setActiveTicketOrder(null)}
      />

      <PaymentModal
        order={activePaymentOrder}
        isOpen={!!activePaymentOrder}
        onClose={() => setActivePaymentOrder(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <CashSessionModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
      />
    </div>
  );
}
