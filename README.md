# 🚌 Smart Bus Module System

A modern, responsive, and role-based **Smart Bus Module System** developed to simplify college transportation management. The application provides dedicated dashboards for **Admin**, **Driver**, and **Student**, allowing efficient management of buses, routes, schedules, and real-time tracking through an intuitive user interface.

This project was developed as a **Full Stack Web Application** using **React.js**, **Node.js**, **Express.js**, and **MySQL**.

---

## 🌐 Live Demo

**Frontend:** https://smart-bus-ai-system.vercel.app

**Backend:** https://smartbus-ai-system.onrender.com

---

# 📖 Overview

Smart Bus Module System is a digital transportation management platform designed for educational institutions. It automates bus allocation, driver management, route planning, and schedule management while allowing students to easily access their assigned bus information and live tracking.

The system eliminates manual record keeping by providing a centralized platform where administrators can manage transport operations efficiently.

---

# ✨ Key Features

### 👨‍💼 Admin Panel

* Secure Admin Authentication
* Dashboard with Analytics
* Manage Students
* Manage Drivers
* Manage Buses
* Assign Drivers to Buses
* Route Management
* Schedule Management
* Bus Status Management
* Search & Filter Records
* View Complete Details
* CRUD Operations
* Dynamic Data Rendering
* Reports & Analytics
* System Settings

---

### 🚌 Driver Panel

* Driver Login
* Driver Dashboard
* Assigned Bus Details
* Assigned Route
* Live Bus Tracking
* Schedule Information
* Driver Profile
* Driver Settings

---

### 🎓 Student Panel

* Student Login
* Personalized Dashboard
* Assigned Bus Information
* Driver Information
* Weekly Bus Schedule
* Live Bus Tracking
* Notifications
* Student Profile
* Settings
* Contact Driver
* Route Information

---

# 🚀 Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Leaflet
* Leaflet Maps
* Lucide React Icons
* React Icons
* Framer Motion

---

## Backend

* Node.js
* Express.js
* REST API

---

## Database

* MySQL

---

## Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman
* MySQL Workbench

---

# 🏗️ System Architecture

```text
Student / Driver / Admin
            │
            ▼
      React.js Frontend
            │
         Axios API
            │
            ▼
    Node.js + Express.js
            │
            ▼
       MySQL Database
```

---

# 📂 Project Structure

```text
SmartBus-AI-System
│
├── backend
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── authController.js
│   │   ├── busController.js
│   │   ├── driverController.js
│   │   ├── scheduleController.js
│   │   ├── studentController.js
│   │   └── notificationController.js
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Bus.js
│   │   ├── Driver.js
│   │   ├── Student.js
│   │   ├── Schedule.js
│   │   └── Notification.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── busRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── scheduleRoutes.js
│   │   └── notificationRoutes.js
│   │
│   ├── uploads
│   │
│   ├── .env
│   ├── package.json
│   ├── server.js
│   └── README.md
│
├── frontend
│   ├── public
│   │
│   ├── src
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── components
│   │   │   ├── AddBusModal.jsx
│   │   │   ├── AddDriverModal.jsx
│   │   │   ├── AddScheduleModal.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── BusCard.jsx
│   │   │   ├── BusTable.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── DriverCard.jsx
│   │   │   ├── DriverNavbar.jsx
│   │   │   ├── DriverSidebar.jsx
│   │   │   ├── LiveMap.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── ProfileDropdown.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   ├── RouteCard.jsx
│   │   │   ├── RouteMap.jsx
│   │   │   ├── ScheduleTable.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── StudentCard.jsx
│   │   │   ├── StudentNavbar.jsx
│   │   │   └── StudentSidebar.jsx
│   │   │
│   │   ├── context
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── layouts
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── DriverLayout.jsx
│   │   │   └── StudentLayout.jsx
│   │   │
│   │   ├── pages
│   │   │   ├── ForgotPassword.jsx
│   │   │   │
│   │   │   ├── admin
│   │   │   │   ├── Analytics.jsx
│   │   │   │   ├── Buses.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Drivers.jsx
│   │   │   │   ├── LiveTracking.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   ├── Routes.jsx
│   │   │   │   ├── Schedules.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── Students.jsx
│   │   │   │
│   │   │   ├── auth
│   │   │   │   ├── ChooseRole.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   ├── driver
│   │   │   │   ├── AssignedRoute.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── LiveLocation.jsx
│   │   │   │   ├── Profile.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── Students.jsx
│   │   │   │
│   │   │   └── student
│   │   │       ├── Dashboard.jsx
│   │   │       ├── LiveTracking.jsx
│   │   │       ├── MyBus.jsx
│   │   │       ├── MyRoute.jsx
│   │   │       ├── Notifications.jsx
│   │   │       ├── Profile.jsx
│   │   │       ├── Schedule.jsx
│   │   │       └── Settings.jsx
│   │   │
│   │   ├── routes
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── .gitignore
├── LICENSE
└── README.md
```

