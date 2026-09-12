import React from 'react';
import { Activity, AlertTriangle, HelpCircle, Clock, Cpu } from 'lucide-react';

/**
 * DigitalTwinStatus Component
 * Displays overall field digital twin status telemetry indicators.
 */
export default function DigitalTwinStatus({ fieldHealth = 72, activeAlerts = 2, unknownPatterns = 1, lastUpdated = 'Today', modelVersion = 'v1.2' }) {
  return (
    <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Field Health */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-accent-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-accent)'
          }}>
            <Activity size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Overall Field Health (6-Zone Composite)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{fieldHealth}%</div>
          </div>
        </div>

        {/* Active Alerts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-warning-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-warning-text)'
          }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Active Alerts</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{activeAlerts}</div>
          </div>
        </div>

        {/* Unknown Patterns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#f3e8ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7e22ce'
          }}>
            <HelpCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Unknown Patterns</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>{unknownPatterns}</div>
          </div>
        </div>

        {/* Last Updated */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Last Updated</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text-main)' }}>{lastUpdated}</div>
          </div>
        </div>

        {/* Model Version */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}>
            <Cpu size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>Model Version</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: '600', color: 'var(--text-main)' }}>{modelVersion}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
