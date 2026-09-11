# CrisisSync — Real-Time Emergency Resource Allocator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Author](https://img.shields.io/badge/Author-Ashutosh%20Pathak-cyan.svg)](https://github.com/ashutoshpathak4121)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ashutosh%20Pathak-0A66C2.svg)](https://linkedin.com/in/ashutoshpathak4121)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-black.svg)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan.svg)](https://tailwindcss.com/)

> **"Zero Delays. Real-Time Emergency Resource Allocation."**

CrisisSync is a centralized, real-time emergency coordination platform that eliminates information silos between emergency ambulances, hospitals, and command centers. During mass casualty events, accidents, and acute medical surges, CrisisSync dynamically synchronizes bed availability, ICU capacity, ventilators, and surgical trauma teams to paramedics and dispatchers with sub-50ms WebSocket latency without requiring page refreshes.

---

## 1. Problem Statement

During major emergencies, ambulances and hospitals operate in isolated silos. Ambulances frequently transport critical patients to emergency rooms without knowing that:
* Emergency beds or ICU units are exhausted
* Mechanical ventilators are completely occupied
* On-duty trauma surgical teams are already committed
* The facility has entered divert status

This leads to dangerous ambulance turnaround delays, emergency room overcrowding, and suboptimal patient routing during critical golden hours.

---

## 2. The Solution

CrisisSync links all three emergency stakeholders into a unified reactive event bus:
1. **Hospital & ER Staff**: Touch-optimized capacity controls to adjust emergency beds, ICU, ventilators, and acceptance statuses in seconds.
2. **Ambulance Paramedics**: Real-time HUD showing nearby hospital capacities, automated smart recommendations based on multi-factor scoring, and live navigation routes that warn them immediately if destination capacity changes.
3. **Command Dispatchers**: Metropolitan tactical overview with live GPS telemetry, city-wide resource matrices, and a built-in Casualty Surge Simulator for hackathon demonstrations.

---

## 3. System Architecture

```text
                     ┌──────────────────────────────────────────┐
                     │          React 18 + Vite (SPA)           │
                     │                                          │
                     │  ┌──────────────┐  ┌──────────────────┐  │
                     │  │ Landing Page │  │ Auth / Demo Pick │  │
                     │  └──────────────┘  └──────────────────┘  │
                     │  ┌──────────────┐  ┌──────────────────┐  │
                     │  │ Hospital Dash│  │ Ambulance Dash   │  │
                     │  └──────────────┘  └──────────────────┘  │
                     │  ┌─────────────────────────────────────┐  │
                     │  │     Command Center + Simulator      │  │
                     │  └─────────────────────────────────────┘  │
                     └─────────────┬──────────────────▲─────────┘
                                   │ HTTP REST        │ WebSockets
                                   ▼                  │ (Socket.io)
                     ┌────────────────────────────────┴─────────┐
                     │          Node.js + Express Server        │
                     │                                          │
                     │  • Security: Helmet, CORS, Rate Limiter  │
                     │  • Auth: JWT Token & Role Authorization  │
                     │  • Routing & Directions Geo Engine       │
                     │  • Socket.io Server (Rooms & Events)     │
                     │  • Simulation Engine (Mass Casualty Demo)│
                     └─────────────┬──────────────────┬─────────┘
                                   │                  │
                        Prisma ORM │                  │ Redis Cache /
                                   ▼                  ▼ In-Memory Fallback
                     ┌──────────────────────┐   ┌───────────────────────────┐
                     │ PostgreSQL / SQLite  │   │ Redis (Key-Value & PubSub)│
                     │                      │   │                           │
                     │ • Users & Roles      │   │ • Key: hospital:{id}:res  │
                     │ • Hospitals & Res    │   │ • High-speed cached reads │
                     │ • Ambulances         │   │ • Resilient fallback when │
                     │ • Incidents & Routes │   │   standalone host         │
                     │ • ResourceAuditLogs  │   │                           │
                     └──────────────────────┘   └───────────────────────────┘
```

---

## 4. Technology Stack

### Frontend
* **Framework**: React 18 (Vite)
* **Styling**: Tailwind CSS (Tactical Dark Command Center Theme)
* **Real-Time Client**: Socket.io Client
* **Data Visualization**: Recharts (Capacity Distribution & Life-Support Breakdown)
* **Mapping**: Interactive Vector Tactical Radar & Mapbox GL JS Integration
* **Icons**: Lucide React
* **Routing**: React Router DOM v6
* **HTTP Client**: Axios

