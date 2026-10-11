# PDR: Product Development & Requirements Document
## APPZ WASH — Plataforma SaaS Multi-Tenant para Lavaderos de Vehículos

- **Empresa matriz:** APPZ PLAY  
- **Línea de negocio:** Software as a Service (SaaS) B2B  
- **Versión:** 1.0.0  
- **Fecha de emisión:** Octubre 2026  
- **Arquitecto / Lead:** Equipo de Ingeniería APPZ PLAY  

---

## 1. Visión y Objetivos del Producto

### 1.1. Propósito
APPZ WASH es una plataforma SaaS en la nube diseñada para la gestión operativa, financiera y de personal de negocios de lavado y embellecimiento automotriz (motos, automóviles, camionetas, furgones, buses y camiones).

El sistema resuelve los 4 dolores críticos del gremio:
1. **Control de Caja y Fuga de Dinero:** Trazabilidad estricta de cada vehículo ingresado vs. métodos de pago recibidos.
2. **Liquidación Automatizada de Comisiones:** Cálculo instantáneo de pagos por operario/lavador según porcentajes o tarifas fijas por tipo de vehículo y servicio.
3. **Optimización de Tiempos y Cola de Espera:** Flujo visual Kanban en tiempo real desde la recepción hasta la entrega.
4. **Ingresos Recurrentes (SaaS):** Modelo de suscripción mensual/anual por lavadero con corte automático por falta de pago.

### 1.2. Metas de Negocio para APPZ PLAY
- **Time-to-Market MVP:** Lanzamiento funcional en 3 a 4 semanas.
- **Margen Operativo:** Infraestructura de bajo costo (VPS KVM en Hostinger / Docker) con capacidad de soportar hasta 200 lavaderos en el servidor base.
- **Retención (Churn bajo):** Sistema indispensable para la liquidación diaria de comisiones del lavadero.

---

## 2. Arquitectura del Sistema y Multi-Tenancy

### 2.1. Modelo Multi-Tenant
- **Estrategia:** Base de datos compartida con aislamiento lógico por `tenant_id` y Row-Level Security (RLS) en PostgreSQL.
- Cada lavadero suscrito es un **Tenant**.
- Los datos de clientes, empleados, tarifas y facturación de un lavadero están 100% aislados de los demás.

### 2.2. Stack Tecnológico Estándar
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Shadcn/UI (Diseñado Mobile-First / PWA para tablets y teléfonos de operarios).
- **Backend:** Node.js (TypeScript) con Next.js Server Actions / API Routes + Fastify/NestJS según escalabilidad.
- **Base de Datos:** PostgreSQL 16 con Prisma ORM o Drizzle ORM.
- **Caché & Colas:** Redis (BullMQ para tareas en segundo plano como recordatorios o liquidaciones nocturnas).
- **Despliegue e Infraestructura:** Docker + Docker Compose, Nginx/Caddy como Reverse Proxy en Hostinger VPS (KVM 2).

---

## 3. Modelo de Roles y Permisos (RBAC)

| Rol | Alcance | Funciones Clave |
| :--- | :--- | :--- |
| **Super Admin (APPZ PLAY)** | Global | Gestión de suscripciones, altas/bajas de lavaderos, métricas de negocio. |
| **Tenant Owner (Dueño)** | Lavadero | Configuración de tarifas, comisiones, reportes de utilidades, auditoría. |
| **Cajero / Recepcionista** | Sede/Caja | Registro de vehículos, cobro de tickets, apertura y cierre de caja. |
| **Lavador / Operario** | Operativo | Consulta de sus vehículos asignados y acumulado de comisiones del día. |

---

## 4. Requisitos Funcionales por Módulos (Épicas)

### Módulo 1: Onboarding y Multi-Tenancy
- **RF-1.1:** Registro de lavadero (Nombre comercial, NIT/RUT, teléfono, dirección, logo).
- **RF-1.2:** Asignación de plan de suscripción (Básico, Pro, Empresa) y período de prueba (Trial de 15 días).
- **RF-1.3:** Configuración de sedes/sucursales (1 sede en plan básico, multi-sede en plan Pro).

### Módulo 2: Catálogo de Servicios y Tarifario Dinámico
- **RF-2.1: Matriz de Tipos de Vehículos:**
  - Moto (Bajo cilindraje / Alto cilindraje / Cuatrimoto).
  - Auto (Sedán / Hatchback / Coupé).
  - Camioneta / SUV.
  - Pesados (Furgón / Camión 2 ejes / Volqueta / Tractomula).
