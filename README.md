# Self-Evolving AI Digital Twin for Discovery and Forecasting of Emerging Crop Health Conditions

**Final-Year Academic & Research Project**

This software provides a full-stack agricultural monitoring platform combining deep-learning crop disease identification (EfficientNet-B0), open-set unseen pattern discovery, expert knowledge verification, environmental telemetry, health forecasting, and field Digital Twin visualization.

---

## 📁 Project Structure

```
CropTwin/
│
├── backend/
│   ├── main.py                     # FastAPI application endpoints
│   ├── requirements.txt            # Python backend dependencies
│   ├── croptwin.db                 # SQLite database (auto-generated)
│   ├── models/                     # PyTorch model weights storage
│   ├── services/
│   │   ├── disease_detection.py    # EfficientNet inference & 38 PlantVillage classes
│   │   ├── unknown_detection.py    # Open-set confidence thresholding
│   │   ├── health_scoring.py       # Multi-factor health scoring algorithm
│   │   └── forecasting.py          # Time-series trend forecasting service
│   ├── database/
│   │   ├── database.py             # SQLAlchemy engine & session setup
│   │   ├── models.py               # ORM Database Models
│   │   └── crud.py                 # Data access layer
│   ├── schemas/
│   │   └── schemas.py              # Pydantic schemas
│   └── uploads/                    # Leaf images storage
│
├── frontend/
│   ├── package.json                # Node dependencies
│   ├── index.html                  # HTML template with Inter typography
│   ├── vite.config.js              # Vite server & backend API proxy
│   └── src/
│       ├── main.jsx                # React DOM root
│       ├── App.jsx                 # Layout & Router
│       ├── api/
│       │   └── api.js              # Backend API bridge
│       ├── components/
│       │   ├── Sidebar.jsx         # Clean navigation sidebar
│       │   ├── Header.jsx          # Top bar with field switcher & API health status
│       │   ├── HealthCard.jsx      # Telemetry metric cards
│       │   ├── PredictionCard.jsx  # Disease analysis result cards
│       │   ├── WeatherCard.jsx     # Environmental & NDVI cards
│       │   └── ChartCard.jsx       # Recharts trend line charts
│       ├── pages/
│       │   ├── Login.jsx           # Local auth login
│       │   ├── Dashboard.jsx       # Field overview dashboard
│       │   ├── DiseaseDetection.jsx# Leaf image upload & analysis
│       │   ├── UnknownConditions.jsx# Open-set alerts & expert verifications
│       │   ├── Forecast.jsx        # Multi-horizon health projections
│       │   ├── DigitalTwin.jsx     # Virtual field twin representation
│       │   └── Reports.jsx         # Exportable audit reports & CSV dataset
│       └── styles/
│           └── global.css          # Professional agricultural design system
│
└── README.md
```

---

## ⚙️ Installation & Running

### 1. Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional)
python -m venv venv
# On Windows activate:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server with Uvicorn
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend will run on `http://127.0.0.1:8000`  
Swagger API Docs available at `http://127.0.0.1:8000/docs`

---

### 2. Frontend (React + Vite)

```bash
# Open a second terminal and navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔍 Verification

1. Open `http://localhost:5173` in your browser.
2. Sign in using the academic prototype credentials:
   - **Username**: `researcher`
   - **Password**: `admin123`
3. Observe the green **"Connected (API v1.0)"** status badge in the header, confirming real-time HTTP bridge between Vite frontend and FastAPI backend.
