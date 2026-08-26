import React from 'react';
import { AlertCircle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';

export default function PredictionCard({ result }) {
  if (!result) return null;

  const isKnown = result.is_known;

  return (
    <div className="card" style={{ borderLeft: `4px solid ${isKnown ? 'var(--color-accent)' : '#b45309'}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>
          {isKnown ? <CheckCircle2 size={20} color="var(--color-accent)" /> : <ShieldAlert size={20} color="#b45309" />}
          <span>{isKnown ? 'Model Diagnosis' : 'Open-Set Unknown Alert'}</span>
        </h3>
        <span className={`badge ${isKnown ? 'badge-success' : 'badge-warning'}`}>
          {result.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1.25rem', alignItems: 'center' }}>
        {/* Preview image */}
        <div style={{ width: '120px', height: '120px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f1f5f9', border: '1px solid var(--color-border)' }}>
          <img
            src={result.image_url.startsWith('http') || result.image_url.startsWith('/uploads') ? result.image_url : `/api${result.image_url}`}
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

        {/* Prediction metrics */}
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Crop: <strong style={{ color: 'var(--text-main)' }}>{result.crop}</strong></div>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', margin: '0.25rem 0' }}>
            {result.condition}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Confidence: </span>
              <strong style={{ color: isKnown ? 'var(--color-accent)' : '#b45309' }}>{result.confidence_percentage}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Risk Level: </span>
              <span className={`badge ${result.risk_level === 'High' ? 'badge-danger' : (result.risk_level === 'Medium' ? 'badge-warning' : 'badge-success')}`}>
                {result.risk_level}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            <Clock size={14} />
            <span>Analyzed at {result.timestamp}</span>
          </div>
        </div>
      </div>

      {result.message && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          backgroundColor: isKnown ? '#f0fdf4' : '#fffbe6',
          border: `1px solid ${isKnown ? '#bbf7d0' : '#fde68a'}`,
          borderRadius: '6px',
          fontSize: '0.8125rem',
          color: isKnown ? '#166534' : '#92400e',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem'
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{result.message}</span>
        </div>
      )}

      {/* Top Prediction Probabilities */}
      {result.top_predictions && result.top_predictions.length > 1 && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.625rem' }}>
            Model Confidence Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {result.top_predictions.slice(0, 5).map((pred, i) => (
              <div key={i} style={{ fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ color: i === 0 ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: i === 0 ? '600' : '400' }}>
                    {pred.crop} — {pred.condition}
                  </span>
                  <span style={{ fontWeight: '600', color: i === 0 ? 'var(--color-accent)' : 'var(--text-muted)' }}>
                    {pred.confidence_percentage}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min(100, Math.max(pred.confidence * 100, 2))}%`,
                      height: '100%',
                      backgroundColor: i === 0 ? 'var(--color-accent)' : '#94a3b8',
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
