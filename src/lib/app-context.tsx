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
  TenantRecord,
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

export const INITIAL_TENANTS: TenantRecord[] = [
  {
    id: 'autolavado-el-parche',
    name: 'AutoLavado El Parche VIP',
    ownerName: 'Diego Alejandro',
    email: 'contacto@elparchevip.com',
    phone: '+57 312 456 7890',
    city: 'Medellín',
    plan: 'PRO',
    status: 'ACTIVE',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'lavamotos-el-triunfo',
    name: 'LavaMotos & Carros El Triunfo',
    ownerName: 'Carlos Andrés Mendoza',
    email: 'carlos@eltriunfowash.com',
    phone: '+57 310 987 6543',
    city: 'Bogotá',
    plan: 'BASIC',
    status: 'ACTIVE',
    createdAt: '2026-09-15T00:00:00.000Z',
  },
  {
    id: 'carwash-los-pinos',
    name: 'CarWash & Spa Los Pinos',
    ownerName: 'Mariana Valencia',
    email: 'mariana@lospinos.com',
    phone: '+57 318 555 4321',
    city: 'Cali',
    plan: 'PRO',
    status: 'TRIAL',
    createdAt: '2026-10-01T00:00:00.000Z',
  },
];

interface AppContextType {
  tenantName: string;
  tenantNit: string;
  currentTenantId: string;
  availableTenants: TenantRecord[];
  orders: WashOrder[];
  washers: Washer[];
  categories: VehicleCategory[];
  services: Service[];
  rates: ServiceRate[];
  advances: WasherAdvance[];
  cashSession: CashSession;
  storeProducts: StoreProduct[];
  // Tenant actions
  registerTenant: (data: {
    businessName: string;
    ownerName: string;
    email: string;
    phone: string;
    city: string;
  }) => TenantRecord;
  switchTenant: (tenantId: string) => void;
  toggleTenantStatus: (tenantId: string) => void;
  // Order & Operations actions
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

const STORAGE_KEY = 'appzwash_state_v2';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [availableTenants, setAvailableTenants] = useState<TenantRecord[]>(INITIAL_TENANTS);
  const [currentTenantId, setCurrentTenantId] = useState<string>('autolavado-el-parche');
  
  const currentTenant = availableTenants.find((t) => t.id === currentTenantId) || availableTenants[0];
  const [tenantName, setTenantName] = useState(currentTenant?.name || 'AutoLavado El Parche VIP');
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

  // Update tenantName when currentTenantId changes
  useEffect(() => {
    const t = availableTenants.find((x) => x.id === currentTenantId);
    if (t) setTenantName(t.name);
  }, [currentTenantId, availableTenants]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.availableTenants) setAvailableTenants(parsed.availableTenants);
        if (parsed.currentTenantId) setCurrentTenantId(parsed.currentTenantId);
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
        JSON.stringify({
          availableTenants,
          currentTenantId,
          orders,
          washers,
          advances,
          cashSession,
        })
      );
    } catch (e) {
      console.warn('Error persisting state to localStorage:', e);
    }
  }, [availableTenants, currentTenantId, orders, washers, advances, cashSession, isLoaded]);

  // Register a brand new Tenant
  const registerTenant = (data: {
    businessName: string;
    ownerName: string;
    email: string;
    phone: string;
    city: string;
  }): TenantRecord => {
    const slug = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `lavadero-${Date.now()}`;

    const newTenant: TenantRecord = {
      id: slug,
      name: data.businessName,
      ownerName: data.ownerName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      plan: 'PRO',
      status: 'TRIAL',
      createdAt: new Date().toISOString(),
    };

    setAvailableTenants((prev) => [newTenant, ...prev]);
    setCurrentTenantId(slug);
    setTenantName(newTenant.name);

    // Initial clean empty orders for the new tenant
    setOrders([]);
    setAdvances([]);

    return newTenant;
  };

  const switchTenant = (tenantId: string) => {
    const t = availableTenants.find((x) => x.id === tenantId);
    if (t) {
      setCurrentTenantId(t.id);
      setTenantName(t.name);
    }
  };

  const toggleTenantStatus = (tenantId: string) => {
    setAvailableTenants((prev) =>
      prev.map((t) => {
        if (t.id !== tenantId) return t;
        const nextStatus = t.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
        return { ...t, status: nextStatus };
      })
    );
  };

  const createOrder = (orderData: Omit<WashOrder, 'id' | 'orderNumber' | 'tenantId' | 'entryTime'>): WashOrder => {
    const nextNum = orders.reduce((max, o) => Math.max(max, o.orderNumber), 100) + 1;
    const newOrder: WashOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: nextNum,
      tenantId: currentTenantId,
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
    setAvailableTenants(INITIAL_TENANTS);
    setCurrentTenantId('autolavado-el-parche');
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
        currentTenantId,
        availableTenants,
        orders,
        washers,
        categories,
        services,
        rates,
        advances,
        cashSession,
        storeProducts,
        registerTenant,
        switchTenant,
        toggleTenantStatus,
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
