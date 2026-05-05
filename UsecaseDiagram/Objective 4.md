4. Inventory and Supplier Management
To monitor the availability of tailoring materials, and automatically notify the shop
when stock is low, allowing them to request or reorder materials from suppliers to
prevent delays in production.




Figure 13: Sequence Diagram (Objective 4: Generate Business Reports)

@startuml
actor "Shop Owner" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open reports dashboard
System -> Actor: Display report options

Actor -> System: Select report type
System -> System: Validate request

System -> DB: Retrieve report data
DB -> System: Return processed data

System -> System: Generate report
System -> Actor: Display report
@enduml

Figure 14: Sequence Diagram (Objective 4: Sales & Order Analytics)
@startuml
actor "Shop Owner" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open reports dashboard
System -> Actor: Display report options

Actor -> System: Select report type
System -> System: Validate request

System -> DB: Retrieve report data
DB -> System: Return processed data

System -> System: Generate report
System -> Actor: Display report
@enduml



Figure 15: Sequence Diagram (Objective 4: Performance Monitoring)

@startuml
actor "Shop Owner" as Actor
participant "SUTURA System" as System
database "Database" as DB

Actor -> System: Open performance metrics
System -> DB: Retrieve system metrics
DB -> System: Return metrics data

System -> System: Process KPIs
System -> Actor: Display performance results
@enduml