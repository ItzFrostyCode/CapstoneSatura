@startuml
title Objective 1: Business Registration, Subscription, and User Management

actor "User (Shop Owner / Designer)" as User
participant "Sutura Interface" as UI
participant "Subscription Engine" as Sub
participant "Payment Gateway" as Pay
database "Supabase DB" as DB

== Registration & Account Creation ==
User -> UI: Register Account (Email/Password) \n[[00-auth/02-register.html]]
UI -> DB: Create User Record (Status: Pending)
DB --> UI: Success
UI --> User: Display Subscription Plans \n[[00-auth/03-plan-selection.html]]

== Subscription Plan Selection ==
User -> UI: Select Plan (Basic/Pro/Premium) \n[[00-auth/03-plan-selection.html]]
UI -> Sub: Initialize Plan Subscription
Sub -> UI: Show Payment Form

== Payment Processing ==
User -> UI: Enter Payment Details (GCash/Card)
UI -> Pay: Process Transaction
Pay --> UI: Payment Authorized
UI -> Sub: Confirm Subscription Activation

== Role-Based Setup ==
Sub -> DB: Update User Account (Role, Plan_ID, Expiry)
DB --> UI: Account Activated
UI -> User: Grant Access to Role-Based Dashboard \n[[00-dashboard/01-dashboard.html]]

note right of User
  Fashion Designers access 
  "Designer Portfolio" 
  while Shop Owners access 
  "Admin Dashboard"
end note

@enduml
