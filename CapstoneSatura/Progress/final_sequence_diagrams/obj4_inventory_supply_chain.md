@startuml
title Objective 4: Inventory and Supplier Management

actor "Manager" as Manager
actor "Supplier" as Supplier
participant "Inventory Module" as Inv
participant "Procurement Engine" as PO
database "Supabase DB" as DB

== Stock Monitoring ==
Inv -> DB: Query Stock Levels
DB --> Inv: Stock Data
Inv -> Inv: Check against "Low Stock Threshold" \n[[03-supply-chain/01-inventory-tab.html]]

== Automated Alert ==
alt Stock is Low
  Inv -> Manager: Trigger Dashboard Alert (Stock Low)
end

== Procurement Process ==
Manager -> PO: Generate Purchase Order (PO)
PO -> Supplier: Send Digital PO Request
Supplier --> PO: Acknowledge & Process

== Recording Delivery ==
Supplier -> Manager: Deliver Materials
Manager -> Inv: Record Stock Delivery \n[[03-supply-chain/07-receive-delivery-modal.html]]
Inv -> DB: Update Inventory Levels (+ Stock)
DB --> Inv: Success
Inv --> Manager: Display Updated Stock Status

@enduml
