@startuml
title Objective 6: Reports and Administrative Management

actor "Shop Owner" as Owner
participant "Reporting Module" as Rep
participant "Analytics Engine" as Engine
database "Supabase DB" as DB

== Dashboard Monitoring ==
Owner -> Rep: Access Admin Dashboard \n[[00-dashboard/01-dashboard.html]]
Rep -> DB: Fetch Operational KPIs (Sales, Orders, Waste)
DB --> Rep: Data
Rep --> Owner: Display Real-time Dashboards

== Report Generation ==
Owner -> Rep: Request Monthly Material Efficiency Report \n[[04-finance/09-material-efficiency-report.html]]
Rep -> Engine: Process Inventory & Waste Data
Engine -> DB: Query Historical Logs
DB --> Engine: Logs
Engine -> Engine: Calculate Efficiency Rate (%)
Engine --> Rep: Generated Report
Rep --> Owner: Display / Download Report

@enduml
