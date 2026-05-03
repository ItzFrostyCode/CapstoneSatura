3. Appointment and Notification Management
To schedule fittings, consultations, and order release dates and provide automated
notifications for order updates and deadlines.



@startuml
title Figure 9: Sequence Diagram (Objective 3)

actor Customer
actor "Sastre / Manager" as User
participant System
database Database

Customer -> System: Request Appointment (Date & Time)
System -> Database: Check Schedule Availability
Database --> System: Return Availability Status

System --> User: Display Appointment Request

User -> System: Confirm Appointment
System -> Database: Save Appointment Schedule
Database --> System: Confirm Save

System --> Customer: Display Appointment Confirmation

@enduml




@startuml
title Figure 10: Sequence Diagram (Objective 3)

actor "Sastre / Manager" as User
participant System
database Database

System -> System: Monitor Order Deadlines

System -> Database: Retrieve Upcoming Orders
Database --> System: Return Order List

System -> System: Generate Notification Alerts

System --> User: Display Notifications (Dashboard Alert)

@enduml