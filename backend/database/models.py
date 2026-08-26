from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="researcher")
    created_at = Column(DateTime, default=datetime.utcnow)


class Field(Base):
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    crop = Column(String, nullable=False)
    location = Column(String, default="Main Research Station")
    area_hectares = Column(Float, default=1.5)
    growth_stage = Column(String, default="Flowering")
    created_at = Column(DateTime, default=datetime.utcnow)

    observations = relationship("CropObservation", back_populates="field")
    environmental_records = relationship("EnvironmentalData", back_populates="field")
    forecasts = relationship("Forecast", back_populates="field")


class CropObservation(Base):
    __tablename__ = "crop_observations"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), nullable=False)
    image_path = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    health_score = Column(Float, default=100.0)
    condition_status = Column(String, default="Pending")

    field = relationship("Field", back_populates="observations")
    predictions = relationship("Prediction", back_populates="observation", uselist=False)
    unknown_observation = relationship("UnknownObservation", back_populates="observation", uselist=False)


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    observation_id = Column(Integer, ForeignKey("crop_observations.id"), nullable=False)
    condition_name = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    is_known = Column(Boolean, default=True)
    risk_level = Column(String, default="Low")
    predicted_at = Column(DateTime, default=datetime.utcnow)

    observation = relationship("CropObservation", back_populates="predictions")


class UnknownObservation(Base):
    __tablename__ = "unknown_observations"

    id = Column(Integer, primary_key=True, index=True)
    observation_id = Column(Integer, ForeignKey("crop_observations.id"), nullable=False)
    confidence = Column(Float, nullable=False)
    threshold_used = Column(Float, nullable=False)
    status = Column(String, default="Unverified")  # Unverified / Verified
    created_at = Column(DateTime, default=datetime.utcnow)

    observation = relationship("CropObservation", back_populates="unknown_observation")
    verification = relationship("Verification", back_populates="unknown_obs", uselist=False)


class EnvironmentalData(Base):
    __tablename__ = "environmental_data"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    rainfall = Column(Float, nullable=True)
    ndvi = Column(Float, nullable=True)
    health_score = Column(Float, nullable=True)

    field = relationship("Field", back_populates="environmental_records")


class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"), nullable=False)
    forecast_date = Column(DateTime, default=datetime.utcnow)
    horizon_days = Column(Integer, nullable=False)  # 7, 14, 21
    predicted_health_score = Column(Float, nullable=False)
    risk_level = Column(String, default="Medium")

    field = relationship("Field", back_populates="forecasts")


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(Integer, primary_key=True, index=True)
    unknown_id = Column(Integer, ForeignKey("unknown_observations.id"), nullable=False)
    observed_condition = Column(String, nullable=False)
    verified_label = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    verified_at = Column(DateTime, default=datetime.utcnow)
    expert_name = Column(String, default="Agronomist Expert")

    unknown_obs = relationship("UnknownObservation", back_populates="verification")
