import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout, Activity, Thermometer, Droplets, Sun, AlertTriangle,
  CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Send, Eye, RefreshCw
} from 'lucide-react';

/**
 * ZoneDetails Component
 * Side panel card displaying selected crop zone telemetry, AI pipeline representation, and action buttons.
 */
export default function ZoneDetails({ zone, onSendVerification }) {
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  if (!zone) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <img
          src="/favicon.svg"
          alt="CropNexia Icon"
          style={{ width: '48px', height: '48px', borderRadius: '50%', marginBottom: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.25)', display: 'inline-block', objectFit: 'cover' }}
        />
        <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Zone Selected</h4>
        <p style={{ fontSize: '0.875rem' }}>Click any crop zone on the 3D Digital Twin Farm to inspect telemetry, health metrics, and AI disease diagnostic states.</p>
      </div>
    );
  }

  const isUnknown = zone.unseenPattern || zone.marker === 'Unknown' || zone.condition?.includes('Unknown');

  const handleVerify = async () => {
    setVerifying(true);
    try {
      if (onSendVerification) {
        await onSendVerification(zone);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
      setVerifiedSuccess(true);
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  let statusBadge = { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', icon: CheckCircle2 };
  if (zone.marker === 'Stress' || zone.condition?.includes('Stress')) {
    statusBadge = { bg: '#fffbe6', color: '#b45309', border: '#fde68a', icon: AlertTriangle };
  } else if (zone.marker === 'Disease' || zone.risk === 'High') {
    statusBadge = { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', icon: AlertCircle };
  } else if (isUnknown) {
    statusBadge = { bg: '#f3e8ff', color: '#7e22ce', border: '#d8b4fe', icon: HelpCircle };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header Title & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>
            Selected Plot Telemetry
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.15rem' }}>
            {zone.zone}
          </h2>
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: statusBadge.bg,
          color: statusBadge.color,
          border: `1px solid ${statusBadge.border}`,
          fontSize: '0.8125rem',
          fontWeight: '700'
        }}>
          <StatusIcon size={15} />
          <span>{zone.condition}</span>
        </div>
      </div>

      {/* Unseen Pattern Warning Alert */}
      {isUnknown && (
        <div style={{
          padding: '0.875rem 1rem',
          backgroundColor: '#f3e8ff',
          border: '1px solid #d8b4fe',
          borderRadius: 'var(--radius-sm)',
          color: '#6b21a8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.9375rem' }}>
            <AlertTriangle size={18} color="#7e22ce" />
            <span>Unseen Pattern Detected</span>
          </div>
          <p style={{ fontSize: '0.8125rem', marginTop: '0.35rem', color: '#581c87', lineHeight: '1.4' }}>
            The EfficientNet Open-Set classifier identified anomalous feature embeddings that do not match existing known crop diseases.
          </p>

          <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.875rem' }}>
            <button
              onClick={() => navigate('/unknowns')}
              className="btn btn-outline"
              style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.8125rem', borderColor: '#d8b4fe', color: '#6b21a8' }}
            >
              <Eye size={14} />
              View Details
            </button>
            <button
              onClick={handleVerify}
              disabled={verifying || verifiedSuccess}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.8125rem', backgroundColor: '#7e22ce', borderColor: '#7e22ce' }}
            >
              {verifying ? (
                <>
                  <RefreshCw size={14} className="spin" />
                  Sending...
                </>
              ) : verifiedSuccess ? (
                <>
                  <CheckCircle2 size={14} />
                  Sent to Expert
                </>
              ) : (
                <>
                  <Send size={14} />
                  Send for Verification
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Primary Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.875rem',
        backgroundColor: 'var(--bg-main)',
        padding: '0.875rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Crop Type</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <img src="/favicon.png" alt="CropNexia Icon" style={{ width: '16px', height: '16px', borderRadius: '4px' }} />
            {zone.crop}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Health Score</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Activity size={15} color="var(--color-accent)" />
            {zone.healthScore}%
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Temperature</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Thermometer size={15} color="#ea580c" />
            {zone.temperature}°C
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Humidity</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Droplets size={15} color="#0284c7" />
            {zone.humidity}%
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NDVI Vegetation</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sun size={15} color="#16a34a" />
            {zone.ndvi}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Risk Level</div>
          <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: zone.risk === 'High' ? '#dc2626' : (zone.risk === 'Medium' ? '#d97706' : '#16a34a') }}>
            {zone.risk}
          </div>
        </div>
      </div>

      {/* AI Workflow Connection Representation */}
      <div style={{
        padding: '0.875rem',
        backgroundColor: '#fafafa',
        borderRadius: 'var(--radius-sm)',
        border: '1px dashed var(--color-border)'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          CropNexia AI Architecture Workflow
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.25rem',
          fontSize: '0.6875rem',
          color: 'var(--text-main)',
          fontWeight: '600'
        }}>
          <span style={{ background: '#e2e8f0', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Crop Image</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span style={{ background: '#dcfce7', padding: '0.2rem 0.4rem', borderRadius: '4px', color: '#166534' }}>EfficientNet</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span style={{ background: '#fef3c7', padding: '0.2rem 0.4rem', borderRadius: '4px', color: '#92400e' }}>Environment Data</span>
          <ArrowRight size={12} color="var(--text-muted)" />
          <span style={{ background: '#dbeafe', padding: '0.2rem 0.4rem', borderRadius: '4px', color: '#1e40af' }}>Digital Twin</span>
        </div>
      </div>

    </div>
  );
}
