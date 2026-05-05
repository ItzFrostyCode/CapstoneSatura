6. Reports and Administrative Management
To generate operational and inventory reports and provide dashboards for
monitoring business and supply chain activities.



@startuml
title Figure 23: Sequence Diagram (Objective 6)

@startuml
actor "Admin / Shop Owner" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open reports module
System -> Actor: Display report options
Actor -> System: Select operational report
System -> System: Validate report request
System -> DB: Retrieve operational data
DB -> System: Return report data
System -> Actor: Display generated report
@enduml



@startuml
title Figure 24: Sequence Diagram (Objective 6)

@startuml
actor "Admin / Shop Owner" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Select inventory report
System -> System: Validate request
System -> DB: Retrieve inventory data
DB -> System: Return inventory records
System -> Actor: Display inventory report
@enduml





@startuml
title Figure 25: Sequence Diagram (Objective 6)

@startuml
actor "Admin / Shop Owner" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open dashboard
System -> DB: Retrieve system statistics
DB -> System: Return dashboard data
System -> Actor: Display dashboard overview
@enduml





@startuml
title Figure 26: Sequence Diagram (Objective 6)

@startuml
actor "Admin / Shop Owner" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: View business activity logs
System -> DB: Retrieve activity records
DB -> System: Return activity logs
System -> Actor: Display activity monitoring data
@enduml