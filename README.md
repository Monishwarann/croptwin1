# CropNexia — Self-Evolving AI Digital Twin Platform

CropNexia is a full-stack agricultural monitoring and AI decision-support platform combining PyTorch deep-learning crop disease identification (EfficientNet-B0), open-set unseen pattern discovery, expert knowledge verification, Firebase authentication, environmental telemetry, health forecasting, and an **interactive 3D Digital Twin Farm**.

---

## 🚀 Key Features

- **Interactive 3D Digital Twin Farm**: Real-time 3D virtual farm environment built with Three.js, `@react-three/fiber`, and `@react-three/drei`.
  - **Interactive 3D Canvas**: Supports OrbitControls (rotate, zoom, pan, and smooth camera reset viewpoint).
  - **Agricultural Field Elements**: Low-poly 3D models including procedural crop zones, tomato crop rows, red farmhouse barn & silver silo, tractor, perimeter trees, boundary fencing, and irrigation ditch.
  - **Zone Health Status Badges**: Floating Drei 3D status markers indicating Healthy (Green), Possible Stress (Yellow), Disease / High Risk (Red), and Unseen Pattern (Purple).
  - **Zone Inspector Panel**: Clickable zones displaying live telemetry (temperature, humidity, NDVI, health score, risk level), AI architecture pipeline workflow, and unseen pattern expert verification actions.
  - **Telemetry & Status Cards**: Field health status summary, active alerts counter, model version tracker, historical health trends chart, and environmental conditions (temperature, humidity, rainfall, NDVI).

- **Deep Learning Disease Detection**: Real-time PyTorch EfficientNet-B0 inference across 38 PlantVillage crop disease classes with multi-crop support.
- **Open-Set Unseen Pattern Discovery**: Out-of-distribution confidence thresholding to trigger "Unseen Pattern" alerts for emerging crop health risks.
- **Firebase Protected Authentication**: Integrated Firebase Auth supporting Email/Password sign-in, user registration, and Google One-Tap authentication.
- **Interactive Inspection Reports**: Audit trail table with detailed single-report inspection modals, condition formatting, and printable export features.
- **Health Forecasting Engine**: Multi-horizon time-series health projections across 7-day, 14-day, and 21-day horizons.
- **User Profile & Customization**: Customizable open-set decision thresholds, default monitored plot selection, and personal researcher details.

---

## 📁 Repository Structure

```
CropNexia/
├── backend/
│   ├── main.py                     # FastAPI application endpoints
│   ├── requirements.txt            # Python backend dependencies (FastAPI, PyTorch, SQLAlchemy, Pydantic)
│   ├── best_efficientnet_crop_disease.pth # Trained PyTorch EfficientNet-B0 weights
│   ├── test_all_endpoints.py       # Automated 12-endpoint test suite
│   ├── database/                   # SQLAlchemy engine, ORM models & CRUD operations
│   ├── schemas/                    # Pydantic data validation schemas
│   ├── services/                   # Disease detection, open-set & forecasting logic
│   └── uploads/                    # Leaf images storage
│
├── frontend/
│   ├── package.json                # Node dependencies (React, Vite, Three.js, R3F, Drei, Recharts, Lucide)
│   ├── vite.config.js              # Vite dev server & FastAPI proxy configuration
│   ├── index.html                  # Main HTML entry
│   └── src/
│       ├── main.jsx                # React DOM root
│       ├── App.jsx                 # App layout, router & Firebase auth listener
│       ├── firebase.js             # Firebase SDK setup (Auth, Firestore, Analytics)
│       ├── api/                    # Backend API bridge (Axios/Fetch)
│       ├── components/             # Reusable UI components
│       │   ├── Header.jsx          # Top navigation header
│       │   ├── Sidebar.jsx         # App side menu
│       │   ├── HealthCard.jsx      # Crop health metric display
│       │   ├── WeatherCard.jsx     # Environmental weather widget
│       │   ├── ChartCard.jsx       # Recharts historical trend card
│       │   ├── PredictionCard.jsx  # Disease detection uploader & classifier UI
│       │   └── digitaltwin/        # 3D Digital Twin Farm Component Suite
│       │       ├── FarmScene.jsx   # Three.js Canvas container with camera & lighting
│       │       ├── CropZone.jsx    # Interactive 3D soil plot with crop rows
│       │       ├── HealthMarker.jsx# Floating 3D status badge over field zones
│       │       ├── FarmBuilding.jsx# Low-poly 3D barn & silo model
│       │       ├── Tractor.jsx     # Procedural 3D green tractor model
│       │       ├── FarmLegend.jsx  # Health condition color map legend
│       │       ├── DigitalTwinStatus.jsx # Field telemetry summary banner
│       │       └── ZoneDetails.jsx # Selected plot inspector & verification panel
│       │
│       ├── pages/                  # Page views (Dashboard, Detection, Unknowns, Forecast, DigitalTwin, Reports, Profile, KnowledgeBase)
│       └── styles/                 # Global CSS design system & variables
│
└── README.md
```

---

## ⚙️ Installation & Running

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# On Windows activate:
venv\Scripts\activate
# On macOS/Linux activate:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

- **Backend API**: `http://127.0.0.1:8000`  
- **Interactive Swagger API Docs**: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup (React + Vite + Three.js)

```bash
# Open a second terminal and navigate to frontend directory
cd frontend

# Install Node dependencies (including Three.js & React Three Fiber)
npm install

# Start Vite development server
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **3D Digital Twin View**: `http://localhost:5173/digital-twin`

---

## 🧪 Testing Suite

### Backend API Tests
Run the comprehensive automated test suite across all 12 FastAPI endpoints:
```bash
cd backend
python test_all_endpoints.py
```

### Frontend Production Build
Verify production JavaScript and 3D bundle compilation:
```bash
cd frontend
npm run build
```

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root API status & project information |
| `GET` | `/health` | API health check & timestamp |
| `POST` | `/auth/login` | Authentication endpoint |
| `GET` | `/fields` | Returns active field plots list |
| `GET` | `/dashboard/overview` | Field health telemetry & diagnostic summary |
| `POST` | `/predict/disease` | Leaf image upload & PyTorch EfficientNet inference |
| `GET` | `/unknown/alerts` | Unseen pattern open-set alert logs |
| `POST` | `/unknown/{id}/verify` | Submits expert verification for unseen patterns |
| `GET` | `/environment` | Environmental history (NDVI, temp, rainfall) |
| `GET` | `/forecast/{field_id}` | 7, 14, 21-day health projections |
| `GET` | `/digital-twin/{field_id}` | Digital twin state & event timeline |
| `GET` | `/reports` | Inspection audit trail & export dataset |
