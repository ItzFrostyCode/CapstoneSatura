4. Inventory and Supplier Management
To monitor the availability of tailoring materials, and automatically notify the shop
when stock is low, allowing them to request or reorder materials from suppliers to
prevent delays in production.



@startuml
title Figure 11: Sequence Diagram (Objective 4)

actor "Shop Owner / Manager" as User
actor Supplier
participant System
database Database

System -> Database: Check Material Stock Levels
Database --> System: Return Stock Status

System --> User: Display Stock Levels

System -> System: Detect Low Stock
System --> User: Display Low Stock Alert

User -> System: Create Reorder Request
System -> Database: Save Procurement Record
Database --> System: Confirm Save

User -> Supplier: Send Material Request
Supplier --> User: Deliver Materials

User -> System: Record Received Materials
System -> System: Validate Materials

System -> Database: Update Inventory Stock
Database --> System: Confirm Update

System --> User: Display Updated Stock

@enduml