- **RF-2.2: Catálogo de Servicios:**
  - Lavado Básico (exterior + secado).
  - Lavado General (interior + motor + chasis).
  - Detallado / Polichado / Porcelanizado.
  - Servicios extra (desmanchado de cojines, aplicación de grafito, etc.).
- **RF-2.3: Asociación Precio vs. Comisión:**
  - *Ejemplo:* Lavado Camioneta SUV = Precio $35.000 | Comisión lavador: 40% ($14.000) o Tarifa fija $12.000.

### Módulo 3: Recepción y Flujo de Lavado (Ticket de Entrada)
- **RF-3.1 (Entrada Express):** Formulario optimizado para móvil:
  - Captura de Placa (Autocompleta si el vehículo ya ha venido antes).
  - Selección de Tipo de Vehículo.
  - Selección de Servicio(s).
  - Asignación de Lavador (Inmediata o a la cola).
  - Observaciones de estado (rayones previos, pertenencias de valor).
- **RF-3.2 (Impresión / Digital):** Emisión de ticket térmico (58mm/80mm Bluetooth o USB) o comprobante digital vía WhatsApp.
- **RF-3.3 (Tablero Kanban de Operaciones):**
  - Columnas: *En Espera ➔ En Lavado ➔ Secado/Detallado ➔ Listo ➔ Entregado/Cobrado*.

### Módulo 4: Liquidación de Comisiones de Operarios
- **RF-4.1:** Registro de operarios/lavadores con su esquema de comisión asignado.
- **RF-4.2:** Reporte diario/semanal por operario:
  - Total vehículos lavados.
  - Desglose por placa y servicio.
  - Total a pagar en comisiones.
- **RF-4.3:** Deducciones y Anticipos: Posibilidad de registrar adelantos de dinero o almuerzos descontados de la comisión del día.
- **RF-4.4:** Cierre y comprobante de liquidación de pago al lavador.

### Módulo 5: Caja, Cobro y Ventas Rápidas (POS Tienda)
- **RF-5.1:** Métodos de Pago: Efectivo, Transferencia (Nequi, Daviplata, Tarjeta, etc.), Mixto.
- **RF-5.2 (Venta cruzada / Mini-market):** Venta rápida de productos de espera (Gaseosas, aguas, aromatizantes, siliconas).
- **RF-5.3 (Arqueo y Cierre de Caja Ciego):**
  - Apertura con base inicial.
  - Cierre con conteo de dinero ingresado vs. ventas registradas en el sistema.
  - Detección de descuadres (faltantes o sobrantes).

---

## 5. Modelo de Datos Relacional (Entidades Principales)
- `tenants`: Datos del lavadero, estado de suscripción, logo, configuración general.
- `users`: Administradores y cajeros (`tenant_id`, email, password_hash, rol).
- `washers`: Empleados lavadores (`tenant_id`, nombre, documento, tipo_comision).
- `vehicle_categories`: Moto, Carro, SUV, Camión, etc.
- `services`: Nombre del servicio, descripción.
- `service_rates`: Matriz de precios (`service_id`, `vehicle_category_id`, precio, comision_valor, comision_tipo).
- `wash_orders`: Ticket principal (`tenant_id`, placa, estado, hora_ingreso, hora_salida, total).
- `commission_records`: Registro inmutable de cuánto ganó cada lavador por orden.
- `cash_sessions`: Control de turnos de caja, bases iniciales y arqueos.

---

## 6. Fases de Desarrollo (Roadmap MVP)

- [ ] **Fase 1: Cimientos y Multi-Tenant (Semana 1)**
  - Documento de Requisitos y Arquitectura (PDR).
  - Inicialización del proyecto Next.js + Tailwind + Prisma ORM.
  - Esquema de Base de Datos PostgreSQL inicial y migraciones.
  - Módulo de Autenticación y aislamiento multi-tenant.
- [ ] **Fase 2: Operación Central (Semana 2)**
  - Configuración de Categorías de Vehículos, Servicios y Tarifas.
  - Módulo de Operarios/Lavadores y esquemas de comisiones.
  - Registro de Entrada de Vehículo (Móvil / Tablet friendly).
  - Tablero Kanban de estados de lavado.
- [ ] **Fase 3: Finanzas y Cierre (Semana 3)**
  - Cobro de tickets y soporte para múltiples métodos de pago.
  - Motor de Liquidación y pago de comisiones a lavadores.
  - Apertura, arqueo y cierre de caja.
- [ ] **Fase 4: Despliegue y Validación (Semana 4)**
  - Dockerización completa (Frontend, Backend, Postgres, Nginx).
  - Despliegue en VPS Hostinger con SSL automático.
  - Pruebas en campo con el primer lavadero piloto.
