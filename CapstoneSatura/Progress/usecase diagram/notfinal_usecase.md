@startuml
title Sutura Tailoring Management System — Standard Unified Use Case Diagram
footer Consolidated Business & Core Functional View

left to right direction
skinparam dpi 150
skinparam monochrome true
skinparam shadowing false
skinparam defaultFontName Arial
skinparam packageStyle rectangle

' ── ACTOR HIERARCHY ──
actor "Staff" as staff
actor "Manager" as manager
actor "Shop Owner" as owner

manager --|> staff
owner --|> manager

actor "Sastre" as sastre
actor "Platform Admin" as admin
actor "Supplier" as supplier
actor "Customer" as customer

' ── SYSTEM BOUNDARY ─────────────────────────
rectangle "Sutura Tailoring Management System" {

  ' ── CUSTOMER & FRONT-END MODULE ──
  rectangle "Customer Portal (Viewer/Requester)" {
    usecase "Track Order Status" as UC_C01
    usecase "View Order Timeline" as UC_C01_1
    usecase "View Shop Profile" as UC_C02 <<Premium>>
    usecase "Open in Google Maps" as UC_C02_1 <<Premium>>
    usecase "View Premade Designs" as UC_C03 <<Premium>>
    usecase "Request Style" as UC_C03_1 <<Premium>>
    usecase "Book Appointment" as UC_C04 <<Pro>>
    
    UC_C01 ..> UC_C01_1 : <<include>>
    UC_C02 ..> UC_C02_1 : <<include>>
    UC_C03 <.. UC_C03_1 : <<extend>>
  }

  ' ── CORE TAILORING OPERATIONS ──
  rectangle "Production & Order Management" {
    usecase "Manage Job Orders" as UC_B05
    usecase "Update Order Status" as UC_ST02
    usecase "Assign Order" as UC_B08
    usecase "Record Body Measurement" as UC_P02
    usecase "Perform Quality Check" as UC_B09
    usecase "Manage Customers" as UC_B04
  }

  ' ── BUSINESS & FINANCE ──
  rectangle "Shop Administration" {
    usecase "Manage User Accounts" as UC_B01
    usecase "Process Payments" as UC_B06
    usecase "Generate Invoice" as UC_P03
    usecase "View Financial Reports" as UC_P04
    usecase "Manage Inventory" as UC_P05
    usecase "Manage Suppliers" as UC_IS03
    usecase "Record Stock Delivery" as UC_IS06
    usecase "Manage Shop Profile" as UC_M01 <<Premium>>
    usecase "Manage Premade Designs" as UC_M02 <<Premium>>
  }

  ' ── PLATFORM LEVEL ──
  rectangle "Platform Management" {
    usecase "Manage Subscription Plans" as UC_A03
    usecase "Review Shop Registrations" as UC_A01
    usecase "Monitor Platform Activity" as UC_A04
  }
}

' ── ASSOCIATIONS ───────────────────────────

' Customer Interactions
customer --> UC_C01
customer --> UC_C02
customer --> UC_C03
customer --> UC_C04

' Internal Staff
staff --> UC_B05
staff --> UC_P02
staff --> UC_B04

' Sastre (Production)
sastre --> UC_ST02

' Management
manager --> UC_B08
manager --> UC_B09
manager --> UC_P04
manager --> UC_P05
manager --> UC_M02

' Ownership
owner --> UC_B01
owner --> UC_B06
owner --> UC_IS03
owner --> UC_M01

' External Entities
supplier --> UC_IS06
admin --> UC_A01
admin --> UC_A03
admin --> UC_A04

' Relationships
UC_B06 ..> UC_P03 : <<include>>

@enduml

