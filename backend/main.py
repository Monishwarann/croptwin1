import os
import shutil
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from database.database import engine, Base, get_db
from database import models, crud
from schemas import schemas
from services.disease_detection import predict_disease, get_model
from services.unknown_detection import evaluate_open_set
from services.health_scoring import calculate_health_score
from services.forecasting import generate_health_forecast

# Initialize SQLite database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CropNexia API",
    description="Self-Evolving AI Digital Twin for Crop Health Monitoring & Forecasting",
    version="1.0.0"
)

# CORS middleware for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads directory configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


@app.on_event("startup")
def startup_event():
    """
    Pre-warm the PyTorch deep learning model on startup for fast inference.
    """
    try:
        get_model()
        print("[CropNexia] Backend ready with PyTorch model.")
    except Exception as e:
        print(f"[CropNexia] Warning during model initialization: {e}")


@app.get("/")
def read_root():
    return {
        "project": "Self-Evolving AI Digital Twin for Discovery and Forecasting of Emerging Crop Health Conditions",
        "status": "Online",
        "academic_project": True
    }


@app.get("/health", response_model=schemas.HealthCheckResponse)
def health_check():
    return {
        "status": "Healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": "Development / Academic Prototype"
    }


@app.post("/auth/login", response_model=schemas.LoginResponse)
def login(request: schemas.LoginRequest):
    # Simple local authentication for final-year project prototype
    if request.username in ["admin", "researcher", "agronomist"] and request.password == "admin123":
        return {
            "status": "Success",
            "message": "Authentication successful",
            "username": request.username,
            "token": f"mock-token-{request.username}"
        }
    raise HTTPException(status_code=401, detail="Invalid username or password")


@app.get("/fields", response_model=List[schemas.FieldSchema])
def get_fields(db: Session = Depends(get_db)):
    return crud.get_fields(db)


@app.get("/dashboard/overview", response_model=schemas.DashboardOverview)
def get_dashboard_overview(field_id: int = 1, db: Session = Depends(get_db)):
    field = crud.get_field_by_id(db, field_id)
    if not field:
        fields = crud.get_fields(db)
        field = fields[0] if fields else None
        if not field:
            raise HTTPException(status_code=404, detail="Field not found")

    latest_obs = crud.get_latest_observation(db, field.id)
    unresolved_unknowns = crud.get_unresolved_unknown_count(db)

    # Initial defaults for clean academic UI
    health_score = 72.0
    risk_level = "Medium"
    current_condition = "Healthy / Early Monitoring"
    last_analysis_date = None
    is_known = True
    confidence_percentage = "92.4%"
    image_url = "/uploads/sample_tomato_leaf.jpg"

    if latest_obs:
        health_score = latest_obs.health_score
        current_condition = latest_obs.condition_status
        last_analysis_date = latest_obs.timestamp.strftime("%Y-%m-%d %H:%M")
        image_url = latest_obs.image_path or image_url
        if latest_obs.predictions:
            risk_level = latest_obs.predictions.risk_level
            is_known = latest_obs.predictions.is_known
            confidence_percentage = f"{latest_obs.predictions.confidence * 100:.1f}%"
            if is_known:
                current_condition = latest_obs.predictions.condition_name
        else:
            is_known = current_condition.lower() != "unseen pattern"

    return {
        "field_name": field.name,
        "crop": field.crop,
        "health_score": health_score,
        "risk_level": risk_level,
        "current_condition": current_condition,
        "unresolved_unknowns": unresolved_unknowns,
        "last_analysis_date": last_analysis_date,
        "is_known": is_known,
        "confidence_percentage": confidence_percentage,
        "image_url": image_url,
        "temperature": "24.5 °C",
        "humidity": "68%",
        "rainfall": "12.0 mm",
        "ndvi": "0.78"
    }


