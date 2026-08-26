"""
Unknown Condition / Open-Set Detection Service
Compares model confidence score with a configured threshold to determine
whether an observation is a known condition or an unseen/unknown pattern.
"""

DEFAULT_THRESHOLD = 0.75


def evaluate_open_set(confidence: float, threshold: float = DEFAULT_THRESHOLD):
    """
    Evaluates whether the prediction is known or unknown.
    """
    if confidence >= threshold:
        return {
            "is_known": True,
            "status": "Known Condition",
            "message": "The observed leaf condition matches a known trained pattern.",
            "threshold_used": threshold,
        }
    else:
        return {
            "is_known": False,
            "status": "Unseen Pattern Detected",
            "message": (
                "The system could not confidently match this image with a known condition. "
                "Expert verification is recommended."
            ),
            "threshold_used": threshold,
        }
