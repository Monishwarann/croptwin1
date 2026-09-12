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
            "message": f"Model matched trained crop condition with confidence (≥ {int(threshold * 100)}%).",
            "recommendation": "Standard diagnostic workflow applied.",
            "threshold_used": threshold,
        }
    else:
        return {
            "is_known": False,
            "status": "Unseen Pattern Detected",
            "final_decision": "UNKNOWN CONDITION",
            "message": f"Model confidence ({confidence * 100:.1f}%) is below decision threshold ({int(threshold * 100)}%).",
            "recommendation": "Flagged as unverified open-set observation. Expert verification recommended.",
            "threshold_used": threshold,
        }


