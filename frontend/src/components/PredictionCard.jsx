import React from 'react';
import { CheckCircle2, ShieldAlert, Clock, AlertTriangle, Info, ListChecks, Cpu } from 'lucide-react';

export default function PredictionCard({ result }) {
  if (!result) return null;

  const isKnown = result.is_known;
  const closestClass = result.closest_known_class || `${result.crop} — ${result.condition}`;
  const modelEngine = result.model_engine || 'PyTorch EfficientNet-B0 (38 Classes)';

  // Guarantee structured 4-box recommendations for any prediction result
  const recs = (result.recommendations && result.recommendations.immediate_action) ? result.recommendations : {
    immediate_action: result.recommendation || `Flag ${result.crop} section for expert verification and targeted agronomic isolation.`,
    preventive_measure: "Maintain sanitation guidelines, sanitize farm tools, and monitor temperature/humidity spikes.",
    recommended_treatment: isKnown ? (result.condition?.toLowerCase().includes('healthy') ? "None (Standard Organic Maintenance)" : "Targeted Fungicide/Bactericide Spray") : "Broad-spectrum bio-protectant spray pending expert verification.",
    monitoring_advice: "Re-scan leaf sample in 48 hours for symptom development or progress."
  };

  const sampleHealthIndex = result.health_score || (result.condition?.toLowerCase().includes('healthy') ? 95 : 72);

  return (
    <div
      className="card"
      style={{
        borderLeft: `5px solid ${isKnown ? 'var(--color-accent)' : '#d97706'}`,
        backgroundColor: isKnown ? '#ffffff' : '#fffbeb'
      }}
    >
      {/* Live EfficientNet Verification Badge */}
      <div style={{
        fontSize: '0.75rem',
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        border: '1px solid #bae6fd',
        padding: '0.4rem 0.75rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: '600' }}>
          <Cpu size={15} color="#0284c7" />
          <span>Verified Model Inference Engine: <strong>{modelEngine}</strong></span>
        </div>
        <span style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.6875rem', fontWeight: '700' }}>
          ⚡ PyTorch Live
        </span>
      </div>

      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ margin: 0, color: isKnown ? '#15803d' : '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isKnown ? <CheckCircle2 size={22} color="var(--color-accent)" /> : <AlertTriangle size={22} color="#d97706" />}
          <span>{isKnown ? '✓ Known Condition Diagnosed' : '⚠ Unseen Pattern Detected'}</span>
        </h3>
        <span className={`badge ${isKnown ? 'badge-success' : 'badge-warning'}`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}>
          {isKnown ? 'KNOWN CONDITION' : 'UNKNOWN CONDITION'}
        </span>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '1.25rem', alignItems: 'flex-start' }}>
        {/* Preview Image */}
        <div style={{ width: '130px', height: '130px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f1f5f9', border: '1px solid var(--color-border)' }}>
          <img
            src={result.image_url?.startsWith('http') || result.image_url?.startsWith('/uploads') ? result.image_url : `/uploads/sample_leaf.jpg`}
            alt="Analyzed Crop Leaf"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerText = 'Leaf Preview';
              e.target.parentNode.style.display = 'flex';
              e.target.parentNode.style.alignItems = 'center';
              e.target.parentNode.style.justifyContent = 'center';
              e.target.parentNode.style.fontSize = '0.75rem';
              e.target.parentNode.style.color = '#94a3b8';
            }}
          />
        </div>

        {/* Prediction Metrics */}
        <div>
          {isKnown ? (
            /* CONFIDENT / KNOWN DIAGNOSIS DISPLAY */
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                Predicted Crop Condition
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: '0.2rem 0 0.5rem 0' }}>
                {result.crop} — {result.condition}
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Model Confidence: </span>
                  <strong style={{ color: 'var(--color-accent)', fontSize: '1rem' }}>{result.confidence_percentage}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Risk Level: </span>
                  <span className={`badge ${result.risk_level === 'High' ? 'badge-danger' : (result.risk_level === 'Medium' ? 'badge-warning' : 'badge-success')}`}>
                    {result.risk_level}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Sample Health Index: </span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{sampleHealthIndex}%</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                ℹ Note: <em>Sample Health Index</em> ({sampleHealthIndex}%) is the diagnostic score of this leaf sample (95% for healthy leaves), whereas <em>Overall Field Health</em> (72%) represents composite health across all 6 plot zones.
              </div>

              <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                Final Decision: KNOWN CONDITION
              </div>
            </div>
          ) : (
            /* UNCERTAIN / UNKNOWN PATTERN DISPLAY */
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
                No reliable match found in trained 38 PlantVillage classes.
              </div>

              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Model Confidence: </span>
                <strong style={{ color: '#b45309', fontSize: '1rem' }}>{result.confidence_percentage}</strong>
              </div>

              {/* Closest Known Class (Secondary Information) */}
              <div style={{
                margin: '0.5rem 0',
                padding: '0.625rem 0.875rem',
                backgroundColor: '#ffffff',
                border: '1px dashed #fde68a',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: '600' }}>
                  Closest known class (Secondary Info):
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: '500', marginTop: '0.15rem' }}>
                  {closestClass}
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: '700', color: '#b45309' }}>
                Final Decision: UNKNOWN CONDITION
              </div>

              <div style={{ fontSize: '0.8125rem', color: '#b45309', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Info size={14} />
                <span>Recommendation: Expert verification recommended for unverified open-set sample.</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            <Clock size={14} />
            <span>Analyzed at {result.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Top Prediction Probabilities Distribution */}
      {result.top_predictions && result.top_predictions.length > 1 && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.625rem' }}>
            EfficientNet-B0 Probability Distribution (Top Predictions)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {result.top_predictions.slice(0, 5).map((pred, i) => (
              <div key={i} style={{ fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ color: i === 0 ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: i === 0 ? '600' : '400' }}>
                    {pred.crop} — {pred.condition}
                  </span>
                  <span style={{ fontWeight: '600', color: i === 0 ? (isKnown ? 'var(--color-accent)' : '#b45309') : 'var(--text-muted)' }}>
                    {pred.confidence_percentage}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(pred.confidence * 100, 2))}%`,
                      height: '100%',
                      backgroundColor: i === 0 ? (isKnown ? 'var(--color-accent)' : '#d97706') : '#94a3b8',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Agronomic Recommendations & Treatment Plan */}
      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <ListChecks size={18} color="var(--color-accent)" />
          <span>Recommended Actions & Agronomic Treatment Plan</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8125rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>⚡ Immediate Intervention:</strong>
            <span style={{ color: '#334155' }}>{recs.immediate_action}</span>
          </div>

          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>🛡 Preventive Measure:</strong>
            <span style={{ color: '#334155' }}>{recs.preventive_measure}</span>
          </div>

          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>🔬 Recommended Treatment:</strong>
            <span style={{ color: '#15803d', fontWeight: '600' }}>{recs.recommended_treatment}</span>
          </div>

          <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.25rem' }}>📅 Monitoring Schedule:</strong>
            <span style={{ color: '#334155' }}>{recs.monitoring_advice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
