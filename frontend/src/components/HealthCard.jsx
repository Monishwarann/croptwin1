import React from 'react';

export default function HealthCard({ title, value, subtitle, icon: Icon, badgeText, badgeType = 'success' }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>{title}</span>
        {Icon && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {typeof Icon === 'string' || Icon.name === 'Sprout' ? (
              <img src="/favicon.svg" alt="CropNexia Icon" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            ) : (
              <Icon size={18} color="#ffffff" />
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          {value}
        </span>
        {badgeText && (
          <span className={`badge badge-${badgeType}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}
