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

    r_fail = client.post("/auth/login", json={"username": "researcher", "password": "wrongpassword"})
    assert r_fail.status_code == 401
    print("POST /auth/login invalid credentials handle OK")

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

    print("\n--- 6. Testing POST /predict/disease ---")
    img = Image.new("RGB", (224, 224), color=(34, 139, 34))
    draw = ImageDraw.Draw(img)
    draw.ellipse([30, 30, 190, 190], fill=(46, 117, 89))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    img_bytes = buf.getvalue()

    r = client.post(
        "/predict/disease",
        data={"field_id": 1, "threshold": 0.75},
        files={"file": ("leaf_test.jpg", img_bytes, "image/jpeg")}
    )
    assert r.status_code == 200
    pred_data = r.json()
    assert "observation_id" in pred_data
    obs_id = pred_data["observation_id"]
    print(f"POST /predict/disease OK (Observation ID #{obs_id})")

    print("\n--- 7. Testing GET /unknown/alerts ---")
    r = client.get("/unknown/alerts")
    assert r.status_code == 200
    alerts = r.json()
    print(f"GET /unknown/alerts OK ({len(alerts)} alerts)")

    if alerts:
        alert_id = alerts[0]["id"]
        print(f"\n--- 8. Testing POST /unknown/{alert_id}/verify ---")
        r_ver = client.post(
            f"/unknown/{alert_id}/verify",
            json={
                "observed_condition": "Disease",
                "verified_label": "Tomato Late Blight",
                "notes": "Verified by test suite",
                "expert_name": "Test Agronomist"
            }
        )
        assert r_ver.status_code == 200
        print("POST /unknown/verify OK:", r_ver.json()["message"])

    print("\n--- 9. Testing GET /environment ---")
    r = client.get("/environment?field_id=1")
    assert r.status_code == 200
    env_data = r.json()
    assert isinstance(env_data, list)
    print(f"GET /environment OK ({len(env_data)} records)")

    print("\n--- 10. Testing GET /forecast/1 ---")
    r = client.get("/forecast/1")
    assert r.status_code == 200
    fc = r.json()
    assert "has_sufficient_data" in fc
    print("GET /forecast/1 OK")

    print("\n--- 11. Testing GET /digital-twin/1 ---")
    r = client.get("/digital-twin/1")
    assert r.status_code == 200
    twin = r.json()
    assert "field_name" in twin
    print("GET /digital-twin/1 OK:", twin["field_name"])

    print("\n--- 12. Testing GET /reports ---")
    r = client.get("/reports")
    assert r.status_code == 200
    reports = r.json()
    assert isinstance(reports, list)
    print(f"GET /reports OK ({len(reports)} reports)")

    print("\n==========================================")
    print(">>> ALL 12 ENDPOINTS TESTED AND WORKING! <<<")
    print("==========================================")

if __name__ == "__main__":
    test_all_endpoints()
