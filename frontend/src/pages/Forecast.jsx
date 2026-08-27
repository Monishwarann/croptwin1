import React, { useEffect, useState } from 'react';
import { TrendingUp, CloudSun, Calendar, Cpu, RefreshCw } from 'lucide-react';
import ChartCard from '../components/ChartCard';
import { fetchForecastData, fetchEnvironmentalForecast } from '../api/api';

export default function Forecast({ selectedField }) {
  const [temperature, setTemperature] = useState(24.5);
  const [humidity, setHumidity] = useState(68);
  const [rainfall, setRainfall] = useState(12.0);
  const [soilMoisture, setSoilMoisture] = useState(45.0);

  const [forecastResult, setForecastResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadForecast = async () => {
    setLoading(true);
    try {
      const res = await fetchEnvironmentalForecast({
        temperature,
        humidity,
        rainfall,
        soil_moisture: soilMoisture
      });
      setForecastResult(res);
    } catch (err) {
      console.error('Forecast load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecast();
  }, [selectedField]);

  const handleCalculate = (e) => {
    e.preventDefault();
    loadForecast();
  };

  const chartData = [
    { day: 'Today', health: forecastResult?.forecasts?.[0]?.predicted_health || 75 },
    { day: '+7 Days', health: forecastResult?.forecasts?.[0]?.predicted_health || 75 },
    { day: '+14 Days', health: forecastResult?.forecasts?.[1]?.predicted_health || 77 },
    { day: '+21 Days', health: forecastResult?.forecasts?.[2]?.predicted_health || 80 }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Environmental & Crop Health Forecasting</h1>
        <p className="page-subtitle">Predictive crop risk simulation based on environmental parameters</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Left Column: Environmental Parameter Inputs */}
        <div className="card">
          <h3 className="card-title">
            <CloudSun size={18} color="var(--color-accent)" />
            <span>Environmental Controls</span>
          </h3>

          <form onSubmit={handleCalculate}>
            <div className="form-group">
              <label className="form-label">Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Humidity (%)</label>
              <input
                type="number"
                step="1"
                className="form-input"
                value={humidity}
                onChange={(e) => setHumidity(parseFloat(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rainfall (mm)</label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={rainfall}
                onChange={(e) => setRainfall(parseFloat(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Soil Moisture (%)</label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(parseFloat(e.target.value))}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Calculating Forecast...' : 'Recalculate Health Risk'}
            </button>
          </form>

          {/* Model Architecture Note */}
          <div style={{ marginTop: '1.25rem', padding: '0.75rem 0.875rem', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
              <Cpu size={14} color="var(--color-accent)" />
              <span>Model Architecture Note</span>
            </div>
            This module uses a multivariate environmental risk scoring model designed to be modularly replaced by a PyTorch LSTM time-series model in future work.
          </div>
        </div>

        {/* Right Column: Forecast Output & Charts */}
        <div>
          {loading ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Calculating environmental trajectory...
            </div>
          ) : (
            <div>
              <ChartCard
                title="Future Crop-Health Risk Trajectory"
                data={chartData}
                dataKey="health"
                xKey="day"
              />

              <div style={{ marginTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>Forecasting Horizons</h3>
                <div className="grid-3">
                  {(forecastResult?.forecasts || []).map((f, idx) => (
                    <div key={idx} className="card" style={{ borderTop: `4px solid ${f.risk_level === 'High' ? '#b91c1c' : (f.risk_level === 'Medium' ? '#b45309' : 'var(--color-accent)')}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                          {f.horizon} Horizon
                        </span>
                        <Calendar size={16} color="var(--text-muted)" />
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', margin: '0.25rem 0' }}>
                        {f.predicted_health}%
                      </div>
                      <div style={{ fontSize: '0.8125rem' }}>
                        Risk: <strong style={{ color: f.risk_level === 'High' ? '#b91c1c' : (f.risk_level === 'Medium' ? '#b45309' : '#15803d') }}>{f.risk_level}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
