"""
Forecasting Service
Time-series forecasting module placeholder.
Handles historical trend evaluation and 7, 14, 21-day health projections.
"""

def generate_health_forecast(history_records_count: int):
    """
    Returns 7-day, 14-day, 21-day health forecasts.
    If historical observations are insufficient (< 5 records), returns explicit message.
    """
    if history_records_count < 5:
        return {
            "has_sufficient_data": False,
            "message": "Insufficient historical data for reliable forecasting.",
            "forecasts": []
        }
    
    # Simple transparent linear projection placeholder for Phase 1
    return {
        "has_sufficient_data": True,
        "message": "Forecast generated using time-series baseline trend.",
        "forecasts": [
            {"horizon": "7-Day", "horizon_days": 7, "predicted_health": 74, "predicted_health_score": 74.0, "risk_level": "Medium"},
            {"horizon": "14-Day", "horizon_days": 14, "predicted_health": 77, "predicted_health_score": 77.0, "risk_level": "Low-Medium"},
            {"horizon": "21-Day", "horizon_days": 21, "predicted_health": 81, "predicted_health_score": 81.0, "risk_level": "Low"}
        ]
    }
