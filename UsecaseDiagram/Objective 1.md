1. Business Registration, Subscription, and User Management
To allow tailoring businesses to register, subscribe, and securely access the system
using role-based user accounts. To enable fashion designers to subscribe to the
system, manage their profiles, create and view posts, and publish products to
showcase their designs.






@startuml
title Figure 1: Sequence Diagram (Objective 1)

@startuml
actor "Shop Owner" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open registration form
System -> Actor: Display registration form
Actor -> System: Enter business details and submit
System -> System: Validate registration data
System -> DB: Save business account
DB -> System: Confirm saved account
System -> Actor: Display registration success
@enduml


@startuml
title Figure 2: Sequence Diagram (Objective 1)

@startuml
actor "Shop Owner" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open subscription page
System -> Actor: Display subscription plans
Actor -> System: Select subscription plan
Actor -> System: Submit subscription details
System -> System: Validate subscription request
System -> DB: Save subscription record
DB -> System: Confirm subscription saved
System -> Actor: Display access confirmation
@enduml


@startuml
title Figure 4: Sequence Diagram (Objective 1)

@startuml
actor "Shop Owner" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open staff account management
System -> Actor: Display staff account form
Actor -> System: Enter staff details and role
System -> System: Validate staff information
System -> DB: Save staff account
DB -> System: Confirm staff account saved
System -> Actor: Display staff account created
@enduml



