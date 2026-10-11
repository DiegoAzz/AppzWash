import { PrismaClient, UserRole, SubscriptionPlan, TenantStatus, CommissionType, WashOrderStatus, PaymentStatus, PaymentMethod, CashSessionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Seed de Base de Datos APPZ WASH ---');

  // 1. Tenant Principal
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'autolavado-el-parche' },
    update: {},
    create: {
      slug: 'autolavado-el-parche',
      name: 'AutoLavado El Parche VIP',
      nitRut: '901.482.391-4',
      phone: '+57 312 456 7890',
      email: 'contacto@elparche.com',
      address: 'Av. Circunvalar # 45-12, Sector Los Robles',
      city: 'Cali / Bogotá',
      plan: SubscriptionPlan.PRO,
      status: TenantStatus.ACTIVE,
      currency: 'COP',
    },
  });
  console.log(`✓ Tenant creado/encontrado: ${tenant.name} (${tenant.id})`);

  // 2. Usuarios del Tenant
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@appzplay.com' },
    update: {},
    create: {
      email: 'superadmin@appzplay.com',
      name: 'Super Admin APPZ PLAY',
      passwordHash: 'hash_super_admin_pass',
      role: UserRole.SUPER_ADMIN,
    },
  });

  const tenantOwner = await prisma.user.upsert({
    where: { email: 'dueno@elparche.com' },
    update: { tenantId: tenant.id },
    create: {
      tenantId: tenant.id,
      email: 'dueno@elparche.com',
      name: 'Don Orlando Muñoz (Propietario)',
      passwordHash: 'hash_owner_pass',
      role: UserRole.TENANT_OWNER,
      phone: '+57 300 111 2233',
    },
  });

  const cashier = await prisma.user.upsert({
    where: { email: 'caja@elparche.com' },
    update: { tenantId: tenant.id },
    create: {
      tenantId: tenant.id,
      email: 'caja@elparche.com',
      name: 'Valentina Restrepo (Cajera Principal)',
      passwordHash: 'hash_cashier_pass',
      role: UserRole.CASHIER,
      phone: '+57 315 222 3344',
    },
  });
  console.log('✓ Usuarios de prueba creados (SuperAdmin, Owner, Cashier)');

  // 3. Categorías de Vehículos
  const categoriesData = [
    { name: 'Moto', code: 'MOTO', icon: 'bike', sortOrder: 1 },
    { name: 'Auto (Sedán / Hatchback)', code: 'CAR', icon: 'car', sortOrder: 2 },
    { name: 'Camioneta / SUV', code: 'SUV', icon: 'suv', sortOrder: 3 },
    { name: 'Pesado (Furgón / Camión)', code: 'HEAVY', icon: 'truck', sortOrder: 4 },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const record = await prisma.vehicleCategory.upsert({
      where: {
        tenantId_code: {
          tenantId: tenant.id,
          code: cat.code,
        },
      },
      update: {},
      create: {
        tenantId: tenant.id,
        name: cat.name,
        code: cat.code,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
    });
    categories[cat.code] = record;
  }
  console.log('✓ Categorías de vehículos creadas');

  // 4. Catálogo de Servicios
  const servicesData = [
    { name: 'Lavado Básico (Exterior + Secado)', category: 'LAVADO', estimatedMinutes: 25 },
    { name: 'Lavado General (Interior + Motor + Chasis)', category: 'LAVADO', estimatedMinutes: 50 },
    { name: 'Detallado / Porcelanizado de Pintura', category: 'ESTETICA', estimatedMinutes: 90 },
    { name: 'Desmanchado Profundo de Cojinería', category: 'EXTRA', estimatedMinutes: 45 },
  ];

  const services: Record<string, any> = {};
  for (const serv of servicesData) {
    const existing = await prisma.service.findFirst({
      where: { tenantId: tenant.id, name: serv.name },
    });
    if (existing) {
      services[serv.name] = existing;
    } else {
      const created = await prisma.service.create({
        data: {
          tenantId: tenant.id,
          name: serv.name,
          category: serv.category,
          estimatedMinutes: serv.estimatedMinutes,
        },
      });
      services[serv.name] = created;
    }
  }
  console.log('✓ Servicios creados');

  // 5. Matriz de Tarifas (Service Rates)
  // [Servicio, Categoria, Precio, ComisionTipo, ComisionValor]
  const ratesMatrix = [
    // Básico
    { servName: 'Lavado Básico (Exterior + Secado)', catCode: 'MOTO', price: 15000, comType: CommissionType.PERCENTAGE, comVal: 40 },
    { servName: 'Lavado Básico (Exterior + Secado)', catCode: 'CAR', price: 25000, comType: CommissionType.PERCENTAGE, comVal: 40 },
    { servName: 'Lavado Básico (Exterior + Secado)', catCode: 'SUV', price: 35000, comType: CommissionType.PERCENTAGE, comVal: 40 },
    { servName: 'Lavado Básico (Exterior + Secado)', catCode: 'HEAVY', price: 60000, comType: CommissionType.PERCENTAGE, comVal: 35 },

    // General
    { servName: 'Lavado General (Interior + Motor + Chasis)', catCode: 'MOTO', price: 30000, comType: CommissionType.PERCENTAGE, comVal: 40 },
    { servName: 'Lavado General (Interior + Motor + Chasis)', catCode: 'CAR', price: 55000, comType: CommissionType.PERCENTAGE, comVal: 40 },
    { servName: 'Lavado General (Interior + Motor + Chasis)', catCode: 'SUV', price: 75000, comType: CommissionType.PERCENTAGE, comVal: 40 },
    { servName: 'Lavado General (Interior + Motor + Chasis)', catCode: 'HEAVY', price: 140000, comType: CommissionType.PERCENTAGE, comVal: 35 },

    // Detallado
    { servName: 'Detallado / Porcelanizado de Pintura', catCode: 'CAR', price: 160000, comType: CommissionType.PERCENTAGE, comVal: 45 },
    { servName: 'Detallado / Porcelanizado de Pintura', catCode: 'SUV', price: 220000, comType: CommissionType.PERCENTAGE, comVal: 45 },

    // Desmanchado
    { servName: 'Desmanchado Profundo de Cojinería', catCode: 'CAR', price: 90000, comType: CommissionType.FIXED, comVal: 35000 },
    { servName: 'Desmanchado Profundo de Cojinería', catCode: 'SUV', price: 120000, comType: CommissionType.FIXED, comVal: 45000 },
  ];

  for (const item of ratesMatrix) {
    const s = services[item.servName];
    const c = categories[item.catCode];
    if (s && c) {
      await prisma.serviceRate.upsert({
        where: {
          tenantId_serviceId_vehicleCategoryId: {
            tenantId: tenant.id,
            serviceId: s.id,
            vehicleCategoryId: c.id,
          },
        },
        update: {
          price: item.price,
          commissionType: item.comType,
          commissionValue: item.comVal,
        },
        create: {
          tenantId: tenant.id,
          serviceId: s.id,
          vehicleCategoryId: c.id,
          price: item.price,
          commissionType: item.comType,
          commissionValue: item.comVal,
        },
      });
    }
  }
  console.log('✓ Matriz de tarifas configurada con precios y comisiones');

  // 6. Operarios / Lavadores
  const washersData = [
    { name: 'Carlos Mendoza ("El Paisa")', documentId: '1098234123', phone: '+57 311 001 2233', comType: CommissionType.PERCENTAGE, comVal: 40 },
    { name: 'Jhonny Rivas ("El Flaco")', documentId: '1087456789', phone: '+57 312 334 5566', comType: CommissionType.PERCENTAGE, comVal: 40 },
    { name: 'Brayan Torres', documentId: '1010345678', phone: '+57 314 556 7788', comType: CommissionType.FIXED, comVal: 15000 },
  ];

  const washers: any[] = [];
  for (const w of washersData) {
    const existing = await prisma.washer.findFirst({
      where: { tenantId: tenant.id, name: w.name },
    });
    if (existing) {
      washers.push(existing);
    } else {
      const created = await prisma.washer.create({
        data: {
          tenantId: tenant.id,
          name: w.name,
          documentId: w.documentId,
          phone: w.phone,
          commissionType: w.comType,
          defaultCommissionValue: w.comVal,
        },
      });
      washers.push(created);
    }
  }
  console.log('✓ Operarios/Lavadores registrados');

  // 7. Productos de Mini-market / Cross-selling
  const storeItems = [
    { name: 'Gaseosa Coca-Cola 400ml', category: 'BEBIDAS', price: 4000, cost: 2300, stock: 48 },
    { name: 'Agua Mineral Manantial 500ml', category: 'BEBIDAS', price: 3000, cost: 1500, stock: 36 },
    { name: 'Aromatizante Little Trees Pino', category: 'ACCESORIOS_AUTOS', price: 12000, cost: 6500, stock: 24 },
    { name: 'Silicona Protectora de Tableros 250ml', category: 'ACCESORIOS_AUTOS', price: 20000, cost: 11000, stock: 15 },
  ];

  for (const p of storeItems) {
    const existing = await prisma.storeProduct.findFirst({
      where: { tenantId: tenant.id, name: p.name },
    });
    if (!existing) {
      await prisma.storeProduct.create({
        data: {
          tenantId: tenant.id,
          name: p.name,
          category: p.category,
          price: p.price,
          cost: p.cost,
          stock: p.stock,
        },
      });
    }
  }
  console.log('✓ Mini-market con productos iniciales');

  // 8. Sesión de Caja Abierta
  let cashSession = await prisma.cashSession.findFirst({
    where: { tenantId: tenant.id, status: CashSessionStatus.OPEN },
  });
  if (!cashSession) {
    cashSession = await prisma.cashSession.create({
      data: {
        tenantId: tenant.id,
        userId: cashier.id,
        initialCash: 150000, // $150.000 COP base inicial
        status: CashSessionStatus.OPEN,
        notes: 'Turno mañana apertura regular',
      },
    });
  }
  console.log(`✓ Sesión de caja abierta: ID ${cashSession.id}`);

  console.log('--- Seed completado con éxito para APPZ WASH ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
