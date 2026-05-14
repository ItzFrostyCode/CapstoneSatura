
Module: Tailoring Staff Module
Actor:

Tailoring Staff

Primary Use Cases (Connected to Actor):

Process Payment

Manage Fitting Session

Manage Measurement

Create/Retrieve Customer Profile

Check & Allocate Materials

Retrieve Allocated Physical Materials

Perform Adjustments/Alteration

Fabricate Garment

Monitor Stock Levels

View Purchase Order History

Manage Supplier Records

Conduct Quality Check

Use Case Relationships:

Manage Measurement

<<extend>> Take Body Measurement (Arrow points from "Take Body Measurement" to "Manage Measurement")

Conduct Quality Check

<<include>> Receive Physical Materials

<<include>> Update Digital Inventory

<<include>> Log Delivery Discrepancy
(Arrows point from "Conduct Quality Check" to the three included use cases)



Module: Shop Owner Module
Actor:

Shop Owner

Primary Use Cases (Connected to Actor):

Register Shop Account

Process Subscription Payment

Check & Allocate Materials

Perform Quality Check

Approve Orders Feasibility

Distribute Orders to Staff

Manage Shop Schedule

Authorize Appointment

Track Supplier Performance

Manage "On-Hold" Queue

Review & Approve Purchase Orders(PO)

Send Purchase Order via SMS/Email

Generate Purchase Order

Activate/Deactivate Supplier

Add/Edit Supplier Directory

Use Case Relationships:

Perform Quality Check

<<extend>> Request Adjustment/Alteration (Arrow points from "Request Adjustment/Alteration" to "Perform Quality Check")

Approve Orders Feasibility

<<extend>> Reject Orders (Arrow points from "Reject Orders" to "Approve Orders Feasibility")

Review & Approve Purchase Orders(PO)

<<extend>> Cancel/Modify PO (Arrow points from "Cancel/Modify PO" to "Review & Approve Purchase Orders(PO)")



Module: Customer Module
Actor:

Customer

Primary Use Cases (Connected to Actor):

Register/Login

Book Appointment

Place Job order

View Personal measurements

Track Order Status

Submit Feedback & Rating

Use Case Relationships:

Book Appointment

<<include>> Register/Login (Arrow points from "Book Appointment" to "Register/Login")

<<extend>> Reschedule Appointment (Arrow points from "Reschedule Appointment" to "Book Appointment")

Place Job order

<<include>> Select Customer info, Garment, Fabric, & Order Type (Arrow points from "Place Job order" to "Select Customer info, Garment, Fabric, & Order Type")

<<include>> Payment Full/Deposit (Arrow points from "Place Job order" to "Payment Full/Deposit")

Payment Full/Deposit

<<extend>> Apply Promo code/Discount (Arrow points from "Apply Promo code/Discount" to "Payment Full/Deposit")



Module: Subscription Module
Actors:

Shop Owner

System Admin

Primary Use Cases (Connected to Actors):

Shop Owner:

Register Shop Account

Process Subscription Payment

System Admin:

Manage Subscription Tiers

Review Shop Application

Use Case Relationships:

Register Shop Account

<<include>> Shop Details (Arrow points from "Register Shop Account" to "Shop Details")

<<include>> Select Subscription Plan (Arrow points from "Register Shop Account" to "Select Subscription Plan")

Select Subscription Plan

<<extend>> Basic Plan (Arrow points from "Basic Plan" to "Select Subscription Plan")

<<extend>> Pro Plan (Arrow points from "Pro Plan" to "Select Subscription Plan")

<<extend>> Premium Plan (Arrow points from "Premium Plan" to "Select Subscription Plan")

Review Shop Application

<<include>> Verify Business Credentials (Arrow points from "Review Shop Application" to "Verify Business Credentials")

<<extend>> Reject Application (Arrow points from "Reject Application" to "Review Shop Application")

<<extend>> Authorize Account Access (Arrow points from "Authorize Account Access" to "Review Shop Application")

Authorize Account Access

<<extend>> Send Temporary Credentials SMS/Email (Arrow points from "Send Temporary Credentials SMS/Email" to "Authorize Account Access")



Module: Appointment module
Actors:

Customer

Shop Owner

Primary Use Cases (Connected to Actors):

Customer:

Select shops

Book Appointment

Cancel Appointment

Login

Shop Owner:

Login

Manage Shop Schedule

Authorize Appointment

Use Case Relationships:

Book Appointment

<<include>> Customer Info, Purpose, Date & Time (Arrow points from "Book Appointment" to "Customer Info, Purpose, Date & Time")

<<include>> Check Availability (Arrow points from "Book Appointment" to "Check Availability")

<<extend>> Cancel Appointment (Arrow points from "Cancel Appointment" to "Book Appointment")

<<extend>> Request Reschedule (Arrow points from "Request Reschedule" to "Book Appointment")

Authorize Appointment

<<extend>> Trigger SMS Notification (Arrow points from "Trigger SMS Notification" to "Authorize Appointment")



Module: Customer Job & Fulfillment Order
Actors:

Customer

Tailoring Staff

