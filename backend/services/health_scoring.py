"""
Health Scoring Service
Computes crop field overall health index based on disease predictions,
environmental conditions, and historical trends.
"""

def calculate_health_score(condition: str, confidence: float, is_known: bool):
    """
    Transparent health score calculation.
    """
    if not is_known:
        # Unknown condition indicates risk uncertainty
        base_score = 65.0
        risk_level = "Medium"
    elif "healthy" in condition.lower():
        base_score = 95.0
        risk_level = "Low"
    elif "blight" in condition.lower() or "rot" in condition.lower():
        base_score = 55.0
        risk_level = "High"
    elif "spot" in condition.lower() or "mildew" in condition.lower():
        base_score = 72.0
        risk_level = "Medium"
    else:
        base_score = 78.0
        risk_level = "Medium"
        
    return {
        "health_score": round(base_score, 1),
        "risk_level": risk_level
    }
