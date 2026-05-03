5. Billing and Payment Management
To automatically generate invoices and record payments for accurate financial
tracking.






@startuml
title Figure 12: Sequence Diagram (Objective 5)

actor "Shop Owner" as User
participant System
database Database

User -> System: Request Invoice for Job Order
System -> Database: Retrieve Order Details
Database --> System: Return Order Information

System -> System: Generate Invoice
System --> User: Display Invoice

@enduml



@startuml
title Figure 13: Sequence Diagram (Objective 5)

actor "Manager" as User
participant System
database Database

User -> System: Input Payment Details (Partial/Full)
System -> Database: Retrieve Order Balance
Database --> System: Return Current Balance

System -> Database: Save Payment Record
Database --> System: Confirm Save

System -> Database: Update Order Balance
Database --> System: Confirm Update

System --> User: Display Payment Confirmation

@enduml