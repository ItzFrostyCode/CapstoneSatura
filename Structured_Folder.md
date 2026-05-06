sutura-nextjs-prototype/
│
├── app/
│   │
│   ├── (public)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── pricing/
│   │   └── page.tsx
│   │
│   ├── (customer-portal)/
│   │   ├── customer/
│   │   │   ├── dashboard/
│   │   │   ├── appointments/
│   │   │   ├── orders/
│   │   │   ├── invoices/
│   │   │   ├── notifications/
│   │   │   ├── profile/
│   │   │   └── measurements/
│   │
│   ├── (owner-portal)/
│   │   ├── owner/
│   │   │   ├── dashboard/
│   │   │   ├── branches/
│   │   │   ├── staff/
│   │   │   ├── customers/
│   │   │   ├── appointments/
│   │   │   ├── orders/
│   │   │   ├── inventory/
│   │   │   ├── suppliers/
│   │   │   ├── billing/
│   │   │   ├── reports/
│   │   │   ├── analytics/
│   │   │   ├── subscription/
│   │   │   └── settings/
│   │
│   ├── (staff-portal)/
│   │   ├── staff/
│   │   │   ├── dashboard/
│   │   │   ├── tasks/
│   │   │   ├── measurements/
│   │   │   ├── fittings/
│   │   │   ├── production/
│   │   │   └── notifications/
│   │
│   ├── (designer-portal)/
│   │   ├── designer/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── posts/
│   │   │   ├── portfolio/
│   │   │   └── designs/
│   │
│   ├── (admin-portal)/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── subscriptions/
│   │   │   ├── businesses/
│   │   │   ├── users/
│   │   │   ├── reports/
│   │   │   ├── audit-logs/
│   │   │   └── settings/
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── orders/
│   │   ├── inventory/
│   │   ├── appointments/
│   │   ├── billing/
│   │   └── notifications/
│   │
│   ├── layout.tsx
│   └── globals.css
│
│
├── components/
│   │
│   ├── ui/
│   │   ├── buttons/
│   │   ├── cards/
│   │   ├── tables/
│   │   ├── forms/
│   │   ├── modals/
│   │   ├── charts/
│   │   └── inputs/
│   │
│   ├── shared/
│   │   ├── sidebar/
│   │   ├── navbar/
│   │   ├── breadcrumbs/
│   │   ├── notifications/
│   │   └── loaders/
│   │
│   ├── owner/
│   ├── customer/
│   ├── staff/
│   ├── admin/
│   └── designer/
│
│
├── features/
│   │
│   ├── auth/
│   ├── customers/
│   ├── measurements/
│   ├── appointments/
│   ├── orders/
│   ├── production/
│   ├── inventory/
│   ├── suppliers/
│   ├── billing/
│   ├── reports/
│   ├── analytics/
│   ├── notifications/
│   ├── subscription/
│   └── designer-posts/
│
│
├── services/
│   │
│   ├── auth.service.ts
│   ├── order.service.ts
│   ├── inventory.service.ts
│   ├── billing.service.ts
│   ├── report.service.ts
│   ├── notification.service.ts
│   └── dashboard.service.ts
│
│
├── repositories/
│   │
│   ├── customer.repository.ts
│   ├── order.repository.ts
│   ├── inventory.repository.ts
│   ├── payment.repository.ts
│   └── supplier.repository.ts
│
│
├── models/
│   │
│   ├── user.model.ts
│   ├── customer.model.ts
│   ├── measurement.model.ts
│   ├── appointment.model.ts
│   ├── order.model.ts
│   ├── task.model.ts
│   ├── inventory.model.ts
│   ├── supplier.model.ts
│   ├── invoice.model.ts
│   ├── payment.model.ts
│   ├── notification.model.ts
│   ├── designer-post.model.ts
│   └── report.model.ts
│
│
├── lib/
│   │
│   ├── prisma.ts
│   ├── auth.ts
│   ├── permissions.ts
│   ├── validators.ts
│   ├── constants.ts
│   └── utils.ts
│
│
├── hooks/
│   ├── useAuth.ts
│   ├── useOrders.ts
│   ├── useInventory.ts
│   └── useNotifications.ts
│
│
├── store/
│   ├── auth.store.ts
│   ├── order.store.ts
│   ├── inventory.store.ts
│   └── dashboard.store.ts
│
│
├── types/
│   ├── auth.types.ts
│   ├── order.types.ts
│   ├── inventory.types.ts
│   └── common.types.ts
│
│
├── data/
│   ├── mock/
│   └── seed/
│
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
│
├── middleware.ts
├── .env
├── tsconfig.json
└── package.json


