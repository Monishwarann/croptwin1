import React from 'react';
import { Thermometer, Droplets, CloudRain, Sun } from 'lucide-react';

export default function WeatherCard({ temperature, humidity, rainfall, ndvi }) {
  const metrics = [
    { label: 'Temperature', value: temperature || 'Not available', icon: Thermometer, color: '#e11d48' },
    { label: 'Relative Humidity', value: humidity || 'Not available', icon: Droplets, color: '#0284c7' },
    { label: 'Rainfall (24h)', value: rainfall || 'Not available', icon: CloudRain, color: '#2563eb' },
    { label: 'Canopy NDVI', value: ndvi || 'Not available', icon: Sun, color: '#16a34a' }
  ];

  return (
    <div className="card">
      <h3 className="card-title">Environmental Summary</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} style={{
              padding: '0.75rem',
              borderRadius: '6px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: m.color
              }}>
                <Icon size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.label}</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text-main)' }}>{m.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
