# CropTwin — Self-Evolving AI Digital Twin Platform

CropTwin is a full-stack agricultural monitoring platform combining PyTorch deep-learning crop disease identification (EfficientNet-B0), open-set unseen pattern discovery, expert knowledge verification, Firebase authentication, environmental telemetry, health forecasting, and interactive field Digital Twin visualization.

---

## 🚀 Key Features

- **Deep Learning Disease Detection**: Real-time PyTorch EfficientNet-B0 inference across 38 PlantVillage crop disease classes.
- **Open-Set Unseen Pattern Discovery**: Out-of-distribution confidence thresholding to trigger "Unseen Pattern" alerts for emerging crop health risks.
- **Firebase Protected Authentication**: Integrated Firebase Auth supporting Email/Password sign-in, user registration, and Google One-Tap authentication.
- **Interactive Inspection Reports**: Audit trail table with detailed single-report inspection modals, condition formatting, and printable export features.
- **Health Forecasting Engine**: Multi-horizon time-series health projections across 7-day, 14-day, and 21-day horizons.
- **Virtual Field Digital Twin**: Field state visualization combining environmental parameters (NDVI, temperature, rainfall, humidity) with temporal event logs.
- **User Profile & Customization**: Customizable open-set decision thresholds, default monitored plot selection, and personal researcher details.

---

## 📁 Repository Structure

```
CropTwin/
├── backend/
│   ├── main.py                     # FastAPI application endpoints
│   ├── requirements.txt            # Python backend dependencies
│   ├── best_efficientnet_crop_disease.pth # Trained PyTorch EfficientNet-B0 weights
│   ├── test_all_endpoints.py       # Full 12-endpoint automated test suite
│   ├── database/                   # SQLAlchemy engine, ORM models & CRUD
│   ├── schemas/                    # Pydantic data validation schemas
│   ├── services/                   # Disease detection, open-set & forecasting services
│   └── uploads/                    # Leaf images storage
│
├── frontend/
│   ├── package.json                # Node dependencies & scripts
│   ├── vite.config.js              # Vite server & FastAPI backend proxy
│   ├── index.html                  # Main HTML entry
│   └── src/
│       ├── main.jsx                # React DOM root
│       ├── App.jsx                 # App layout, router & Firebase auth listener
│       ├── firebase.js             # Firebase SDK setup (Auth, Firestore, Analytics)
│       ├── api/                    # Backend API bridge
│       ├── components/             # Reusable UI components (Sidebar, Header, Cards)
│       ├── pages/                  # Page views (Dashboard, Detection, Unknowns, Forecast, DigitalTwin, Reports, Profile, Login)
│       └── styles/                 # Global styling system
│
└── README.md
```

---

## ⚙️ Installation & Running

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional)
python -m venv venv
# On Windows activate:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

- **Backend API**: `http://127.0.0.1:8000`  
- **Swagger Interactive Docs**: `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup (React + Vite)

```bash
# Open a second terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

- **Frontend App**: `http://localhost:5173`

---

## 🧪 Testing Suite

### Backend API Tests
Run the comprehensive 12-endpoint automated test suite:
```bash
cd backend
python test_all_endpoints.py
```

### Frontend Production Build
Verify production asset compilation:
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
