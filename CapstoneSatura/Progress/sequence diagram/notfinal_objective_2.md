2. Customer, Measurement, and Order Management
To manage customer profiles, store body measurements, allow submission of
tailoring orders, and track job order status digitally.

@startuml
title Figure 5: Sequence Diagram (Objective 2)

actor "Shop Owner / Staff" as User
participant System
database Database

User -> System: Input Customer Profile
System -> Database: Save Customer Record
Database --> System: Confirm Save
System --> User: Display Customer Profile

User -> System: Input Body Measurements
System -> Database: Save Measurement Data
Database --> System: Confirm Save
System --> User: Display Measurement Record

@enduml


@startuml
title Figure 6: Sequence Diagram (Objective 2)

actor "Shop Owner / Staff" as User
participant System
database Database

User -> System: Select Customer Profile
System -> Database: Retrieve Customer & Measurement Data
Database --> System: Return Customer Details

System --> User: Display Customer Information

User -> System: Create Job Order (Design & Details)
System -> Database: Save Job Order
Database --> System: Return Order ID

System --> User: Display Order Confirmation

@enduml



@startuml
title Figure 7: Sequence Diagram (Objective 2)

actor "Shop Owner / Staff" as User
participant System
database Database

User -> System: Select Job Order
System -> Database: Retrieve Order Details
Database --> System: Return Current Status

System --> User: Display Order Status

User -> System: Update Status (Cutting/Sewing/Done/Ready for Pickup)
System -> Database: Save Status Update
Database --> System: Confirm Update

System --> User: Display Updated Order Status

@enduml


@startuml
title Figure 8: Sequence Diagram (Objective 2)

actor Customer
participant System
database Database

Customer -> System: Enter Order ID
System -> Database: Retrieve Order Details
Database --> System: Return Order Status

System --> Customer: Display Order Progress

@enduml