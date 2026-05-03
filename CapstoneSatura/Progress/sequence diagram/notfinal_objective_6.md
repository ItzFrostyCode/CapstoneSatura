
6. Reports and Administrative Management
To generate operational and inventory reports and provide dashboards for
monitoring business and supply chain activities.


@startuml
title Figure 14: Sequence Diagram (Objective 6)

actor "Shop Owner" as User
participant System
database Database

User -> System: Request Report
System -> Database: Retrieve Sales, Inventory, and Order Data
Database --> System: Return Data

System -> System: Generate Report
System --> User: Display Report

System -> System: Compile Dashboard Data
System --> User: Display Dashboard

@enduml