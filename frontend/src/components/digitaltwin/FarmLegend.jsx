import React from 'react';

/**
 * FarmLegend Component
 * Simple legend indicating visual health state color meanings.
 */
export default function FarmLegend() {
  const legendItems = [
    { label: 'Healthy', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
    { label: 'Stress', color: '#eab308', bg: '#fffbe6', border: '#fde68a' },
    { label: 'Disease / High Risk', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
    { label: 'Unknown Pattern', color: '#a855f7', bg: '#f3e8ff', border: '#d8b4fe' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.875rem',
      flexWrap: 'wrap',
      padding: '0.5rem 0.875rem',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--color-border)',
      fontSize: '0.75rem',
      fontWeight: '600'
    }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Legend:
      </span>
      {legendItems.map((item, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '12px',
            backgroundColor: item.bg,
            border: `1px solid ${item.border}`,
            color: item.color
          }}
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: item.color,
            display: 'inline-block'
          }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
