1. Business Registration, Subscription, and User Management
To allow tailoring businesses to register, subscribe, and securely access the system
using role-based user accounts. To enable fashion designers to subscribe to the
system, manage their profiles, create and view posts, and publish products to
showcase their designs.




@startuml
title Figure 1: Sequence Diagram (Objective 1)

actor "Shop Owner / Designer" as User
participant System
database Database

User -> System: Input Registration Details
System -> Database: Validate Input Data
Database --> System: Return Validation Result

User -> System: Select Subscription Plan
System -> Database: Save Account & Plan (Pending)
Database --> System: Confirm Save

System --> User: Display "Pending Approval"

@enduml



@startuml
title Figure 2: Sequence Diagram (Objective 1)

actor Admin
actor "Shop Owner" as Owner
participant System
database Database

Admin -> System: Review Registration
System -> Database: Fetch Pending Accounts
Database --> System: Return Account Data

Admin -> System: Approve Account
System -> Database: Update Account Status
Database --> System: Confirm Update

System --> Owner: Notify Approval

Owner -> System: Enter Login Credentials
System -> Database: Authenticate Account
Database --> System: Authentication Success

System --> Owner: Display Dashboard

@enduml





@startuml
title Figure 3: Sequence Diagram (Objective 1)

actor "Shop Owner" as Owner
participant System
database Database

Owner -> System: Add Staff Account
System -> Database: Save Staff Profile
Database --> System: Confirm Save

Owner -> System: Assign Staff Role
System -> Database: Update Staff Role
Database --> System: Confirm Update

System --> Owner: Display Updated Staff List

@enduml

@startuml
title Figure 4: Sequence Diagram (Objective 1)

actor "Fashion Designer" as Designer
participant System
database Database

Designer -> System: Enter Login Credentials
System -> Database: Authenticate Account
Database --> System: Authentication Success

System --> Designer: Display Dashboard

Designer -> System: Update Profile Information
System -> Database: Save Profile Updates
Database --> System: Confirm Update

Designer -> System: Create Design Post
System -> Database: Save Post Details
Database --> System: Confirm Save

Designer -> System: Publish Product Design
System -> Database: Save Product Listing
Database --> System: Confirm Save

System --> Designer: Display Updated Portfolio

@enduml