---

# 🔐 Authentication

The application provides **Role-Based Authentication**.

Supported Roles:

* 👨‍💼 Admin
* 🚌 Driver
* 🎓 Student

Each role has dedicated permissions and access to its own dashboard and functionalities.

---

# 📚 Modules

## Admin Module

* Dashboard
* Student Management
* Driver Management
* Bus Management
* Route Management
* Schedule Management
* Reports
* Analytics
* Settings

---

## Driver Module

* Dashboard
* Assigned Route
* Bus Details
* Live Tracking
* Driver Profile
* Driver Settings

---

## Student Module

* Dashboard
* My Bus
* Live Tracking
* Weekly Schedule
* Notifications
* Student Profile
* Settings

---

# 📍 Live Bus Tracking

The application integrates **React Leaflet** with **OpenStreetMap** for displaying bus locations.

Features include:

* Live Bus Location
* Student Pickup Point
* University Location
* Route Visualization
* Driver Information
* Journey Progress

---

# 📊 Dashboard Features

* Beautiful Modern UI
* Responsive Design
* Glassmorphism Cards
* Gradient Components
* Interactive Statistics
* Dynamic Charts
* Search & Filter
* Responsive Tables
* Animated Components

---

# 🗄️ Database

The system uses **MySQL** as its primary database.

### Database Tables

* Users
* Students
* Drivers
* Buses
* Routes
* Schedules
* Notifications
* Admin

All application data is securely stored and retrieved using REST APIs.

---

# 🔄 API Features

* RESTful API Architecture
* CRUD Operations
* Role-Based Authentication
* Data Validation
* Error Handling
* Secure Database Connectivity
* JSON Responses

---

# 📱 Responsive Design

The application is fully responsive and optimized for:

* Desktop
* Laptop
* Tablet
* Mobile Devices

---

# 🎨 User Interface

The application includes:

* Modern Dashboard
* Premium Card Layout
* Glassmorphism Effects
* Gradient Design
* Responsive Navigation
* Interactive Tables
* Animated UI
* Clean Typography
* Professional Color Palette

---

# ⚡ Installation


### Navigate to Project

```bash
cd SmartBus
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Install Backend Dependencies

```bash
cd ../backend
npm install
```

### Configure Database

1. Create a MySQL database.
2. Import the SQL file.
3. Update database credentials in the configuration file.

### Start Backend

```bash
cd backend
npm start
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

# 📦 Major Dependencies

### Frontend

* React
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Leaflet
* Leaflet
* Lucide React
* React Icons
* Framer Motion

### Backend

* Node.js
* Express.js
* MySQL
* CORS
* dotenv
* Nodemon

---

# 🎯 Project Highlights

* ✅ Full Stack Web Application
* ✅ Responsive Design
* ✅ REST API Integration
* ✅ MySQL Database
* ✅ Role-Based Authentication
* ✅ Dynamic Dashboards
* ✅ Real-Time Bus Tracking
* ✅ Modern UI/UX
* ✅ CRUD Operations
* ✅ Professional Project Structure

---

# 🔮 Future Enhancements

* JWT Authentication
* Email Verification
* OTP Based Password Reset
* Google Maps API Integration
* GPS Based Live Tracking
* Push Notifications
* QR Code Based Bus Attendance
* Parent Dashboard
* Report Export (PDF & Excel)
* Driver Attendance
* AI-Based Route Optimization

---

# 👨‍💻 Developers

**Jiya Sinha**


---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📄 License

This project is developed for educational and learning purposes.

---

# ⭐ Show Your Support

If you found this project useful, please consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates further development.

---

**Made with ❤️ using React.js, Node.js, Express.js, and MySQL**
