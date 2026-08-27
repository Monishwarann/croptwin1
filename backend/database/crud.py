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


def get_knowledge_base(db: Session):
    entries = db.query(models.KnowledgeBaseEntry).order_by(models.KnowledgeBaseEntry.date_added.desc()).all()
    if not entries:
        # Seed default knowledge base entries from 38 PlantVillage classes
        seeds = [
            models.KnowledgeBaseEntry(
                crop="Tomato",
                condition="Late Blight",
                symptoms="Dark water-soaked spots on leaves with pale green margins.",
                severity="High",
                source="PlantVillage Dataset Standard",
                verification_status="Standard Trained Class",
                notes="Phytophthora infestans oomycete pathogen."
            ),
            models.KnowledgeBaseEntry(
                crop="Tomato",
                condition="Early Blight",
                symptoms="Concentric rings (target pattern) on mature leaves.",
                severity="Medium",
                source="PlantVillage Dataset Standard",
                verification_status="Standard Trained Class",
                notes="Alternaria solani fungal infection."
            ),
            models.KnowledgeBaseEntry(
                crop="Corn (Maize)",
                condition="Common Rust",
                symptoms="Cinnamon-brown pustules on upper and lower leaf surfaces.",
                severity="Medium",
                source="PlantVillage Dataset Standard",
                verification_status="Standard Trained Class",
                notes="Puccinia sorghi rust fungus."
            ),
            models.KnowledgeBaseEntry(
                crop="Potato",
                condition="Early Blight",
                symptoms="Small brown-black spots expanding into target-board patterns.",
                severity="Medium",
                source="PlantVillage Dataset Standard",
                verification_status="Standard Trained Class",
                notes="Alternaria solani."
            ),
            models.KnowledgeBaseEntry(
                crop="Apple",
                condition="Apple Scab",
                symptoms="Olive-green to dark brown velvety spots on fruit and leaves.",
                severity="High",
                source="PlantVillage Dataset Standard",
                verification_status="Standard Trained Class",
                notes="Venturia inaequalis."
            )
        ]
        db.add_all(seeds)
        db.commit()
        return db.query(models.KnowledgeBaseEntry).all()
    return entries


def create_knowledge_entry(db: Session, entry_data: dict):
    entry = models.KnowledgeBaseEntry(
        crop=entry_data.get("crop", "Unknown"),
        condition=entry_data.get("condition", "Unseen Pattern"),
        symptoms=entry_data.get("symptoms", "Observed via open-set verification"),
        severity=entry_data.get("severity", "Medium"),
        source=entry_data.get("source", "Expert Verification"),
        verification_status=entry_data.get("verification_status", "Expert Verified Ground-Truth"),
        notes=entry_data.get("notes", "")
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

