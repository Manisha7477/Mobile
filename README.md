# EMS_FrontEnd

EMS_FrontEnd is the frontend application for an Energy Monitoring System (EMS) configured for Manufacturing Intelligence (MI) scenarios and use cases. It provides a centralized platform for enterprises to monitor, analyze, and optimize their energy consumption across plants, areas, lines, utilities, and edge devices.

The application offers Role-Based Access (RBA) to data, insights, and controls, enabling organizations to achieve operational efficiency, reduce downtime, and take corrective actions in real time. Users gain value through visual dashboards, KPI monitoring, alarms, notifications, and robust user management features.

Features:-
1)User Management-
Role hierarchy: Admin → Manager → Engineer → Operator.
Administrators can create, update, and manage users.
Role-based permissions control module access and data visibility.

2)Operational Nexus-
Configure and manage plants, areas, lines, utilities, and edge devices.
Add or update utilities such as Generators, Air Compressors, Chillers, Boilers.
Map edge devices to utilities for accurate data collection.

3)Plant Performance-
Real-time dashboards with Key Performance Indicators (KPIs).
Displays data for voltage, power, energy, current, and more.
Live-streaming data integration via SignalR.
Time-based performance graphs with trend visualization.
Auto-updating KPIs and charts with drill-down navigation (Plant → Area → Line).

4)Alarms & Notifications-
Automatic trigger of alarms when thresholds are breached.
Real-time notifications for corrective actions.
Application Navigation & UX.
Role-based navigation menus tailored to each user profile.
Responsive, consistent layouts across modules.
Profile management, system settings, and sign-out functionality.
Error handling with graceful fallback pages (e.g., Not Found).

Technical Details:-
Framework & Language-
Built with Next.js (React framework).
Fully typed using TypeScript for reliability & maintainability.

Styling-
Tailwind CSS for utility-first responsive design.
Centralized global styles and reusable utilities.

State Management & Data Flow-
Global state via Context API and custom store modules.
Axios used for API communication with backend services.
SignalR client for streaming live updates.

Visualization:-
Recharts library for dynamic charts & real-time data visualization.
Supports bar charts, line charts, gauge charts, and KPI visual cards.

Naming Conventions:-
Files & Components-
Components follow PascalCase.
Module-based naming convention: ComponentName.tsx
Example: ManageArea.tsx

Routes-
camelCase URLs for all routes
Example:
/plantPerformanceUtilities/
/userManagement/
/operationalNexus/line/

Installation & Setup:-
Clone the repository-
bash
git clone https://github.com/lumbini67/EMS_FrontEnd.git
cd EMS_FrontEnd

Install dependencies-
bash
npm install

Run in development mode-
bash
npm run dev

Build for production-
bash
npm run build
npm run start

Development Guidelines:-
Follow TypeScript best practices.
Run ESLint and Prettier before committing code.
Keep components modular and reusable (industry standard).
Store all static assets (icons, logos, images) in the public/ folder.
Maintain consistent conventions.
camelCase for URLs.
PascalCase for component and file names
New modules must be added under routes/ with the pattern: ModuleX.tsx
