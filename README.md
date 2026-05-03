# Sutura ERP Prototype - Setup Guide

Welcome to the Sutura ERP owner portal development environment. Follow these steps to get the server running locally.

## 🚀 Quick Start

### 1. Navigate to the Project Directory
Open your terminal and run:
```bash
cd sutura-nextjs-prototype
```

### 2. Install Dependencies
If this is your first time running the project, install the necessary packages:
```bash
npm install
```

### 3. Launch Development Server
Run the following command to start the interactive dashboard:
```bash
npm run dev
```

### 4. Access the Dashboard
Once the server starts, open your browser and go to:
**[http://localhost:3000/owner/dashboard](http://localhost:3000/owner/dashboard)**

---

## 🛠 Features Included
- **Dynamic Revenue Pulse:** Real-time analytics with Daily/Weekly/Monthly/Yearly toggles.
- **Inventory Engine:** BOM (Bill of Materials) setup and Production Assembly.
- **Luxury UI:** Minimalist icon-only sidebar and global notification center.
- **Runnable Clock:** Live-updating system time in the main dashboard.

## 📁 Key Directories
- `/app/(owner-portal)` - Main ERP interface and layouts.
- `/app/(owner-portal)/store` - Central ERP state management (Zustand).
- `/app/(owner-portal)/owner/inventory` - Material tracking & assembly logic.

---
*Created for Sutura ERP Development*
