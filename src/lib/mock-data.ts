import { VehicleCategory, Service, ServiceRate, Washer, WashOrder, CashSession, StoreProduct, WasherAdvance } from './types';

export const INITIAL_VEHICLE_CATEGORIES: VehicleCategory[] = [
  { id: 'cat-moto', code: 'MOTO', name: 'Moto', icon: 'bike', sortOrder: 1 },
  { id: 'cat-car', code: 'CAR', name: 'Auto (Sedán / Hatchback)', icon: 'car', sortOrder: 2 },
  { id: 'cat-suv', code: 'SUV', name: 'Camioneta / SUV', icon: 'suv', sortOrder: 3 },
  { id: 'cat-heavy', code: 'HEAVY', name: 'Pesado (Furgón / Camión)', icon: 'truck', sortOrder: 4 },
];

export const INITIAL_SERVICES: Service[] = [
  { id: 'serv-basic', name: 'Lavado Básico (Exterior + Secado)', category: 'LAVADO', estimatedMinutes: 25 },
  { id: 'serv-general', name: 'Lavado General (Interior + Motor + Chasis)', category: 'LAVADO', estimatedMinutes: 50 },
  { id: 'serv-detail', name: 'Detallado / Porcelanizado de Pintura', category: 'ESTETICA', estimatedMinutes: 90 },
  { id: 'serv-seats', name: 'Desmanchado Profundo de Cojinería', category: 'EXTRA', estimatedMinutes: 45 },
];

export const INITIAL_SERVICE_RATES: ServiceRate[] = [
  // Básico
  { id: 'rate-1', serviceId: 'serv-basic', vehicleCategoryId: 'cat-moto', price: 15000, commissionType: 'PERCENTAGE', commissionValue: 40 },
  { id: 'rate-2', serviceId: 'serv-basic', vehicleCategoryId: 'cat-car', price: 25000, commissionType: 'PERCENTAGE', commissionValue: 40 },
  { id: 'rate-3', serviceId: 'serv-basic', vehicleCategoryId: 'cat-suv', price: 35000, commissionType: 'PERCENTAGE', commissionValue: 40 },
  { id: 'rate-4', serviceId: 'serv-basic', vehicleCategoryId: 'cat-heavy', price: 60000, commissionType: 'PERCENTAGE', commissionValue: 35 },

  // General
  { id: 'rate-5', serviceId: 'serv-general', vehicleCategoryId: 'cat-moto', price: 30000, commissionType: 'PERCENTAGE', commissionValue: 40 },
  { id: 'rate-6', serviceId: 'serv-general', vehicleCategoryId: 'cat-car', price: 55000, commissionType: 'PERCENTAGE', commissionValue: 40 },
  { id: 'rate-7', serviceId: 'serv-general', vehicleCategoryId: 'cat-suv', price: 75000, commissionType: 'PERCENTAGE', commissionValue: 40 },
  { id: 'rate-8', serviceId: 'serv-general', vehicleCategoryId: 'cat-heavy', price: 140000, commissionType: 'PERCENTAGE', commissionValue: 35 },

  // Detallado
  { id: 'rate-9', serviceId: 'serv-detail', vehicleCategoryId: 'cat-car', price: 160000, commissionType: 'PERCENTAGE', commissionValue: 45 },
  { id: 'rate-10', serviceId: 'serv-detail', vehicleCategoryId: 'cat-suv', price: 220000, commissionType: 'PERCENTAGE', commissionValue: 45 },

  // Desmanchado
  { id: 'rate-11', serviceId: 'serv-seats', vehicleCategoryId: 'cat-car', price: 90000, commissionType: 'FIXED', commissionValue: 35000 },
  { id: 'rate-12', serviceId: 'serv-seats', vehicleCategoryId: 'cat-suv', price: 120000, commissionType: 'FIXED', commissionValue: 45000 },
];

export const INITIAL_WASHERS: Washer[] = [
  {
    id: 'wash-1',
    name: 'Carlos Mendoza ("El Paisa")',
    documentId: '1098234123',
    phone: '+57 311 001 2233',
    commissionType: 'PERCENTAGE',
    defaultCommissionValue: 40,
    active: true,
  },
  {
    id: 'wash-2',
    name: 'Jhonny Rivas ("El Flaco")',
    documentId: '1087456789',
    phone: '+57 312 334 5566',
    commissionType: 'PERCENTAGE',
    defaultCommissionValue: 40,
    active: true,
  },
  {
    id: 'wash-3',
    name: 'Brayan Torres',
    documentId: '1010345678',
    phone: '+57 314 556 7788',
    commissionType: 'FIXED',
    defaultCommissionValue: 15000,
    active: true,
  },
];

