// API integration layer for CropTwin FastAPI backend

const API_BASE = '/api';

async function safeFetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    throw new Error(`Server response was not valid JSON (${res.status}): ${text.slice(0, 100)}`);
  }
  if (!res.ok) {
    throw new Error(data.detail || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function checkHealth() {
  try {
    return await safeFetchJson(`${API_BASE}/health`);
  } catch (err) {
    console.error('Health API error:', err);
    return { status: 'Offline', version: '1.0.0', environment: 'Disconnected' };
  }
}

export async function loginUser(username, password) {
  return await safeFetchJson(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
}

export async function fetchFields() {
  return await safeFetchJson(`${API_BASE}/fields`);
}

export async function fetchDashboardOverview(fieldId = 1) {
  return await safeFetchJson(`${API_BASE}/dashboard/overview?field_id=${fieldId}`);
}

export async function analyzeImage(formData) {
  return await safeFetchJson(`${API_BASE}/predict/disease`, {
    method: 'POST',
    body: formData
  });
}

export async function fetchUnknownAlerts() {
  return await safeFetchJson(`${API_BASE}/unknown/alerts`);
}

export async function submitVerification(unknownId, verificationData) {
  return await safeFetchJson(`${API_BASE}/unknown/${unknownId}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(verificationData)
  });
}

export async function fetchEnvironmentData(fieldId = 1) {
  return await safeFetchJson(`${API_BASE}/environment?field_id=${fieldId}`);
}

export async function fetchForecastData(fieldId = 1) {
  return await safeFetchJson(`${API_BASE}/forecast/${fieldId}`);
}

export async function fetchDigitalTwinData(fieldId = 1) {
  return await safeFetchJson(`${API_BASE}/digital-twin/${fieldId}`);
}

export async function fetchReportsData() {
  return await safeFetchJson(`${API_BASE}/reports`);
}

