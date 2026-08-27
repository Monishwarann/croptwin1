import React from 'react';
import { CheckCircle2, ShieldAlert, Clock, AlertTriangle, Info } from 'lucide-react';

export default function PredictionCard({ result }) {
  if (!result) return null;

  const isKnown = result.is_known;
  const closestClass = result.closest_known_class || `${result.crop} — ${result.condition}`;

  return (
    <div
      className="card"
      style={{
        borderLeft: `5px solid ${isKnown ? 'var(--color-accent)' : '#d97706'}`,
        backgroundColor: isKnown ? '#ffffff' : '#fffbeb'
      }}
    >
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ margin: 0, color: isKnown ? '#15803d' : '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isKnown ? <CheckCircle2 size={22} color="var(--color-accent)" /> : <AlertTriangle size={22} color="#d97706" />}
          <span>{isKnown ? '✓ Known Condition' : '⚠ Unseen Pattern Detected'}</span>
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
            /* CONIDENT / KNOWN DIAGNOSIS DISPLAY */
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                Predicted Condition
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: '0.2rem 0 0.5rem 0' }}>
                {result.crop} — {result.condition}
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Confidence: </span>
                  <strong style={{ color: 'var(--color-accent)', fontSize: '1rem' }}>{result.confidence_percentage}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Risk Level: </span>
                  <span className={`badge ${result.risk_level === 'High' ? 'badge-danger' : (result.risk_level === 'Medium' ? 'badge-warning' : 'badge-success')}`}>
                    {result.risk_level}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                Final Decision: KNOWN CONDITION
              </div>
            </div>
          ) : (
            /* UNCERTAIN / UNKNOWN PATTERN DISPLAY */
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem' }}>
                No reliable match found in the trained classes.
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
                <span>Recommendation: Expert verification recommended.</span>
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
            Model Confidence Breakdown (Top Predictions)
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
    </div>
  );
}