export const INITIAL_ORDERS: WashOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 101,
    tenantId: 'autolavado-el-parche',
    plate: 'KZP-812',
    customerName: 'Santiago Mejía',
    customerPhone: '+57 310 987 6543',
    vehicleCategoryId: 'cat-suv',
    vehicleCategoryName: 'Camioneta / SUV',
    status: 'WAITING',
    preExistingDamage: 'Rayón leve guardabarro delantero derecho',
    items: [
      {
        id: 'item-101-1',
        serviceId: 'serv-general',
        serviceName: 'Lavado General (Interior + Motor + Chasis)',
        price: 75000,
        commissionType: 'PERCENTAGE',
        commissionValue: 30000,
      },
    ],
    totalAmount: 75000,
    washerCommissionTotal: 30000,
    paymentStatus: 'PENDING',
    paymentMethod: 'PENDING',
    entryTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-102',
    orderNumber: 102,
    tenantId: 'autolavado-el-parche',
    plate: 'FTN-304',
    customerName: 'Carolina Restrepo',
    customerPhone: '+57 315 123 4567',
    vehicleCategoryId: 'cat-suv',
    vehicleCategoryName: 'Camioneta / SUV',
    washerId: 'wash-1',
    washerName: 'Carlos Mendoza ("El Paisa")',
    status: 'IN_WASH',
    notes: 'Aplicar aroma vainilla en cabina',
    items: [
      {
        id: 'item-102-1',
        serviceId: 'serv-basic',
        serviceName: 'Lavado Básico (Exterior + Secado)',
        price: 35000,
        commissionType: 'PERCENTAGE',
        commissionValue: 14000,
      },
    ],
    totalAmount: 35000,
    washerCommissionTotal: 14000,
    paymentStatus: 'PENDING',
    paymentMethod: 'PENDING',
    entryTime: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    washStartTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-103',
    orderNumber: 103,
    tenantId: 'autolavado-el-parche',
    plate: 'JLX-990',
    customerName: 'Mauricio Gómez',
    customerPhone: '+57 300 445 6677',
    vehicleCategoryId: 'cat-car',
    vehicleCategoryName: 'Auto (Sedán / Hatchback)',
    washerId: 'wash-2',
    washerName: 'Jhonny Rivas ("El Flaco")',
    status: 'DETAILING',
    notes: 'Cuidado con retrovisores eléctricos',
    items: [
      {
        id: 'item-103-1',
        serviceId: 'serv-detail',
        serviceName: 'Detallado / Porcelanizado de Pintura',
        price: 160000,
        commissionType: 'PERCENTAGE',
        commissionValue: 72000,
      },
    ],
    totalAmount: 160000,
    washerCommissionTotal: 72000,
    paymentStatus: 'PENDING',
    paymentMethod: 'PENDING',
    entryTime: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    washStartTime: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-104',
    orderNumber: 104,
    tenantId: 'autolavado-el-parche',
    plate: 'WXZ-44F',
    customerName: 'Felipe Henao',
    customerPhone: '+57 318 678 9900',
    vehicleCategoryId: 'cat-moto',
    vehicleCategoryName: 'Moto',
    washerId: 'wash-3',
    washerName: 'Brayan Torres',
    status: 'READY',
    items: [
      {
        id: 'item-104-1',
        serviceId: 'serv-basic',
        serviceName: 'Lavado Básico (Exterior + Secado)',
        price: 15000,
        commissionType: 'FIXED',
        commissionValue: 6000,
      },
    ],
    totalAmount: 15000,
    washerCommissionTotal: 6000,
    paymentStatus: 'PENDING',
    paymentMethod: 'PENDING',
    entryTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    washStartTime: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    readyTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'ord-100',
    orderNumber: 100,
    tenantId: 'autolavado-el-parche',
    plate: 'MKL-123',
    customerName: 'Andrés Morales',
    customerPhone: '+57 314 222 3344',
    vehicleCategoryId: 'cat-suv',
    vehicleCategoryName: 'Camioneta / SUV',
    washerId: 'wash-1',
    washerName: 'Carlos Mendoza ("El Paisa")',
    status: 'DELIVERED',
    items: [
      {
        id: 'item-100-1',
        serviceId: 'serv-general',
        serviceName: 'Lavado General (Interior + Motor + Chasis)',
        price: 75000,
        commissionType: 'PERCENTAGE',
        commissionValue: 30000,
      },
    ],
    totalAmount: 75000,
    washerCommissionTotal: 30000,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    entryTime: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    washStartTime: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
    readyTime: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
    exitTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_ADVANCES: WasherAdvance[] = [
  {
    id: 'adv-1',
    washerId: 'wash-1',
    washerName: 'Carlos Mendoza ("El Paisa")',
    amount: 15000,
    reason: 'Almuerzo corriente ejecutivo',
    date: new Date().toISOString(),
    isDeducted: false,
  },
];

export const INITIAL_CASH_SESSION: CashSession = {
  id: 'sess-today',
  userId: 'usr-cashier',
  userName: 'Valentina Restrepo (Caja)',
  openedAt: new Date(new Date().setHours(7, 30, 0, 0)).toISOString(),
  initialCash: 150000,
  calculatedCashSales: 75000, // Order 100 was paid in cash
  status: 'OPEN',
  notes: 'Turno mañana apertura habitual',
};

export const INITIAL_STORE_PRODUCTS: StoreProduct[] = [
  { id: 'prod-1', name: 'Gaseosa Coca-Cola 400ml', category: 'BEBIDAS', price: 4000, cost: 2300, stock: 48 },
  { id: 'prod-2', name: 'Agua Mineral Manantial 500ml', category: 'BEBIDAS', price: 3000, cost: 1500, stock: 36 },
  { id: 'prod-3', name: 'Aromatizante Little Trees Pino', category: 'ACCESORIOS_AUTOS', price: 12000, cost: 6500, stock: 24 },
  { id: 'prod-4', name: 'Silicona Protectora de Tableros 250ml', category: 'ACCESORIOS_AUTOS', price: 20000, cost: 11000, stock: 15 },
];