### Backend
* **Runtime**: Node.js v20+ & Express.js
* **Real-Time Hub**: Socket.io Server
* **ORM**: Prisma Client v5
* **Caching & Pub/Sub**: Redis (with automatic in-memory fallback)
* **Authentication**: JSON Web Tokens (JWT) & Bcrypt password hashing
* **Validation**: Joi
* **Security**: Helmet, CORS, Express Rate Limiter
* **Testing**: Jest & Supertest

---

## 5. Live Demo Script (The Hackathon "Winning Angle")

For judging and evaluation, use two side-by-side browser windows:

| Step | Window 1 (Hospital ER Nurse) | Window 2 (Ambulance Paramedic) | Live Result |
|---|---|---|---|
| **1** | Log in as **Hospital Nurse** (`/hospital`). View Apollo Emergency Center: **Emergency Beds: 8** | Log in as **Paramedic** (`/ambulance`). View nearby Apollo Center: **Emergency Beds: 8**, ETA 6 min. | Both screens synchronized. |
| **2** | Nurse clicks `[-]` stepper: **8 → 3 beds**. | Watch Paramedic window without refreshing. | **Card immediately flashes cyan/red and updates to 3 beds in < 50ms.** |
| **3** | Nurse switches status to **CRITICAL** or **FULL**. | Paramedic window displays live alert banner. | Subtle toast notification pops up: *"Capacity updated just now."* |
| **4** | Paramedic clicks **[Route Here]**. | Dynamic route polyline draws on tactical map with ETA & distance HUD. | Active route locked in. |
| **5** | Switch to **Command Center** (`/command`). Click **[Start Surge Demo]**. | Watch automated 5-step mass casualty surge decrement hospital beds live across all connected clients! | Demonstrates end-to-end real-time emergency triage. |

---

## 6. Pre-Configured Demo Accounts

For rapid evaluation, the login screen provides **1-Click Quick Launch buttons** that auto-fill credentials:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Command Center / Admin** | `admin@crisissync.demo` | `DemoPassword123!` | System-wide oversight, incident triage, simulation engine |
| **Hospital ER Staff** | `hospital@crisissync.demo` | `DemoPassword123!` | Apollo Emergency Trauma Center capacity and status control |
| **Ambulance Paramedic** | `paramedic@crisissync.demo` | `DemoPassword123!` | Unit DL-01-EM-401 telemetry, nearby facilities, navigation |

---

## 7. Quickstart (Local Development)

### Prerequisites
* Node.js v18+ (tested on Node v20 / v24)
* npm v9+

### 1. Backend Setup
```bash
cd backend
npm install

# Push database schema (creates local SQLite dev.db automatically)
npx prisma db push

# Seed database with realistic metropolitan hospitals, ambulances, and demo users
node prisma/seed.js

# Start backend development server
npm run dev
```
The backend starts on `http://localhost:5000` with WebSockets on `ws://localhost:5000`.

### 2. Frontend Setup
In a separate terminal:
```bash
cd frontend
npm install

# Start frontend development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 8. Running with Docker Compose

To deploy the entire production stack (PostgreSQL + Redis + Backend + Frontend SPA):

```bash
# From the project root
docker compose up --build
```

Services will start:
* **Frontend**: `http://localhost:80`
* **Backend API**: `http://localhost:5000`
* **PostgreSQL**: `localhost:5432`
* **Redis**: `localhost:6379`

---

## 9. API Specification

All API responses follow a uniform structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Authentication
* `POST /api/auth/register` — Register a new account
* `POST /api/auth/login` — Authenticate and receive JWT token
* `GET /api/auth/me` — Retrieve authenticated user profile (Bearer token)

### Hospitals & Resources
* `GET /api/hospitals` — List all facilities (supports `?lat=&lng=&status=` query params)
* `GET /api/hospitals/:id` — Detailed facility view with cached resources
* `POST /api/hospitals` — Create facility (Admin only)
* `PUT /api/hospitals/:id` — Update facility details (Admin only)
* `GET /api/hospitals/:id/resources` — Read real-time resource availability
* `PUT /api/hospitals/:id/resources` — Update capacity (validates bounds, updates PostgreSQL, sets Redis cache, logs audit entry, emits Socket.io event)
* `PUT /api/hospitals/:id/status` — Update acceptance status (`ACCEPTING`, `LIMITED`, `CRITICAL`, `FULL`, `OFFLINE`)
* `GET /api/hospitals/:id/audit-logs` — Retrieve historical resource change logs

