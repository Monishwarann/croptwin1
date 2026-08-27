import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckSquare, ShieldCheck, Database } from 'lucide-react';
import { fetchUnknownAlerts, submitVerification } from '../api/api';

export default function UnknownConditions() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [cropName, setCropName] = useState('Tomato');
  const [conditionName, setConditionName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState('High');
  const [notes, setNotes] = useState('');
  const [expertName, setExpertName] = useState('Dr. Agronomist');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await fetchUnknownAlerts();
      setAlerts(data);
      if (data.length > 0 && !selectedAlert) {
        setSelectedAlert(data[0]);
      }
    } catch (err) {
      console.error('Error fetching unknown alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAlert || !conditionName) return;

    setSaving(true);
    setSuccessMsg('');
    try {
      await submitVerification(selectedAlert.id, {
        observed_condition: `${cropName} — ${conditionName}`,
        verified_label: `${cropName} — ${conditionName}`,
        notes: `Symptoms: ${symptoms} | Severity: ${severity} | Notes: ${notes}`,
        expert_name: expertName
      });
      setSuccessMsg('Verified & successfully added to Knowledge Base.');
      setConditionName('');
      setSymptoms('');
      setNotes('');
      loadAlerts();
    } catch (err) {
      alert('Verification submission failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Unknown Condition Discovery & Verification</h1>
        <p className="page-subtitle">
          Open-set uncertainty management: Validate unseen leaf patterns to evolve system knowledge base
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: List of Unseen Patterns */}
        <div className="card">
          <h3 className="card-title">
            <AlertTriangle size={18} color="#b45309" />
            <span>Unseen Pattern Alerts ({alerts.length})</span>
          </h3>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Alerts...</div>
          ) : alerts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <ShieldCheck size={36} color="var(--color-accent)" style={{ marginBottom: '0.5rem' }} />
              <div>No pending unseen condition alerts requiring verification.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {alerts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { setSelectedAlert(item); setSuccessMsg(''); }}
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: `1px solid ${selectedAlert?.id === item.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    backgroundColor: selectedAlert?.id === item.id ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>
                      Alert #{item.id} - Unseen Pattern
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Model Confidence: <strong>{item.confidence}</strong> | Threshold: {item.threshold_used}
                    </div>
                  </div>
                  <span className={`badge ${item.status === 'Verified' ? 'badge-success' : 'badge-warning'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Expert Verification Form */}
        <div>
          {selectedAlert ? (
            <div className="card">
              <h3 className="card-title">
                <CheckSquare size={18} color="var(--color-accent)" />
                <span>Expert Verification Form (Alert #{selectedAlert.id})</span>
              </h3>

              {successMsg && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '6px',
                  color: '#166534',
                  fontSize: '0.8125rem'
                }}>
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleVerificationSubmit}>
                <div className="form-group">
                  <label className="form-label">Crop Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Tomato, Cherry, Potato"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Condition Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Early Blight, Powdery Mildew, Nutrient Deficiency"
                    value={conditionName}
                    onChange={(e) => setConditionName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Symptoms</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dark concentric leaf spots, yellowing margins"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Severity</label>
                  <select
                    className="form-select"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Provide additional agronomic field notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expert Verifier</label>
                  <input
                    type="text"
                    className="form-input"
                    value={expertName}
                    onChange={(e) => setExpertName(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || !conditionName}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {saving ? 'Saving...' : 'Verify & Add to Knowledge Base'}
                </button>
              </form>
            </div>
          ) : (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Select an alert from the left panel to inspect and verify.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