════════════════════════════════════════════════════════════════════════════════
  SUTURA CLEAN ARCHITECTURE [ACTIVE IMPLEMENTATION] · HYBRID PROTOTYPE (LIVE)
  Next.js 16 + React 19 · JSON Persistence · Zustand State Authority
════════════════════════════════════════════════════════════════════════════════

sutura-clean-nextjs-prototype/
│
│  ┌─────────────────────────────────────────────────────────────────────┐
│  │  CURRENT PROTOTYPE STATUS (Audit-Ready)                             │
│  │  • Data Source: flat-file JSON (data/*.json)                        │
│  │  • State Authority: Zustand (useERPStore.ts)                        │
│  │  • Auth Strategy: Middleware-based role isolation                    │
│  │  • UI Framework: Next.js 16 (App Router) + Tailwind 4               │
│  └─────────────────────────────────────────────────────────────────────┘
│
├── app/                              ← [UI LAYER] Next.js App Router root
│   │
│   ├── layout.tsx                    ← Root layout (fonts, metadata)
│   ├── page.tsx                      ← Landing / Redirect Gateway
│   │
│   ├── (auth)/                       ← Auth & Role-based Login
│   ├── (owner-portal)/               ← Owner Dashboard & ERP Modules
│   ├── (customer-portal)/            ← Customer Tracking & Designs
│   ├── (staff-portal)/               ← Staff Task Management
│   ├── (designer-portal)/            ← Designer Portfolio
│   ├── (admin-portal)/               ← Platform Administration
│   └── api/                          ← [TRANSITIONAL] Prototype API routes
│
├── components/                       ← [UI LAYER] Reusable UI library
│   ├── ui/                           ← Atomic components (Buttons, Modals)
│   ├── shared/                       ← Cross-portal (Sidebar, Navbar)
│   └── [role]/                       ← Portal-specific components
│
├── features/                         ← [LOGIC LAYER] Domain-driven features
│   ├── orders/                       ← Order lifecycle logic
│   ├── inventory/                    ← Stock calculation logic
│   └── billing/                      ← Financial aging logic
│
├── services/                         ← [LOGIC LAYER] Business services
│   ├── auth.service.ts               ← Session & permission helpers
│   └── order.service.ts              ← Domain orchestration
│
├── repositories/                     ← [FUTURE LAYER] Data Access Layer
│                                      (Planned for Prisma/Supabase migration)
│
├── models/                           ← [TYPE LAYER] Domain Definitions
│                                      (TypeScript interfaces & Zod schemas)
│
├── lib/                              ← [UTILITY LAYER] Core helpers
│   ├── db.ts                         ← [LIVE] JSON File Read/Write bridge
│   ├── permissions.ts                ← Role-based access control (RBAC)
│   └── utils.ts                      ← Formatting & generic helpers
│
├── hooks/                            ← [REACT LAYER] Shared hooks
│
├── store/                            ← [STATE LAYER] Single Source of Truth
│   └── useERPStore.ts                ← [LIVE AUTHORITY] Zustand Store
│                                      (Hydrated from JSON on boot)
│
├── types/                            ← Shared TypeScript types
│
├── data/                             ← [PROTOTYPE DB] Live persistence
│   ├── APPOINTMENT_SCHEMA.md         ← Audit Documentation
│   ├── orders.json                   ← Live Order Records
│   ├── inventory.json                ← Live Stock Records
│   └── ...                           ← (25+ JSON data files)
│
├── prisma/                           ← [FUTURE LAYER] Database Schema
│   └── schema.prisma                 ← (Planned/Unconnected)
│
│
│  ┌─────────────────────────────────────────────────────────────────────┐
│  │  CLEAN ARCHITECTURE GUIDELINES (Next 16 + React 19)                 │
│  │                                                                     │
│  │  1. UI goes in app/ (routing) and components/ (reusable).           │
│  │  2. Business Logic stays in features/ and services/.               │
│  │  3. State is managed exclusively via store/ (Zustand).              │
│  │  4. Data Persistence in prototype is in data/ (JSON bridge).        │
│  │  5. Future-Proofing: Repositories & Prisma are pre-defined but      │
│  │     not yet wired to the active prototype runtime.                  │
│  │  6. Security: Roles & Auth are enforced in middleware.ts.           │
│  └─────────────────────────────────────────────────────────────────────┘
│
├── middleware.ts                      ← RBAC & Portal Redirects
├── next.config.ts                     ← Next.js configuration
└── package.json                       ← Core dependencies (React 19)