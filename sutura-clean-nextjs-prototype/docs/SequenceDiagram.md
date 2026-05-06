OBJECTIVE 1

. Business Registration, Subscription, and User Management
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
title Figure 3: Sequence Diagram (Objective 1)

@startuml
actor "Shop Owner" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open branch management
System -> Actor: Display branch form
Actor -> System: Enter branch details
System -> System: Validate branch information
System -> DB: Save branch record
DB -> System: Confirm branch saved
System -> Actor: Display branch created
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




@startuml
title Figure 5: Sequence Diagram (Objective 1)

@startuml
actor "Fashion Designer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open profile management
System -> Actor: Display profile page
Actor -> System: Enter profile details and publish design
System -> System: Validate profile and product details
System -> DB: Save profile and product record
DB -> System: Confirm record saved
System -> Actor: Display published content
@enduml



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




OBJECTIVE 2
Customer, Measurement, and Order Management
To manage customer profiles, store body measurements, allow submission of
tailoring orders, and track job order status digitally


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

actor "Customer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open tailoring order form
System -> Actor: Display tailoring order form
Actor -> System: Enter tailoring order details
System -> System: Validate order information
System -> DB: Save tailoring order
DB -> System: Confirm order saved
System -> Actor: Display order confirmation

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


OBJECTIVE 3
Appointment and Notification Management
To schedule fittings, consultations, and order release dates and provide automated
notifications for order updates and deadlines


@startuml
title Figure 10: Sequence Diagram (Objective 3)

actor "Customer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open fitting schedule form
System -> Actor: Display available fitting schedules
Actor -> System: Select fitting date and time
System -> System: Validate fitting request
System -> DB: Save fitting schedule
DB -> System: Confirm fitting schedule saved
System -> Actor: Display fitting confirmation

@enduml


@startuml
title Figure 11: Sequence Diagram (Objective 3)

actor "Customer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open consultation booking form
System -> Actor: Display consultation form
Actor -> System: Enter consultation details
System -> System: Validate consultation request
System -> DB: Save consultation schedule
DB -> System: Confirm consultation saved
System -> Actor: Display consultation confirmation

@enduml


@startuml
title Figure 12: Sequence Diagram (Objective 3)

actor "Customer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: View order release schedule
System -> DB: Retrieve release schedule
DB -> System: Return release details
System -> Actor: Display release date information

Actor -> System: Confirm release schedule
System -> System: Validate release confirmation
System -> DB: Save release confirmation
DB -> System: Confirm release saved
System -> Actor: Display release confirmation

@enduml

@startuml
title Figure 13: Sequence Diagram (Objective 3)

actor "Customer" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open order status page
System -> DB: Retrieve order status
DB -> System: Return order update
System -> Actor: Display latest order status

System -> DB: Save notification log
DB -> System: Confirm notification saved
System -> Actor: Display order update notification

@enduml


@startuml
title Figure 14: Sequence Diagram (Objective 3)

actor "Customer" as Actor
participant "System" as System
database "Database" as DB

System -> DB: Check upcoming appointments and deadlines
DB -> System: Return deadline records
System -> System: Identify upcoming schedules
System -> DB: Save reminder notification
DB -> System: Confirm reminder saved
System -> Actor: Display deadline reminder

@enduml


OBJECTIVE 4
Inventory and Supplier Management
To monitor the availability of tailoring materials, and automatically notify the shop
when stock is low, allowing them to request or reorder materials from suppliers to
prevent delays in production.


@startuml
title Figure 15: Sequence Diagram (Objective 4)

actor "Shop Owner / Staff" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open inventory module
System -> DB: Retrieve inventory records
DB -> System: Return inventory data
System -> Actor: Display inventory list

Actor -> System: Check material availability
System -> System: Evaluate stock levels
System -> Actor: Display stock availability

@enduml


@startuml
title Figure 16: Sequence Diagram (Objective 4)

actor "Shop Owner / Staff" as Actor
participant "System" as System
database "Database" as DB

System -> DB: Retrieve stock levels
DB -> System: Return inventory data
System -> System: Compare stock with reorder level
System -> DB: Save low stock alert
DB -> System: Confirm alert saved
System -> Actor: Display low stock notification

@enduml


@startuml
title Figure 17: Sequence Diagram (Objective 4)

actor "Shop Owner / Staff" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Open reorder request form
System -> Actor: Display reorder form
Actor -> System: Enter reorder details
System -> System: Validate reorder request
System -> DB: Save reorder request
DB -> System: Confirm reorder saved
System -> Actor: Display reorder confirmation

@enduml


@startuml
title Figure 18: Sequence Diagram (Objective 4)

actor "Shop Owner / Staff" as Actor
participant "System" as System
database "Database" as DB

Actor -> System: Record supplier order
System -> Actor: Display supplier order form
Actor -> System: Enter supplier order details
System -> System: Validate supplier order
System -> DB: Save supplier transaction
DB -> System: Confirm supplier order saved
System -> Actor: Display supplier order confirmation

@enduml

OBJECTIVE 5
Billing and Payment Management
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

OBJECTIVE 6
Reports and Administrative Management
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