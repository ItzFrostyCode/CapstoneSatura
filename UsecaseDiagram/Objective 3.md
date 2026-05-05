3. Appointment and Notification Management
To schedule fittings, consultations, and order release dates and provide automated
notifications for order updates and deadlines.

Figure 10: Sequence Diagram (Objective 3: Inventory Monitoring & Update)

@startuml
actor "Shop Owner" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open inventory dashboard
System -> DB: Retrieve inventory data
DB -> System: Return inventory records
System -> Actor: Display inventory list

Actor -> System: Update stock quantity
System -> System: Validate stock input
System -> DB: Update inventory record
DB -> System: Confirm update
System -> Actor: Display update confirmation
@enduml

Figure 11: Sequence Diagram (Objective 3: Supplier Order & Restocking)

@startuml
actor "Shop Owner" as Actor
actor "Supplier" as Supplier
participant "System" as System
database "Database" as DB

Actor -> System: Check low stock items
System -> DB: Retrieve inventory status
DB -> System: Return low stock list
System -> Actor: Display low stock items

Actor -> System: Create purchase order
System -> System: Validate order request
System -> Supplier: Send purchase order

Supplier -> System: Confirm order
System -> DB: Save supplier order
DB -> System: Confirm saved

Supplier -> System: Deliver materials
System -> System: Validate delivery

System -> DB: Update inventory stock
DB -> System: Confirm stock updated

System -> Actor: Notify restocking complete
@enduml

Figure 12: Sequence Diagram (Objective 3: Material Allocation for Job Order)

@startuml
actor "Shop Owner" as Actor
actor "Supplier" as Supplier
participant "System" as System
database "Database" as DB

Actor -> System: Check low stock items
System -> DB: Retrieve inventory status
DB -> System: Return low stock list
System -> Actor: Display low stock items

Actor -> System: Create purchase order
System -> System: Validate order request
System -> Supplier: Send purchase order

Supplier -> System: Confirm order
System -> DB: Save supplier order
DB -> System: Confirm saved

Supplier -> System: Deliver materials
System -> System: Validate delivery

System -> DB: Update inventory stock
DB -> System: Confirm stock updated

System -> Actor: Notify restocking complete
@enduml