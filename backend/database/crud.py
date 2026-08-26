from sqlalchemy.orm import Session
from datetime import datetime
from . import models


def get_fields(db: Session):
    fields = db.query(models.Field).all()
    if not fields:
        # Seed default field if database is empty
        default_field = models.Field(
            name="Tomato Field 01",
            crop="Tomato",
            location="North Field Station",
            area_hectares=2.4,
            growth_stage="Flowering"
        )
        db.add(default_field)
        db.commit()
        db.refresh(default_field)
        return [default_field]
    return fields


def get_field_by_id(db: Session, field_id: int):
    return db.query(models.Field).filter(models.Field.id == field_id).first()


def get_latest_observation(db: Session, field_id: int):
    return (
        db.query(models.CropObservation)
        .filter(models.CropObservation.field_id == field_id)
        .order_by(models.CropObservation.timestamp.desc())
        .first()
    )


def get_unresolved_unknown_count(db: Session):
    return (
        db.query(models.UnknownObservation)
        .filter(models.UnknownObservation.status == "Unverified")
        .count()
    )


def get_environmental_data(db: Session, field_id: int, limit: int = 10):
    return (
        db.query(models.EnvironmentalData)
        .filter(models.EnvironmentalData.field_id == field_id)
        .order_by(models.EnvironmentalData.date.desc())
        .limit(limit)
        .all()
    )


def get_all_reports(db: Session):
    return db.query(models.CropObservation).order_by(models.CropObservation.timestamp.desc()).all()