### Ambulances
* `GET /api/ambulances` — List fleet with coordinates and status
* `GET /api/ambulances/:id` — Single vehicle telemetry
* `PUT /api/ambulances/:id/location` — Broadcast updated GPS coordinates
* `PUT /api/ambulances/:id/status` — Update vehicle status (`AVAILABLE`, `EN_ROUTE`, `AT_SCENE`, `TRANSPORTING`, `ARRIVED`)

### Incidents
* `GET /api/incidents` — List all active emergency incidents
* `POST /api/incidents` — Report scene emergency incident (emits `incident:created`)
* `PUT /api/incidents/:id` — Update incident status / triage severity

### Routes & Smart Recommendation
* `POST /api/routes/calculate` — Compute driving route, distance (km), ETA (min), and polyline coordinates
* `GET /api/routes/recommendations` — Multi-factor destination ranking (`?lat=&lng=&requiresIcu=&requiresVentilator=`)

### Simulation Engine
* `POST /api/simulation/start-surge` — Starts 5-step casualty surge sequence
* `POST /api/simulation/reset` — Restores baseline capacities
* `POST /api/simulation/trigger-incident` — Injects critical multi-vehicle accident

---

## 10. WebSocket Event Bus

| Event | Direction | Payload |
|---|---|---|
| `hospital:resource-updated` | Server → Client | `{ hospitalId, hospitalName, resources, changes, timestamp }` |
| `hospital:status-updated` | Server → Client | `{ hospitalId, hospitalName, emergencyStatus, timestamp }` |
| `ambulance:location-updated` | Server → Client | `{ ambulanceId, latitude, longitude, timestamp }` |
| `ambulance:status-updated` | Server → Client | `{ ambulanceId, status, destinationHospitalId, timestamp }` |
| `incident:created` | Server → Client | `{ incident, timestamp }` |
| `incident:updated` | Server → Client | `{ incident, timestamp }` |
| `alert:broadcast` | Server → Client | `{ id, level, title, message, timestamp }` |
| `simulation:tick` | Server → Client | `{ step, totalSteps, bedsAvailable, description, timestamp }` |

---

## 11. Database Schema

Managed via Prisma:
* **User**: Authentication credentials, role (`ADMIN`, `HOSPITAL`, `PARAMEDIC`), optional hospital affiliation.
* **Hospital**: Coordinates, address, phone, emergency status.
* **HospitalResource**: Emergency beds, ICU beds, ventilators, operating rooms, blood units, trauma team availability.
* **Ambulance**: GPS coordinates, vehicle registration number, status, assigned paramedic, destination hospital.
* **Incident**: Hazard type, severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), casualty count, coordinates.
* **Route**: Distance (km), duration (min), coordinates geometry string.
* **ResourceUpdateLog**: Traceable audit log recording old value, new value, modifying user, and timestamp.

---

## 12. Automated Testing

CrisisSync includes Jest integration tests validating authentication, JWT verification, and resource bounds validation:

```bash
cd backend
npm test
```

Results:
```text
PASS tests/resource.test.js
PASS tests/auth.test.js
Test Suites: 2 passed, 2 total
Tests:       6 passed, 6 total
```

---

## 13. Safety & Positioning Notice

> **Hackathon Prototype / Simulation System**: CrisisSync is built for emergency coordination demonstration and simulation purposes. It does not replace official emergency dispatch (911/112) or medical triage protocols.

## 14. Author & Creator

**Ashutosh Pathak**
- **GitHub**: [@ashutoshpathak4121](https://github.com/ashutoshpathak4121)
- **LinkedIn**: [Ashutosh Pathak](https://linkedin.com/in/ashutoshpathak4121)
- **Role**: Lead Architect & Full-Stack Developer
- **Project**: CrisisSync — Real-Time Emergency Resource Allocator

---

## 15. License

Distributed under the MIT License. Copyright (c) 2024-2026 Ashutosh Pathak. See [LICENSE](LICENSE) for more information.
