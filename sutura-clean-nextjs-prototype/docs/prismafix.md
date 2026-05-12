SUTURA — Prisma Schema Fixes
3 issues found and corrected. Copy the fixed model blocks below into your prisma/schema.prisma.

Fix 1 — Duplicate createdOrders Relation in User Model
Problem: createdOrders is declared twice under different relation names, which Prisma will reject at prisma generate.
Before (broken):
prismamodel User {
  ...
  createdOrders   Order[]   @relation("OrderCreator")
  assignedOrders  Order[]   @relation("OrderAssignee")
  ...
  requestedPurchaseOrders PurchaseOrder[] @relation("OrderRequester")
  createdOrders           Order[]         @relation("OrderCreator")   // ← DUPLICATE, DELETE THIS LINE
  supportMessages         SupportTicketMessage[] @relation("TicketMessageSender")
  ...
}
After (fixed):
prismamodel User {
  id            String        @id @default(cuid())
  role          UserRole      @default(CUSTOMER)
  name          String
  email         String        @unique
  passwordHash  String
  status        AccountStatus @default(ACTIVE)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  shopsOwned              Shop[]
  branchMembers           BranchMember[]
  customers               Customer[]
  createdOrders           Order[]                @relation("OrderCreator")   // keep once
  assignedOrders          Order[]                @relation("OrderAssignee")
  statusHistory           OrderStatusHistory[]
  notifications           Notification[]
  auditLogs               AuditLog[]
  payments                Payment[]
  recordedMeasurements    CustomerMeasurement[]  @relation("MeasurementRecorder")
  inventoryMovements      InventoryMovement[]
  requestedPurchaseOrders PurchaseOrder[]        @relation("OrderRequester")
  supportMessages         SupportTicketMessage[] @relation("TicketMessageSender")
  assignedTasks           ProductionTask[]
  inspections             OrderInspection[]
  goodsReceipts           GoodsReceipt[]
  stockTransfers          StockTransfer[]
  designerProfile         DesignerProfile?
  convertedProposals      ProposalHandoff[]
  supportTickets          SupportTicket[]
  appointments            Appointment[]          @relation("StaffAppointment")
  suspensionsPerformed    TenantSuspensionLog[]  @relation("SuspensionActor")
  verificationActions     TenantVerificationHistory[]
}

Fix 2 — Missing shopId in Appointment Model
Problem: The SQL schema and ERD both show Appointments linked to SHOPS, but the Prisma Appointment model only has branchId and customerId. shopId is missing entirely.
Before (missing field):
prismamodel Appointment {
  id              String  @id @default(cuid())
  // shopId is missing here!
  branchId        String
  customerId      String
  ...
}
After (fixed):
prismamodel Appointment {
  id              String            @id @default(cuid())
  shopId          String                                    // ← ADDED
  shop            Shop              @relation(fields: [shopId], references: [id])  // ← ADDED
  branchId        String
  customerId      String
  customer        Customer          @relation(fields: [customerId], references: [id])
  assignedStaffId String?
  staff           User?             @relation("StaffAppointment", fields: [assignedStaffId], references: [id])
  appointmentType AppointmentType
  status          AppointmentStatus @default(SCHEDULED)
  date            DateTime
  startTime       String
  durationMinutes Int
  notes           String?
  createdAt       DateTime          @default(now())
  orderId         String?
  order           Order?            @relation(fields: [orderId], references: [id])
  fittingSessions FittingSession[]
}
Also update Shop model to add the back-relation:
prismamodel Shop {
  ...
  appointments    Appointment[]   // ← ADD THIS LINE
  ...
}

Fix 3 — Circular FK Between Order ↔ Appointment (No Code Change — Operational Guidance)
Problem: Order has appointmentId? → Appointment, and Appointment has orderId? → Order. Both reference each other. This doesn't break Prisma (both are optional ?) but causes a chicken-and-egg problem at runtime — you can't create both with FKs at the same time.
No schema change needed. Both fields are already optional (String?), which is correct. The fix is operational — follow this creation order in your code:
typescript// Step 1: Create Appointment first (orderId is null at this point)
const appointment = await prisma.appointment.create({
  data: {
    shopId: '...',
    branchId: '...',
    customerId: '...',
    appointmentType: 'FITTING',
    status: 'SCHEDULED',
    date: new Date(),
    startTime: '10:00',
    durationMinutes: 60,
    // orderId: left null intentionally
  }
});

// Step 2: Create the Order, linking to the appointment
const order = await prisma.order.create({
  data: {
    ...
    appointmentId: appointment.id,  // link here
  }
});

// Step 3: Update Appointment to back-link the order
await prisma.appointment.update({
  where: { id: appointment.id },
  data: { orderId: order.id },
});
Use a prisma.$transaction([...]) wrapper around all 3 steps so they either all succeed or all roll back.

Summary
#Model AffectedIssueAction1UserDuplicate createdOrders field crashes prisma generateDelete the second duplicate line2Appointment + ShopshopId missing from Prisma model (present in SQL/ERD)Add shopId, shop field, and back-relation in Shop3Order ↔ AppointmentCircular FK — intentional but needs careful insert orderNo schema change; use 3-step transaction pattern in code