import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, Sprout, TrendingUp } from 'lucide-react';
import HealthCard from '../components/HealthCard';
import WeatherCard from '../components/WeatherCard';
import ChartCard from '../components/ChartCard';
import PredictionCard from '../components/PredictionCard';
import { fetchDashboardOverview, fetchForecastData } from '../api/api';

export default function Dashboard({ selectedField }) {
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const overview = await fetchDashboardOverview(selectedField);
        const fc = await fetchForecastData(selectedField);
        setData(overview);
        setForecast(fc);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedField]);

  if (loading) {
    return <div className="page-container" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Field Overview...</div>;
  }

  const mockTrend = [
    { day: 'Day -14', health: 80 },
    { day: 'Day -10', health: 78 },
    { day: 'Day -7', health: 75 },
    { day: 'Day -3', health: 73 },
    { day: 'Today', health: data?.health_score || 72 }
  ];

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Field Dashboard Overview</h1>
          <p className="page-subtitle">Real-time digital twin telemetry & health diagnostics for {data?.field_name || 'Tomato Field 01'}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <HealthCard
          title="Current Crop"
          value={data?.crop || 'Tomato'}
          subtitle="Growth Stage: Flowering"
          icon={Sprout}
          badgeText="Active Plot"
          badgeType="success"
        />
        <HealthCard
          title="Field Health Score"
          value={`${data?.health_score || 72}%`}
          subtitle="Overall Field (vs 95% Leaf Index)"
          icon={Activity}
          badgeText={data?.health_score >= 80 ? 'Healthy' : 'Moderate'}
          badgeType={data?.health_score >= 80 ? 'success' : 'warning'}
        />
        <HealthCard
          title="Disease Risk"
          value={data?.risk_level || 'Medium'}
          subtitle="Open-set evaluated"
          icon={ShieldCheck}
          badgeText={data?.risk_level === 'High' ? 'High Risk' : 'Monitored'}
          badgeType={data?.risk_level === 'High' ? 'danger' : 'warning'}
        />
        <HealthCard
          title="Unresolved Unknowns"
          value={data?.unresolved_unknowns || 0}
          subtitle="Requires Expert Review"
          icon={AlertTriangle}
          badgeText={data?.unresolved_unknowns > 0 ? 'Pending Verification' : 'Clean'}
          badgeType={data?.unresolved_unknowns > 0 ? 'warning' : 'success'}
        />
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        {/* Left Column: Charts & Predictions */}
        <div>
          <ChartCard
            title="14-Day Field Health Trend"
            data={mockTrend}
            dataKey="health"
            xKey="day"
          />

          <div style={{ marginTop: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Latest Leaf Diagnostics</h3>
            <PredictionCard
              result={{
                crop: data?.crop || 'Tomato',
                condition: data?.current_condition || 'Healthy',
                confidence_percentage: data?.confidence_percentage || '92.4%',
                is_known: data?.is_known !== undefined ? data.is_known : (data?.current_condition !== 'Unseen Pattern'),
                status: (data?.is_known !== false && data?.current_condition !== 'Unseen Pattern') ? 'Known Condition' : 'Unseen Pattern Detected',
                risk_level: data?.risk_level || 'Medium',
                timestamp: data?.last_analysis_date || '2026-08-26 14:30',
                image_url: data?.image_url || '/uploads/sample_tomato_leaf.jpg',
                message: (data?.is_known !== false && data?.current_condition !== 'Unseen Pattern')
                  ? 'Observation saved from last field telemetry sample.'
                  : 'The system detected an unverified leaf pattern requiring expert review.'
              }}
            />
          </div>
        </div>

        {/* Right Column: Environmental & Forecast Preview */}
        <div>
          <WeatherCard
            temperature={data?.temperature}
            humidity={data?.humidity}
            rainfall={data?.rainfall}
            ndvi={data?.ndvi}
          />

          <div className="card" style={{ marginTop: '1.25rem' }}>
            <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>
              <TrendingUp size={18} color="var(--color-accent)" />
              <span>Multi-Day Forecast Preview</span>
            </h3>

            {forecast?.has_sufficient_data ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {forecast.forecasts.map((f, idx) => (
                  <div key={idx} style={{
                    padding: '0.625rem 0.875rem',
                    borderRadius: '6px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: '600' }}>{f.horizon || `${f.horizon_days}-Day`} Horizon</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Risk: {f.risk_level}</div>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                      {f.predicted_health}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                Insufficient historical data for reliable forecasting.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