@app.post("/predict/disease")
def analyze_crop_image(
    field_id: int = Form(1),
    threshold: float = Form(0.70),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Unable to analyze this file. Please upload a valid crop-leaf image.")

    # Save uploaded file safely
    timestamp_str = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"{timestamp_str}_{file.filename.replace(' ', '_')}"
    file_path = os.path.join(UPLOADS_DIR, safe_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Real-time PyTorch EfficientNet Deep Learning Inference
    with open(file_path, "rb") as img_file:
        raw_bytes = img_file.read()
    
    pred_res = predict_disease(raw_bytes, file.filename)
    open_set_res = evaluate_open_set(pred_res["confidence"], threshold=threshold)
    health_res = calculate_health_score(pred_res["condition"], pred_res["confidence"], open_set_res["is_known"])

    # Create Database Records
    obs = models.CropObservation(
        field_id=field_id,
        image_path=f"/uploads/{safe_filename}",
        health_score=health_res["health_score"],
        condition_status=pred_res["condition"] if open_set_res["is_known"] else "Unseen Pattern"
    )
    db.add(obs)
    db.commit()
    db.refresh(obs)

    prediction = models.Prediction(
        observation_id=obs.id,
        condition_name=pred_res["predicted_class"],
        confidence=pred_res["confidence"],
        is_known=open_set_res["is_known"],
        risk_level=health_res["risk_level"]
    )
    db.add(prediction)

    if not open_set_res["is_known"]:
        unknown_obs = models.UnknownObservation(
            observation_id=obs.id,
            confidence=pred_res["confidence"],
            threshold_used=threshold,
            status="Unverified"
        )
        db.add(unknown_obs)

    db.commit()

    closest_class = pred_res.get("closest_known_class", f"{pred_res['crop']} — {pred_res['condition']}")

    return {
        "observation_id": obs.id,
        "crop": pred_res["crop"],
        "predicted_class": pred_res["predicted_class"],
        "condition": pred_res["condition"],
        "closest_known_class": closest_class,
        "confidence": pred_res["confidence"],
        "confidence_percentage": pred_res["confidence_percentage"],
        "top_predictions": pred_res.get("top_predictions", []),
        "is_known": open_set_res["is_known"],
        "status": open_set_res["status"],
        "final_decision": open_set_res["final_decision"],
        "message": open_set_res["message"],
        "recommendation": open_set_res["recommendation"],
        "risk_level": health_res["risk_level"],
        "health_score": health_res["health_score"],
        "timestamp": obs.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
        "image_url": f"/uploads/{safe_filename}"
    }


@app.get("/unknown/alerts")
def get_unknown_alerts(db: Session = Depends(get_db)):
    unknowns = (
        db.query(models.UnknownObservation)
        .order_by(models.UnknownObservation.created_at.desc())
        .all()
    )
    results = []
    for u in unknowns:
        obs = u.observation
        pred = obs.predictions
        results.append({
            "id": u.id,
            "observation_id": obs.id,
            "field_id": obs.field_id,
            "image_url": obs.image_path,
            "confidence": f"{u.confidence * 100:.1f}%",
            "threshold_used": f"{u.threshold_used * 100:.1f}%",
            "status": u.status,
            "timestamp": u.created_at.strftime("%Y-%m-%d %H:%M"),
            "suggested_class": pred.condition_name if pred else "Unknown"
        })
    return results


@app.post("/unknown/{id}/verify", response_model=schemas.VerificationResponse)
def verify_unknown_observation(
    id: int,
    req: schemas.VerificationRequest,
    db: Session = Depends(get_db)
):
    unknown_obs = db.query(models.UnknownObservation).filter(models.UnknownObservation.id == id).first()
    if not unknown_obs:
        raise HTTPException(status_code=404, detail="Unknown observation record not found.")

    verification = models.Verification(
        unknown_id=id,
        observed_condition=req.observed_condition,
        verified_label=req.verified_label,
        notes=req.notes,
        expert_name=req.expert_name
    )
    unknown_obs.status = "Verified"
    db.add(verification)

    # Self-Evolving Workflow: Automatically store verified ground-truth in Knowledge Base
    obs = unknown_obs.observation
    field_crop = obs.field.crop if (obs and obs.field) else "Crop"
    crud.create_knowledge_entry(db, {
        "crop": field_crop,
        "condition": req.verified_label,
        "symptoms": req.notes or f"Verified {req.observed_condition} pattern.",
        "severity": "High" if "Blight" in req.verified_label or "Rot" in req.verified_label else "Medium",
        "source": f"Expert Verification ({req.expert_name})",
        "verification_status": "Verified Ground-Truth (Self-Evolving KB)",
        "notes": req.notes
    })

    db.commit()
    db.refresh(verification)

    return {
        "status": "Success",
        "message": "Verification record saved successfully. Dataset updated for future knowledge updates.",
        "verification_id": verification.id
    }


@app.get("/knowledge-base")
def get_knowledge_base_entries(db: Session = Depends(get_db)):
    return crud.get_knowledge_base(db)


@app.post("/knowledge-base")
def add_knowledge_base_entry(data: dict, db: Session = Depends(get_db)):
    return crud.create_knowledge_entry(db, data)


# --- Endpoint Aliases for Specification Compatibility ---

@app.post("/predict")
def predict_alias(
    field_id: int = Form(1),
    threshold: float = Form(0.70),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return analyze_crop_image(field_id=field_id, threshold=threshold, file=file, db=db)


@app.post("/detect-unknown")
def detect_unknown_alias(
    field_id: int = Form(1),
    threshold: float = Form(0.70),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    return analyze_crop_image(field_id=field_id, threshold=threshold, file=file, db=db)


@app.get("/history")
def history_alias(db: Session = Depends(get_db)):
    return get_reports_data(db=db)


@app.post("/verify-condition")
def verify_condition_alias(
    id: int,
    req: schemas.VerificationRequest,
    db: Session = Depends(get_db)
):
    return verify_unknown_observation(id=id, req=req, db=db)


@app.get("/forecast")
def forecast_query_alias(
    temperature: Optional[float] = None,
    humidity: Optional[float] = None,
    rainfall: Optional[float] = None,
    soil_moisture: Optional[float] = None,
    db: Session = Depends(get_db)
):
    # Flexible forecast calculator evaluating environmental metrics
    base_health = 80.0
    if temperature and temperature > 30.0:
        base_health -= 10.0
    if humidity and humidity > 80.0:
        base_health -= 12.0
    if rainfall and rainfall > 20.0:
        base_health -= 8.0

    risk = "High" if base_health < 65 else ("Medium" if base_health < 78 else "Low")
    return {
        "has_sufficient_data": True,
        "message": "Environmental forecast risk calculated.",
        "input_parameters": {
            "temperature": temperature or 24.5,
            "humidity": humidity or 68.0,
            "rainfall": rainfall or 12.0,
            "soil_moisture": soil_moisture or 45.0
        },
        "forecasts": [
            {"horizon": "7-Day", "horizon_days": 7, "predicted_health": round(base_health, 1), "risk_level": risk},
            {"horizon": "14-Day", "horizon_days": 14, "predicted_health": round(base_health + 2.0, 1), "risk_level": risk},
            {"horizon": "21-Day", "horizon_days": 21, "predicted_health": round(base_health + 5.0, 1), "risk_level": "Low"}
        ]
    }


@app.get("/environment")
def get_environment_history(field_id: int = 1, db: Session = Depends(get_db)):
    env_records = crud.get_environmental_data(db, field_id)
    if not env_records:
        # Realistic initial default table data
        return [
            {"date": "2026-08-25", "temperature": "24.5 °C", "humidity": "68%", "rainfall": "12.0 mm", "ndvi": "0.78", "health_score": 72.0},
            {"date": "2026-08-24", "temperature": "25.1 °C", "humidity": "65%", "rainfall": "0.0 mm", "ndvi": "0.79", "health_score": 74.0},
            {"date": "2026-08-23", "temperature": "23.8 °C", "humidity": "72%", "rainfall": "5.5 mm", "ndvi": "0.77", "health_score": 71.0},
            {"date": "2026-08-22", "temperature": "26.0 °C", "humidity": "60%", "rainfall": "0.0 mm", "ndvi": "0.80", "health_score": 75.0},
        ]
    return [
        {
            "date": e.date.strftime("%Y-%m-%d"),
            "temperature": f"{e.temperature} °C" if e.temperature else "Not available",
            "humidity": f"{e.humidity}%" if e.humidity else "Not available",
            "rainfall": f"{e.rainfall} mm" if e.rainfall else "Not available",
            "ndvi": str(e.ndvi) if e.ndvi else "Not available",
            "health_score": e.health_score or 70.0
        }
        for e in env_records
    ]


@app.get("/forecast/{field_id}")
def get_field_forecast(field_id: int, db: Session = Depends(get_db)):
    obs_count = db.query(models.CropObservation).filter(models.CropObservation.field_id == field_id).count()
    # If initial database records < 5, use mock baseline for Phase 1 preview
    if obs_count < 5:
        return {
            "has_sufficient_data": True, # set to True for UI demonstration in Phase 1
            "message": "Baseline time-series trend initialized for Tomato Field 01.",
            "historical_trend": [
                {"day": "Day -14", "health": 80},
                {"day": "Day -10", "health": 78},
                {"day": "Day -7", "health": 75},
                {"day": "Day -3", "health": 73},
                {"day": "Today", "health": 72},
            ],
            "forecasts": [
                {"horizon": "7-Day", "horizon_days": 7, "predicted_health": 74, "risk_level": "Medium", "confidence": "85%"},
                {"horizon": "14-Day", "horizon_days": 14, "predicted_health": 77, "risk_level": "Low-Medium", "confidence": "78%"},
                {"horizon": "21-Day", "horizon_days": 21, "predicted_health": 81, "risk_level": "Low", "confidence": "71%"},
            ]
        }
    return generate_health_forecast(obs_count)


@app.get("/digital-twin/{field_id}")
def get_digital_twin_data(field_id: int = 1, db: Session = Depends(get_db)):
    field = crud.get_field_by_id(db, field_id)
    if not field:
        field = crud.get_fields(db)[0]

    latest_obs = crud.get_latest_observation(db, field.id)

    return {
        "field_id": field.id,
        "field_name": field.name,
        "crop": field.crop,
        "location": field.location,
        "area_hectares": field.area_hectares,
        "growth_stage": field.growth_stage,
        "current_health": latest_obs.health_score if latest_obs else 72.0,
        "disease_risk": latest_obs.predictions.risk_level if (latest_obs and latest_obs.predictions) else "Medium",
        "current_condition": latest_obs.condition_status if latest_obs else "Healthy",
        "last_updated": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        "environmental_summary": {
            "temperature": "24.5 °C",
            "humidity": "68%",
            "rainfall": "12.0 mm",
            "ndvi": "0.78"
        },
        "timeline_events": [
            {"date": "2026-08-25", "type": "Observation", "title": "Field Inspection", "detail": "Healthy growth pattern logged"},
            {"date": "2026-08-20", "type": "Environmental", "title": "Rainfall Event", "detail": "12.0 mm precipitation recorded"},
            {"date": "2026-08-15", "type": "Stage", "title": "Growth Transition", "detail": "Transitioned to Flowering stage"}
        ]
    }


@app.get("/reports")
def get_reports_data(db: Session = Depends(get_db)):
    observations = crud.get_all_reports(db)
    reports = []
    for obs in observations:
        pred = obs.predictions
        unknown = obs.unknown_observation
        verification = unknown.verification if unknown else None

        reports.append({
            "id": obs.id,
            "date": obs.timestamp.strftime("%Y-%m-%d %H:%M"),
            "field": obs.field.name if obs.field else "Tomato Field 01",
            "crop": obs.field.crop if obs.field else "Tomato",
            "image_url": obs.image_path,
            "detected_condition": pred.condition_name if pred else obs.condition_status,
            "confidence": f"{pred.confidence * 100:.1f}%" if pred else "N/A",
            "status": "Known Condition" if (pred and pred.is_known) else "Unseen Pattern",
            "health_score": obs.health_score,
            "verification_status": verification.verified_label if verification else ("Unverified" if unknown else "Not Required")
        })
    
    if not reports:
        # Default report entry for demonstration
        reports.append({
            "id": 1,
            "date": datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            "field": "Tomato Field 01",
            "crop": "Tomato",
            "image_url": "/uploads/sample.jpg",
            "detected_condition": "Tomato___healthy",
            "confidence": "98.5%",
            "status": "Known Condition",
            "health_score": 95.0,
            "verification_status": "Not Required"
        })
        
    return reports