Shop Owner

Primary Use Cases (Connected to Actors):

Customer:

Place Job Order

Track Order Status

Finalize Pick up & Feedback

Tailoring Staff:

Process Payment (Also connected to the Customer actor)

Manage Fitting Session

Manage Measurement

Create/Retrieve Customer Profile

Check & Allocate Materials

Retrieve Allocated Physical Materials

Perform Adjustments/Alteration

Fabricate Garment

Shop Owner:

Perform Quality Check

Approve Orders Feasibility

Distribute Orders to Staff

Use Case Relationships:

Place Job Order

<<include>> Select Garment, Fabric, & Order Type (Arrow points from "Place Job Order" to "Select Garment, Fabric, & Order Type")

<<include>> Process Payment (Arrow points from "Place Job Order" to "Process Payment")

Process Payment

<<include>> Full/Deposit (Arrow points from "Process Payment" to "Full/Deposit")

<<extend>> Apply Discount (Arrow points from "Apply Discount" to "Process Payment")

Manage Measurement

<<extend>> Take Body Measurement (Arrow points from "Take Body Measurement" to "Manage Measurement")

Fabricate Garment

<<extend>> Request Adjustment/Alteration (Arrow points from "Request Adjustment/Alteration" to "Fabricate Garment")

Perform Quality Check

<<extend>> Request Adjustment/Alteration (Arrow points from "Request Adjustment/Alteration" to "Perform Quality Check")

Approve Orders Feasibility

<<extend>> Reject Orders (Arrow points from "Reject Orders" to "Approve Orders Feasibility")



Module: Inventory & Supplier Module
Actors:

Shop Owner

Tailoring Staff

Supplier

Primary Use Cases (Connected to Actors):

Shop Owner:

Track Supplier Performance

Manage "On-Hold" Queue

Review & Approve Purchase Orders(PO)

Send Purchase Order via SMS/Email

Activate/Deactivate Supplier

Add/Edit Supplier Directory

Generate Purchase Order

Check & Allocate Materials

Tailoring Staff:

Check & Allocate Materials

Monitor Stock Levels

View Purchase Order History

Manage Supplier Records

Conduct Quality Check

Supplier:

Confirm Order and Provide ETA

Receive Purchase Order

Send Delivery ETA

Send Delivery Update

Use Case Relationships:

Review & Approve Purchase Orders(PO)

<<extend>> Cancel/Modify PO (Arrow points from "Cancel/Modify PO" to "Review & Approve Purchase Orders(PO)")

Conduct Quality Check

<<include>> Receive Physical Materials (Arrow points from "Conduct Quality Check" to "Receive Physical Materials")

<<include>> Update Digital Inventory (Arrow points from "Conduct Quality Check" to "Update Digital Inventory")

<<include>> Log Delivery Discrepancy (Arrow points from "Conduct Quality Check" to "Log Delivery Discrepancy")

Confirm Order and Provide ETA

<<extend>> Decline Order (Arrow points from "Decline Order" to "Confirm Order and Provide ETA")



Module: Admin Module
Actor:

Admin

Primary Use Cases (Connected to Actor):

Login

Manage Tailoring Accounts

Manage Subscription Plans

Manage Tailoring Owners Account

Manage Tailoring Registration

System Monitor and Analysis

Use Case Relationships:

Manage Tailoring Accounts

<<include>> Active/Inactive Account (Arrow points from "Manage Tailoring Accounts" to "Active/Inactive Account")

Manage Tailoring Owners Account

<<include>> Manage Account (Arrow points from "Manage Tailoring Owners Account" to "Manage Account")

<<include>> Manage Role (Arrow points from "Manage Tailoring Owners Account" to "Manage Role")

Manage Role

<<include>> Manage Permission (Arrow points from "Manage Role" to "Manage Permission")

Manage Tailoring Registration

<<include>> Accept/Decline Registration (Arrow points from "Manage Tailoring Registration" to "Accept/Decline Registration")

System Monitor and Analysis

<<include>> Payment Monitoring (Arrow points from "System Monitor and Analysis" to "Payment Monitoring")

<<include>> Reports (Arrow points from "System Monitor and Analysis" to "Reports")

<<include>> Audit Logs (Arrow points from "System Monitor and Analysis" to "Audit Logs")



Module: Fashion Designer Module
Actors:

Customer

Fashion Designer

Admin

Primary Use Cases (Connected to Actors):

Customer:

Avail Subscription Plan

Fashion Designer:

Register/Login

Create/Share Design Post(Limited)

Avail Subscription Plan

View Customer Inquiries

Manage Profile/Portfolio

Admin:

Manage Subscription Plan

Use Case Relationships:

Avail Subscription Plan

<<include>> Book Appointment (Arrow points from "Avail Subscription Plan" to "Book Appointment")

<<include>> Create/Share Design Post(No Limit) (Arrow points from "Avail Subscription Plan" to "Create/Share Design Post(No Limit)")

<<include>> Create/Retrieve Customer Profile (Arrow points from "Avail Subscription Plan" to "Create/Retrieve Customer Profile")





