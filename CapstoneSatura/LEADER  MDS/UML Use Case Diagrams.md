1. Appointment Module Use Case
This maps out the actions related to booking and managing appointments.

Customer: Can Create Appointment, Select shops, and Login.

Owner: Can Check Details Appointment (which includes Reject & approve Appointment) and Check Available Tailor.

Actor (System): Handles backend tasks like Check calendar feasibility and Automated notification.

2. Customer Order Use Case
This outlines the interactions for processing a tailoring order.

Customer: Can Request Order, Track Order Status, Process Payment, and Provide Feedback.

Tailoring Staff: Can Manage Measurement.

Shop Owner: Overviews the process and can Manage Measurement, Perform Quality Check, and Assign Orders.

Sastre (Tailor): Their primary action is to Fabricate Garment.

3. Inventory and Supplier Module Use Case
This defines how stock is managed between the shop and external vendors.

Shop Owner/Staff: Can Monitor Inventory Stocks (which includes Low Stock Alert and Generate Inventory Report), Approve Restock Request (which includes sending the request and an SMS to the supplier), Receive Delivered Stocks (includes verifying items), Input New Stocks (includes updating records), and manually Request Restock.

Sastre/Tailor: Can Review Materials for Order, Check Material Availability (which includes Allocating Materials), and Start Production.

Supplier: Can Receive Stock Request and Check & Deliver Stock Materials.

Dashboard Tiers (Basic, Pro, Premium)
The remaining diagrams show how features unlock for the Shop Owner / Manager depending on their subscription plan.

4. Shop Owner / Manager Dashboard (Basic Plan)
The entry-level tier gives access to core manual functionalities.

Standard Actions: Login, Create / View Customer Profile.

Manual Job Order Tracking: Includes High Level Metrics, Production Tracking, and Low stock alert.

Manual Digital Appointment Calendar: Includes Body Measurements.

Payment Management: Extends to Cash/Digital Payment (Gcash, Maya, Cards), which includes Printing Receipt.

5. Shop Owner / Manager Dashboard (Pro Plan)
This mid-tier plan unlocks automated inventory and better reporting.

Everything in Basic, plus:

Detailed Financial Reports: Includes Detailed Inventory Reports.

Inventory Management: Includes Low Stock Notifications and Stock In/Out Tracking.

Supplier Management: Includes Supplier Records.

Digital Invoice Generation: Includes Send Invoice via Email.

Role-Based Access Control.

Automated Appointment Reminders: Extends to Automated SMS / Email Notification.

6. Shop Owner / Manager Dashboard (Premium Plan)
The highest tier unlocks multi-branch capabilities and full administrative control.

Everything in Pro, plus:

Multi-Branch Support: Includes Branch Management and Branch-Level Staff Control.

Multi-Branch Analytics: Includes Cross-Branch Sales Reports and Branch Performance Comparison.

Administrative Audit Logs: Includes Track Admin Activities and View System Logs.

Customized Shop Profile: Includes Shop Branding & Info Setup.

Create / View Posted Products: Includes Product Listing Management.

7. Administrative Dashboard Use Case
This diagram is strictly for the overarching System Admin (the platform owner, not the individual tailoring shop owners).

Admin Actions:

Login.

Manage Tailoring Accounts (includes toggling Active or Inactive status).

Manage Subscription Plans.

Manage Tailoring Owners Account (includes Manage Account and Manage Role, which further includes Manage Permission).

Manage Tailoring Registration (includes Accept or Decline Registration).

System Monitor and Analysis (includes Payment Monitoring, Audit Logs, and Reports).