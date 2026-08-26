from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    status: str
    message: str
    username: str
    token: str


class HealthCheckResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    environment: str


class FieldSchema(BaseModel):
    id: int
    name: str
    crop: str
    location: str
    area_hectares: float
    growth_stage: str

    class Config:
        from_attributes = True


class DashboardOverview(BaseModel):
    field_name: str
    crop: str
    health_score: float
    risk_level: str
    current_condition: str
    unresolved_unknowns: int
    last_analysis_date: Optional[str] = None
    is_known: Optional[bool] = True
    confidence_percentage: Optional[str] = "92.4%"
    image_url: Optional[str] = "/uploads/sample_tomato_leaf.jpg"
    temperature: Optional[str] = "Not available"
    humidity: Optional[str] = "Not available"
    rainfall: Optional[str] = "Not available"
    ndvi: Optional[str] = "Not available"


class DiseasePredictionResponse(BaseModel):
    crop: str
    predicted_class: str
    condition: str
    confidence: float
    confidence_percentage: str
    is_known: bool
    status: str
    message: Optional[str] = None
    risk_level: str
    health_score: Optional[float] = None
    timestamp: str
    image_url: str
    top_predictions: Optional[List[dict]] = None


class VerificationRequest(BaseModel):
    observed_condition: str
    verified_label: str
    notes: Optional[str] = ""
    expert_name: Optional[str] = "Agronomist Expert"


class VerificationResponse(BaseModel):
    status: str
    message: str
    verification_id: int
