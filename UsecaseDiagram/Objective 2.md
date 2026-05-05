2.Customer, Measurement, and Order Management
To manage customer profiles, store body measurements, allow submission of
tailoring orders, and track job order status digitally.

@startuml
title Figure 6: Sequence Diagram (Objective 2)

@startuml
actor "Customer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open customer profile
System -> Actor: Display customer profile form
Actor -> System: Enter profile details
System -> System: Validate profile information
System -> DB: Save customer profile
DB -> System: Confirm profile saved
System -> Actor: Display profile saved confirmation
@enduml

@startuml
title Figure 7: Sequence Diagram (Objective 2)

@startuml
actor "Customer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open measurement form
System -> Actor: Display measurement form
Actor -> System: Enter body measurements
System -> System: Validate measurement data
System -> DB: Save body measurements
DB -> System: Confirm measurements saved
System -> Actor: Display measurement confirmation
@enduml



@startuml
title Figure 8: Sequence Diagram (Objective 2)

@startuml
actor "Customer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open tailoring order form
System -> Actor: Display tailoring order form
Actor -> System: Enter order details and submit
System -> System: Validate order information
System -> DB: Save tailoring order
DB -> System: Confirm order saved
System -> Actor: Display order submission confirmation
@enduml

@startuml
title Figure 9: Sequence Diagram (Objective 2)

@startuml
actor "Customer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open job order status
System -> DB: Retrieve job order status
DB -> System: Return job order status
System -> Actor: Display current job order status
@enduml

