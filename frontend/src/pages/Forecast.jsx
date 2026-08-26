import React, { useEffect, useState } from 'react';
import { TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import { fetchForecastData } from '../api/api';

export default function Forecast({ selectedField }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchForecastData(selectedField);
        setData(res);
      } catch (err) {
        console.error('Forecast load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedField]);

  if (loading) {
    return <div className="page-container" style={{ padding: '3rem', textAlign: 'center' }}>Loading Time-Series Projections...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Health Forecasting Engine</h1>
        <p className="page-subtitle">Predictive crop health trajectories across 7-day, 14-day, and 21-day horizons</p>
      </div>

      {data?.has_sufficient_data ? (
        <div>
          <ChartCard
            title="Historical Health & Predictive Trajectory"
            data={data.historical_trend || [
              { day: 'Day -14', health: 80 },
              { day: 'Day -10', health: 78 },
              { day: 'Day -7', health: 75 },
              { day: 'Day -3', health: 73 },
              { day: 'Today', health: 72 }
            ]}
          />

          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Forecasting Horizons Summary</h3>
            <div className="grid-3">
              {(data.forecasts || []).map((f, idx) => (
                <div key={idx} className="card" style={{ borderTop: '4px solid var(--color-accent)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                      {f.horizon || `${f.horizon_days}-Day`} Forecast
                    </span>
                    <Calendar size={18} color="var(--text-muted)" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)', margin: '0.25rem 0' }}>
                    {f.predicted_health}%
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    Risk: <strong style={{ color: f.risk_level === 'High' ? '#b91c1c' : '#15803d' }}>{f.risk_level}</strong>
                  </div>
                  {f.confidence && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                      Model Confidence: {f.confidence}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertCircle size={40} color="#b45309" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Insufficient Historical Data
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '500px', margin: '0 auto' }}>
            {data?.message || 'Insufficient historical data for reliable forecasting. At least 5 field observations are required.'}
          </p>
        </div>
      )}
    </div>
  );
}
