export type UserRole = 'SUPER_ADMIN' | 'TENANT_OWNER' | 'MANAGER' | 'CASHIER' | 'WASHER';

export type WashOrderStatus = 'WAITING' | 'IN_WASH' | 'DETAILING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED';

export type PaymentMethod = 'CASH' | 'TRANSFER_NEQUI' | 'TRANSFER_DAVIPLATA' | 'CARD' | 'MIXED' | 'PENDING';

export type CommissionType = 'PERCENTAGE' | 'FIXED';

export interface VehicleCategory {
  id: string;
  name: string;
  code: string;
  icon: string;
  sortOrder: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  estimatedMinutes: number;
}

export interface ServiceRate {
  id: string;
  serviceId: string;
  vehicleCategoryId: string;
  price: number;
  commissionType: CommissionType;
  commissionValue: number;
}

export interface Washer {
  id: string;
  name: string;
  documentId?: string;
  phone?: string;
  commissionType: CommissionType;
  defaultCommissionValue: number;
  active: boolean;
  avatarUrl?: string;
}

export interface OrderItem {
  id: string;
  serviceId: string;
  serviceName: string;
  price: number;
  commissionType: CommissionType;
  commissionValue: number;
}

export interface WashOrder {
  id: string;
  orderNumber: number;
  tenantId: string;
  plate: string;
  customerName?: string;
  customerPhone?: string;
  vehicleCategoryId: string;
  vehicleCategoryName: string;
  washerId?: string;
  washerName?: string;
  status: WashOrderStatus;
  notes?: string;
  preExistingDamage?: string;
  items: OrderItem[];
  totalAmount: number;
  washerCommissionTotal: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  entryTime: string; // ISO string
  washStartTime?: string;
  readyTime?: string;
  exitTime?: string;
}

export interface WasherAdvance {
  id: string;
  washerId: string;
  washerName: string;
  amount: number;
  reason: string;
  date: string;
  isDeducted: boolean;
}

export interface CommissionSettlementSummary {
  washerId: string;
  washerName: string;
  totalOrdersCount: number;
  grossCommission: number;
  advancesDeducted: number;
  netPayable: number;
}

export interface CashSession {
  id: string;
  userId: string;
  userName: string;
  openedAt: string;
  closedAt?: string;
  initialCash: number;
  calculatedCashSales: number;
  actualCashCount?: number;
  difference?: number;
  status: 'OPEN' | 'CLOSED';
  notes?: string;
}

export interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
}
