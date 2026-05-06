1. Customer Module
Code snippet

@startuml
left to right direction
actor "Customer" as c

package "Customer Module" {
  usecase "Register/Login" as UC1
  usecase "Book Appointment" as UC2
  usecase "Reschedule Appointment" as UC3
  usecase "Place Job order" as UC4
  usecase "Select Customer info,\nGarment, Fabric, & Order Type" as UC5
  usecase "Payment Full/Deposit" as UC6
  usecase "Apply Promo code/\nDiscount" as UC7
  usecase "View Personal\nmeasurements" as UC8
  usecase "Track Order Status" as UC9
  usecase "Submit Feedback &\nRating" as UC10

  c --> UC1
  c --> UC2
  c --> UC4
  c --> UC8
  c --> UC9
  c --> UC10

  UC1 .> UC2 : <<include>>
  UC3 .> UC2 : <<extend>>
  UC4 .> UC5 : <<include>>
  UC4 .> UC6 : <<include>>
  UC7 .> UC6 : <<extend>>
}
@enduml
2. Subscription Module
Code snippet

@startuml
left to right direction
actor "Shop Owner" as so
actor "System Admin" as sa

package "Subscription Module" {
  usecase "Register Shop Account" as UC1
  usecase "Shop Details" as UC2
  usecase "Process Subscription\nPayment" as UC3
  usecase "Select Subscription\nPlan" as UC4
  usecase "Basic Plan" as UC5
  usecase "Pro Plan" as UC6
  usecase "Premium Plan" as UC7

  usecase "Review Shop Application" as UC8
  usecase "Verify Business\nCredentials" as UC9
  usecase "Authorize Account\nAccess" as UC10
  usecase "Reject Application" as UC11
  usecase "Send Temporary\nCredentials SMS/Email" as UC12
  usecase "Manage Subscription\nTiers" as UC13

  so --> UC1
  so --> UC3

  UC1 .> UC2 : <<include>>
  UC1 .> UC4 : <<include>>
  UC4 .> UC5 : <<include>>
  UC4 .> UC6 : <<include>>
  UC4 .> UC7 : <<include>>

  sa --> UC13
  sa --> UC8

  UC8 .> UC9 : <<include>>
  UC11 .> UC8 : <<extend>>
  UC10 .> UC8 : <<extend>>
  UC12 .> UC10 : <<extend>>
}
@enduml
3. Appointment Module
Code snippet

@startuml
left to right direction
actor "Customer" as c
actor "Owner" as o

package "Appointment module" {
  usecase "Select shops" as UC1
  usecase "Book Appointment" as UC2
  usecase "Customer Info, Garment, Order Type,\nDate & Time" as UC3
  usecase "Check Availability" as UC4
  usecase "Request Reschedule" as UC5
  usecase "Cancel Appointment" as UC6
  usecase "Login" as UC7
  usecase "Manage Shop\nSchedule" as UC8
  usecase "Authorize\nAppointment" as UC9
  usecase "Trigger SMS\nNotification" as UC10

  c --> UC1
  c --> UC2
  c --> UC6
  c --> UC7
  o --> UC7
  o --> UC8
  o --> UC9

  UC2 .> UC3 : <<include>>
  UC2 .> UC4 : <<include>>
  UC5 .> UC2 : <<extend>>
  UC10 .> UC9 : <<extend>>
}
@enduml
4. Customer Job & Fulfillment Order
Code snippet

@startuml
left to right direction
actor "Customer" as c
actor "Tailoring Staff" as ts
actor "Shop Owner" as so
actor "Sastre" as s

