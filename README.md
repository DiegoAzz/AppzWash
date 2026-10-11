# 🚗 APPZ WASH — Plataforma SaaS Multi-Tenant para Lavaderos de Vehículos

> Desarrollado por **APPZ PLAY** (Línea de Negocio B2B SaaS)  
> Versión: **1.0.0** | Fecha: **Octubre 2026**

---

## 🌟 Resumen del Sistema

**APPZ WASH** es una plataforma SaaS en la nube diseñada para la gestión operativa, financiera y de personal de negocios de lavado y embellecimiento automotriz (motos, automóviles, camionetas, furgones, buses y camiones).

Resuelve los 4 dolores críticos del gremio:
1. **Control de Caja y Fuga de Dinero:** Trazabilidad estricta de cada vehículo ingresado vs. métodos de pago recibidos y arqueo ciego.
2. **Liquidación Automatizada de Comisiones:** Cálculo instantáneo de pagos por operario/lavador según porcentajes o tarifas fijas por tipo de vehículo y servicio, deduciendo almuerzos y anticipos en tiempo real.
3. **Optimización de Tiempos y Cola de Espera:** Flujo visual Kanban en tiempo real desde la recepción hasta la entrega.
4. **Ingresos Recurrentes (SaaS):** Modelo de suscripción mensual/anual por lavadero con corte automático por falta de pago y soporte multi-sede.

---

## 🏗️ Stack Tecnológico

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Glassmorphism UI (Diseño Mobile-First / PWA para tablets y smartphones de operarios).
- **Backend:** Next.js API Routes / Server Actions en Node.js 20+ con TypeScript.
- **Base de Datos:** PostgreSQL 16 con Prisma ORM (aislamiento lógico `tenant_id`).
- **Infraestructura:** Docker, Docker Compose, Nginx Reverse Proxy (optimizado para Hostinger VPS KVM 2).

---

## 📁 Estructura del Proyecto

```
AppzWash/
├── docs/
│   └── PDR.md                   # Documento de Requisitos y Arquitectura Oficial
├── prisma/
│   ├── schema.prisma            # Esquema relacional Multi-Tenant PostgreSQL
│   └── seed.ts                  # Semilla de datos reales (Tarifas, Lavadores, Turnos)
├── src/
│   ├── app/
│   │   ├── page.tsx             # Tablero Kanban Operativo Central
│   │   ├── reception/page.tsx   # Recepción táctil Express de Vehículos
│   │   ├── commissions/page.tsx # Módulo de Liquidación y Pago a Operarios
│   │   ├── cashier/page.tsx     # Caja, Arqueo Ciego y Mini-Market POS
│   │   ├── services/page.tsx    # Matriz Dinámica de Precios vs. Comisiones
│   │   ├── settings/page.tsx    # Configuración de Tenant y Suscripción SaaS
│   │   ├── globals.css          # Estilos modernos y formato ticket térmico (58mm/80mm)
│   │   └── api/orders/route.ts  # Endpoints REST API
│   ├── components/
│   │   ├── layout/              # Navbar y Sidebar responsivo
│   │   ├── kanban/              # Tablero y Tarjetas de vehículos por estado
│   │   ├── reception/           # Modal de Recepción Express
│   │   ├── cashier/             # Ticket térmico, Modal de Cobro y Arqueo Ciego
│   │   └── commissions/         # Resumen financiero por lavador
│   └── lib/
│       ├── types.ts             # Definición de tipos TypeScript del dominio
│       ├── mock-data.ts         # Datos iniciales para pruebas
│       ├── app-context.tsx      # Estado reactivo global sincronizado con localStorage
│       └── prisma.ts            # Cliente Singleton de Prisma ORM
├── docker/
│   └── nginx/                   # Configuración de Reverse Proxy para VPS
├── Dockerfile                   # Construcción multi-stage de producción
├── docker-compose.yml           # Postgres 16 + Redis + App + Nginx
└── package.json
```

---

## 🚀 Inicio Rápido en Desarrollo Local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Generar cliente Prisma
```bash
npx prisma generate
```

### 3. Ejecutar servidor de desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🐳 Despliegue en Producción (Hostinger VPS KVM)

Para levantar el entorno completo con PostgreSQL 16, Redis, Next.js y Nginx:

```bash
docker compose up -d --build
```

Y ejecutar las migraciones / semillas iniciales:
```bash
docker compose exec app npx prisma db push
docker compose exec app npm run db:seed
```

---

## 📄 Licencia y Propiedad
Propiedad intelectual de **APPZ PLAY** © 2026. Todos los derechos reservados.
