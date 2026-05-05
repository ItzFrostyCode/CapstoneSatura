5. Billing and Payment Management
To automatically generate invoices and record payments for accurate financial
tracking.



@startuml
title Figure 19: Sequence Diagram (Objective 5)

@startuml
actor "Shop Owner / Staff" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open billing module
System -> DB: Retrieve job order details
DB -> System: Return job order data
System -> System: Generate invoice
System -> DB: Save invoice record
DB -> System: Confirm invoice saved
System -> Actor: Display generated invoice
@enduml


@startuml
title Figure 20: Sequence Diagram (Objective 5)

@startuml
actor "Customer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open invoice details
System -> DB: Retrieve invoice record
DB -> System: Return invoice data
System -> Actor: Display invoice information
@enduml




@startuml
title Figure 21: Sequence Diagram (Objective 5)

@startuml
actor "Customer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Submit payment
System -> System: Validate payment details
System -> DB: Save payment record
DB -> System: Confirm payment saved
System -> DB: Update invoice status
DB -> System: Confirm invoice updated
System -> Actor: Display payment confirmation
@enduml



@startuml
title Figure 22: Sequence Diagram (Objective 5)

@startuml
actor "Shop Owner / Staff" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open payment records
System -> DB: Retrieve payment history
DB -> System: Return payment records
System -> Actor: Display payment list
@enduml