package "Customer Job & Fulfillment Order" {
  usecase "Place Job Order" as UC1
  usecase "Select Garment,\nFabric, & Order Type" as UC2
  usecase "Process Payment" as UC3
  usecase "Full/Deposit" as UC4
  usecase "Apply Discount" as UC5
  usecase "Track Order Status" as UC6
  usecase "Finalize Pick up &\nFeedback" as UC7

  usecase "Manage Fitting\nSession" as UC8
  usecase "Manage\nMeasurement" as UC9
  usecase "Take Body\nMeasurement" as UC10
  usecase "Create/Retrieve\nCustomer Profile" as UC11

  usecase "Approve Orders\nFeasibility" as UC12
  usecase "Reject Orders" as UC13
  usecase "Check & Allocate\nMaterials" as UC14
  usecase "Perform Quality\nCheck" as UC15
  usecase "Request\nAdjustment/Alteration" as UC16
  usecase "Distribute Orders to\nSastre" as UC17

  usecase "Retrieve Allocated\nPhysical Materials" as UC18
  usecase "Fabricate Garment" as UC19
  usecase "Perform\nAdjustments/Alteration" as UC20

  c --> UC1
  c --> UC3
  c --> UC6
  c --> UC7
  c --> UC8

  ts --> UC8
  ts --> UC9
  ts --> UC11

  so --> UC12
  so --> UC15
  so --> UC17

  s --> UC18
  s --> UC19
  s --> UC20

  UC1 .> UC2 : <<include>>
  UC1 .> UC3 : <<include>>
  UC3 .> UC4 : <<include>>
  UC5 .> UC4 : <<extend>>

  UC10 .> UC9 : <<extend>>

  UC13 .> UC12 : <<extend>>
  UC12 .> UC14 : <<include>>

  UC16 .> UC15 : <<extend>>
  
  UC18 .> UC17 : <<extend>>
  UC20 .> UC16 : <<extend>>
}
@enduml
5. Inventory & Supplier Module
Code snippet

@startuml
left to right direction
actor "Shop Owner" as so
actor "Tailoring Staff" as ts
actor "Supplier" as s

package "Inventory & Supplier Module" {
  usecase "Track Supplier\nPerformance" as UC1
  usecase "Approve Order\nFeasibility" as UC2
  usecase "Check & Allocate\nMaterials" as UC3
  usecase "Manage \"On-Hold\"\nQueue" as UC4
  usecase "Review & Approve\nPurchase Orders(PO)" as UC5
  usecase "Send Delivery ETA" as UC6

  usecase "Monitor Stock Levels" as UC7
  usecase "Generate Purchase\nOrder" as UC8
  usecase "Audit Order History" as UC9
  usecase "Manage Supplier\nRecords" as UC10
  usecase "Conduct Quality\nCheck" as UC11
  usecase "Receive Physical\nMaterials" as UC12
  usecase "Update Digital\nInventory" as UC13
  usecase "Log Delivery\nDiscrepancy" as UC14

  so --> UC1
  so --> UC2
  so --> UC5

  ts --> UC7
  ts --> UC9
  ts --> UC10
  ts --> UC11

  s --> UC8
  s --> UC6

  UC2 .> UC3 : <<include>>
  UC4 .> UC3 : <<extend>>
  UC6 .> UC5 : <<extend>>

  UC7 .> UC8 : <<include>>
  
  UC11 .> UC12 : <<include>>
  UC11 .> UC13 : <<include>>
  UC11 .> UC14 : <<include>>
}
@enduml
6. Administrative Dashboard
Code snippet

@startuml
left to right direction
actor "Admin" as a

package "Administrative Dashboard" {
  usecase "Login" as UC1
  usecase "Manage Tailoring\nAccounts" as UC2
  usecase "Active or Inactive\nAccount" as UC3
  usecase "Manage Subscription\nPlans" as UC4
  usecase "Manage Tailoring\nOwners Account" as UC5
  usecase "Manage Account" as UC6
  usecase "Manage Role" as UC7
  usecase "Manage Permission" as UC8
  usecase "Manage Tailoring\nRegistration" as UC9
  usecase "Accept or Decline\nRegistration" as UC10
  usecase "System Monitor and\nAnalysis" as UC11
  usecase "Payment Monitoring" as UC12
  usecase "Audit Logs" as UC13
  usecase "Reports" as UC14

  a --> UC1
  a --> UC2
  a --> UC4
  a --> UC5
  a --> UC9
  a --> UC11

  UC2 .> UC3 : <<include>>
  
  UC5 .> UC6 : <<include>>
  UC5 .> UC7 : <<include>>
  UC7 .> UC8 : <<include>>
  
  UC9 .> UC10 : <<include>>
  
  UC11 .> UC12 : <<include>>
  UC11 .> UC13 : <<include>>
  UC11 .> UC14 : <<include>>
}
@enduml






@startuml
left to right direction

actor "Customer" as Customer
actor "Fashion Designer" as FashionDesigner

FashionDesigner -up-|> Customer

package "System" {
  usecase "Register/Login" as UC1
  usecase "Avail Subscription\nPlan" as UC2
  usecase "Book Appointment" as UC3
  usecase "Create/Share Design\nPost" as UC4
  usecase "Create/Retrieve\nCustomer Profile" as UC5
}

Customer --> UC1
FashionDesigner --> UC2

UC3 .> UC2 : <<include>>
UC4 .> UC2 : <<include>>
UC5 .> UC2 : <<include>>

@enduml







