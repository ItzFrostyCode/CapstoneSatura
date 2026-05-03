@startuml
title Objective 5: Billing and Payment Management

actor "Staff / Manager" as Staff
participant "Finance Module" as Fin
participant "Invoicing Engine" as Inv
database "Supabase DB" as DB

== Payment Recording (Deposit) ==
Staff -> Fin: Record Initial Deposit \n[[04-finance/01-sales-tab.html]]
Fin -> DB: Create Transaction Record (Type: Deposit)
DB --> Fin: Success

== Invoice Generation ==
Fin -> Inv: Request Automated Invoice
Inv -> DB: Fetch Order & Payment Data
DB --> Inv: Data
Inv -> Inv: Calculate Balance Due
Inv --> Staff: Generate PDF/Digital Invoice \n[[04-finance/01-sales-tab.html]]

== Final Payment (Settlement) ==
Staff -> Fin: Record Full Payment / Balance
Fin -> DB: Update Transaction (Type: Full Settlement)
DB -> DB: Update Order Status (Status: Paid)
DB --> Fin: Success
Fin --> Staff: Display Payment Confirmed & Updated Ledger

@enduml
