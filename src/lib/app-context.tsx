'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WashOrder,
  Washer,
  VehicleCategory,
  Service,
  ServiceRate,
  WashOrderStatus,
  PaymentMethod,
  WasherAdvance,
  CashSession,
  StoreProduct,
} from './types';
import {
  INITIAL_ORDERS,
  INITIAL_WASHERS,
  INITIAL_VEHICLE_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_SERVICE_RATES,
  INITIAL_ADVANCES,
  INITIAL_CASH_SESSION,
  INITIAL_STORE_PRODUCTS,
} from './mock-data';

interface AppContextType {
  tenantName: string;
  tenantNit: string;
  orders: WashOrder[];
  washers: Washer[];
  categories: VehicleCategory[];
  services: Service[];
  rates: ServiceRate[];
  advances: WasherAdvance[];
  cashSession: CashSession;
  storeProducts: StoreProduct[];
  // Actions
  createOrder: (order: Omit<WashOrder, 'id' | 'orderNumber' | 'tenantId' | 'entryTime'>) => WashOrder;
  updateOrderStatus: (orderId: string, status: WashOrderStatus) => void;
  assignWasher: (orderId: string, washerId: string) => void;
  payOrder: (orderId: string, paymentMethod: PaymentMethod, reference?: string) => void;
  addWasherAdvance: (washerId: string, amount: number, reason: string) => void;
  settleWasherPayroll: (washerId: string) => { paidOrdersCount: number; netPaid: number };
  closeCashSession: (actualCashCount: number, notes?: string) => { difference: number };
  openNewCashSession: (initialCash: number, notes?: string) => void;
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'appzwash_state_v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tenantName] = useState('AutoLavado El Parche VIP');
  const [tenantNit] = useState('901.482.391-4');

  const [orders, setOrders] = useState<WashOrder[]>(INITIAL_ORDERS);
  const [washers, setWashers] = useState<Washer[]>(INITIAL_WASHERS);
  const [categories] = useState<VehicleCategory[]>(INITIAL_VEHICLE_CATEGORIES);
  const [services] = useState<Service[]>(INITIAL_SERVICES);
  const [rates] = useState<ServiceRate[]>(INITIAL_SERVICE_RATES);
  const [advances, setAdvances] = useState<WasherAdvance[]>(INITIAL_ADVANCES);
  const [cashSession, setCashSession] = useState<CashSession>(INITIAL_CASH_SESSION);
  const [storeProducts] = useState<StoreProduct[]>(INITIAL_STORE_PRODUCTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.washers) setWashers(parsed.washers);
        if (parsed.advances) setAdvances(parsed.advances);
        if (parsed.cashSession) setCashSession(parsed.cashSession);
      }
    } catch (e) {
      console.warn('Error reading localStorage for AppzWash:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ orders, washers, advances, cashSession })
      );
    } catch (e) {
      console.warn('Error persisting state to localStorage:', e);
    }
  }, [orders, washers, advances, cashSession, isLoaded]);

  const createOrder = (orderData: Omit<WashOrder, 'id' | 'orderNumber' | 'tenantId' | 'entryTime'>): WashOrder => {
    const nextNum = orders.reduce((max, o) => Math.max(max, o.orderNumber), 100) + 1;
    const newOrder: WashOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: nextNum,
      tenantId: 'autolavado-el-parche',
      entryTime: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: WashOrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const now = new Date().toISOString();
        const updated = { ...ord, status };
        if (status === 'IN_WASH' && !ord.washStartTime) updated.washStartTime = now;
        if (status === 'READY' && !ord.readyTime) updated.readyTime = now;
        if (status === 'DELIVERED' && !ord.exitTime) updated.exitTime = now;
        return updated;
      })
    );
  };

  const assignWasher = (orderId: string, washerId: string) => {
    const selectedWasher = washers.find((w) => w.id === washerId);
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          washerId,
          washerName: selectedWasher?.name,
        };
      })
    );
  };

  const payOrder = (orderId: string, paymentMethod: PaymentMethod, reference?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const now = new Date().toISOString();
        return {
          ...ord,
          paymentStatus: 'PAID',
          paymentMethod,
          exitTime: ord.exitTime || now,
          status: 'DELIVERED',
        };
      })
    );

    // Update cash session if paid in cash
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder && paymentMethod === 'CASH') {
      setCashSession((prev) => ({
        ...prev,
        calculatedCashSales: prev.calculatedCashSales + targetOrder.totalAmount,
      }));
    }
  };

  const addWasherAdvance = (washerId: string, amount: number, reason: string) => {
    const washer = washers.find((w) => w.id === washerId);
    const newAdvance: WasherAdvance = {
      id: `adv-${Date.now()}`,
      washerId,
      washerName: washer?.name || 'Operario',
      amount,
      reason,
      date: new Date().toISOString(),
      isDeducted: false,
    };
    setAdvances((prev) => [newAdvance, ...prev]);
  };

  const settleWasherPayroll = (washerId: string) => {
    // Mark advances as deducted
    setAdvances((prev) =>
      prev.map((adv) => (adv.washerId === washerId ? { ...adv, isDeducted: true } : adv))
    );

    // Calculate settlement
    const washerOrders = orders.filter((o) => o.washerId === washerId && o.status === 'DELIVERED');
    const gross = washerOrders.reduce((acc, o) => acc + o.washerCommissionTotal, 0);
    const deductions = advances
      .filter((a) => a.washerId === washerId && !a.isDeducted)
      .reduce((acc, a) => acc + a.amount, 0);

    return {
      paidOrdersCount: washerOrders.length,
      netPaid: Math.max(0, gross - deductions),
    };
  };

  const closeCashSession = (actualCashCount: number, notes?: string) => {
    const totalExpectedCash = cashSession.initialCash + cashSession.calculatedCashSales;
    const difference = actualCashCount - totalExpectedCash;

    setCashSession((prev) => ({
      ...prev,
      status: 'CLOSED',
      closedAt: new Date().toISOString(),
      actualCashCount,
      difference,
      notes: notes || prev.notes,
    }));

    return { difference };
  };

  const openNewCashSession = (initialCash: number, notes?: string) => {
    setCashSession({
      id: `sess-${Date.now()}`,
      userId: 'usr-cashier',
      userName: 'Valentina Restrepo (Caja)',
      openedAt: new Date().toISOString(),
      initialCash,
      calculatedCashSales: 0,
      status: 'OPEN',
      notes: notes || 'Apertura de turno',
    });
  };

  const resetToSampleData = () => {
    setOrders(INITIAL_ORDERS);
    setWashers(INITIAL_WASHERS);
    setAdvances(INITIAL_ADVANCES);
    setCashSession(INITIAL_CASH_SESSION);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        tenantName,
        tenantNit,
        orders,
        washers,
        categories,
        services,
        rates,
        advances,
        cashSession,
        storeProducts,
        createOrder,
        updateOrderStatus,
        assignWasher,
        payOrder,
        addWasherAdvance,
        settleWasherPayroll,
        closeCashSession,
        openNewCashSession,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
