@startuml
title Objective 2: Customer, Measurement, and Order Management

actor "Staff / Designer" as Staff
participant "Sutura Interface" as UI
participant "Smart Estimator" as Logic
database "Supabase DB" as DB

== Customer & Measurement Profiling ==
Staff -> UI: Create Customer Profile \n[[01-clients-crm/02-customers-tab.html]]
UI -> DB: Save Customer Data
Staff -> UI: Input Body Measurements \n[[01-clients-crm/07-measurements-add-modal.html]]
UI -> DB: Store Measurement Snapshot
DB --> UI: Success

== Job Order Creation ==
Staff -> UI: Create New Job Order \n[[02-production/01-job-orders-tab.html]]
UI -> Staff: Request Garment Type & Fabric Selection \n[[02-production/02-job-orders-add-modal.html]]

== Smart Material Estimation ==
UI -> Logic: Calculate Fabric Need (Measurements + Garment Type)
Logic --> UI: Recommended Yardage & Waste Risk
UI -> Staff: Display Smart Estimate \n[[02-production/02-job-orders-add-modal.html]]

== Finalizing Order ==
Staff -> UI: Confirm Order & Assign Staff (Sastre)
UI -> DB: Save Job Order (Status: Queued)
DB --> UI: Order Created Successfully
UI --> Staff: Print Job Order Receipt

@enduml
