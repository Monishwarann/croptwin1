import io
import sys
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient

from main import app
from services.disease_detection import predict_disease, get_model, PLANT_CLASSES

def main():
    print("=== 1. Testing Model Singleton Initialization ===")
    model = get_model()
    print("Model loaded successfully. Type:", type(model).__name__)

    print("\n=== 2. Creating Synthetic Test Leaf Image ===")
    img = Image.new("RGB", (300, 300), color=(34, 139, 34))
    draw = ImageDraw.Draw(img)
    draw.ellipse([50, 50, 250, 250], fill=(46, 117, 89), outline=(20, 80, 20))
    draw.line([150, 50, 150, 250], fill=(20, 80, 20), width=3)

    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()

    print("\n=== 3. Testing Direct PyTorch predict_disease ===")
    pred = predict_disease(img_bytes, filename="sample_leaf.jpg")
    print("Predicted Crop:", pred["crop"])
    print("Predicted Condition:", pred["condition"])
    print("Predicted Class:", pred["predicted_class"])
    print("Confidence:", pred["confidence_percentage"])
    print("Risk Level:", pred["risk_level"])
    print("Top 3 Predictions:")
    for p in pred["top_predictions"][:3]:
        print(f"   - {p['crop']} ({p['condition']}) : {p['confidence_percentage']}")

    print("\n=== 4. Testing FastAPI /predict/disease endpoint via TestClient ===")
    client = TestClient(app)
    response = client.post(
        "/predict/disease",
        data={"field_id": 1, "threshold": 0.75},
        files={"file": ("test_leaf.jpg", img_bytes, "image/jpeg")}
    )

    print("Status Code:", response.status_code)
    json_data = response.json()
    print("API Response:")
    for k, v in json_data.items():
        if k == "top_predictions":
            print(f"  {k}: {len(v)} classes returned")
        else:
            print(f"  {k}: {v}")

    assert response.status_code == 200, "Expected 200 OK"
    assert "predicted_class" in json_data, "predicted_class missing"
    assert "confidence" in json_data, "confidence missing"
    assert "top_predictions" in json_data, "top_predictions missing"
    assert len(json_data["top_predictions"]) == 5, "Expected 5 top predictions"
    print("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    main()
