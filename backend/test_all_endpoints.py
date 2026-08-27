import io
import sys
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient

from main import app

def test_all_endpoints():
    client = TestClient(app)

    print("--- 1. Testing GET / ---")
    r = client.get("/")
    assert r.status_code == 200, f"Expected 200, got {r.status_code}"
    print("GET / OK:", r.json()["project"])

    print("\n--- 2. Testing GET /health ---")
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "Healthy"
    print("GET /health OK:", r.json())

    print("\n--- 3. Testing POST /auth/login ---")
    r = client.post("/auth/login", json={"username": "researcher", "password": "admin123"})
    assert r.status_code == 200
    assert r.json()["status"] == "Success"
    print("POST /auth/login OK")

    print("\n--- 4. Testing GET /fields ---")
    r = client.get("/fields")
    assert r.status_code == 200
    fields = r.json()
    assert len(fields) > 0
    print(f"GET /fields OK ({len(fields)} fields returned)")

    print("\n--- 5. Testing GET /dashboard/overview ---")
    r = client.get("/dashboard/overview?field_id=1")
    assert r.status_code == 200
    print("GET /dashboard/overview OK:", r.json()["field_name"])

    print("\n--- 6. Testing POST /predict ---")
    img = Image.new("RGB", (224, 224), color=(34, 139, 34))
    draw = ImageDraw.Draw(img)
    draw.ellipse([30, 30, 190, 190], fill=(46, 117, 89))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()

    r = client.post(
        "/predict",
        data={"field_id": 1, "threshold": 0.75},
        files={"file": ("leaf_test.jpg", img_bytes, "image/jpeg")}
    )
    assert r.status_code == 200
    pred_data = r.json()
    assert "observation_id" in pred_data
    print(f"POST /predict OK (Observation ID #{pred_data['observation_id']})")

    print("\n--- 7. Testing GET /knowledge-base ---")
    r = client.get("/knowledge-base")
    assert r.status_code == 200
    kb_entries = r.json()
    assert isinstance(kb_entries, list)
    print(f"GET /knowledge-base OK ({len(kb_entries)} entries)")

    print("\n--- 8. Testing GET /history ---")
    r = client.get("/history")
    assert r.status_code == 200
    history = r.json()
    assert isinstance(history, list)
    print(f"GET /history OK ({len(history)} records)")

    print("\n==========================================")
    print(">>> ALL ENDPOINTS TESTED AND WORKING! <<<")
    print("==========================================")

if __name__ == "__main__":
    test_all_endpoints()
