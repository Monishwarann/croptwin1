"""
Unknown Condition / Open-Set Detection Service
Compares model confidence score with a configured threshold to determine
whether an observation is a known condition or an unseen/unknown pattern.
"""

DEFAULT_THRESHOLD = 0.70


def evaluate_open_set(confidence: float, threshold: float = DEFAULT_THRESHOLD):
    """
    Evaluates whether the prediction is known or an unseen/unknown pattern.
    Default threshold: 0.70 (70%).
    """
    if confidence >= threshold:
        return {
            "is_known": True,
            "status": "Known Condition",
            "final_decision": "KNOWN CONDITION",
            "message": "Model matched trained crop-health condition with high confidence.",
            "recommendation": "",
            "threshold_used": threshold,
        }
    else:
        return {
            "is_known": False,
            "status": "Unseen Pattern Detected",
            "final_decision": "UNKNOWN CONDITION",
            "message": "No reliable match found in the trained classes.",
            "recommendation": "Expert verification recommended.",
            "threshold_used": threshold,
        }

