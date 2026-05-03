@startuml
title Objective 3: Appointment and Notification Management

actor "Sastre (Tailor)" as Sastre
actor "Customer" as Client
participant "Sastre Mobile Portal" as Mobile
participant "Notification Service" as Notify
participant "Customer Public Portal" as Portal
database "Supabase DB" as DB

== Task Completion & Update ==
Sastre -> Mobile: View Assigned Tasks \n[[07-role-portals/16-sastre-task-portal.html]]
Sastre -> Mobile: Mark Task as "Sewing Done"
Mobile -> DB: Update Order Status
DB --> Mobile: Success

== Automated Notification Trigger ==
Mobile -> Notify: Trigger Status Update Notification
Notify -> Client: Send SMS/Email (Order Update)
Notify -> DB: Log Notification Sent

== Customer Verification ==
Client -> Portal: Access Tracking Link \n[[01-clients-crm/18-customer-public-portal.html]]
Portal -> DB: Fetch Latest Order Timeline
DB --> Portal: Order Data
Portal --> Client: Display Current Status (e.g., "In Sewing Phase")

== Appointment Scheduling ==
Client -> Portal: Book Fitting Appointment
Portal -> DB: Save Appointment Record
DB --> Portal: Confirmation
Portal --> Client: Display Appointment Confirmed

@enduml
