import React, { useEffect, useState } from 'react';
import { Cpu, Activity, Clock, ShieldCheck, MapPin, Layers } from 'lucide-react';
import HealthCard from '../components/HealthCard';
import WeatherCard from '../components/WeatherCard';
import { fetchDigitalTwinData } from '../api/api';

export default function DigitalTwin({ selectedField }) {
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchDigitalTwinData(selectedField);
        setTwin(res);
      } catch (err) {
        console.error('Digital twin load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedField]);

  if (loading) {
    return <div className="page-container" style={{ padding: '3rem', textAlign: 'center' }}>Synchronizing Digital Twin State...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Field Digital Twin Representation</h1>
          <p className="page-subtitle">Data-driven virtual model and temporal state for {twin?.field_name}</p>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Clock size={14} />
          <span>Last Synced: {twin?.last_updated}</span>
        </div>
      </div>

      {/* Field Overview Cards */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <HealthCard title="Field Identity" value={twin?.field_name} subtitle={`Crop: ${twin?.crop}`} icon={MapPin} />
        <HealthCard title="Growth Stage" value={twin?.growth_stage} subtitle={`Area: ${twin?.area_hectares} Hectares`} icon={Layers} />
        <HealthCard title="Digital Twin Health Index" value={`${twin?.current_health}%`} subtitle="Telemetry Index" icon={Activity} />
        <HealthCard title="Evaluated Risk" value={twin?.disease_risk} subtitle={twin?.current_condition} icon={ShieldCheck} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Telemetry & Environmental Parameters */}
        <div>
          <WeatherCard
            temperature={twin?.environmental_summary?.temperature}
            humidity={twin?.environmental_summary?.humidity}
            rainfall={twin?.environmental_summary?.rainfall}
            ndvi={twin?.environmental_summary?.ndvi}
          />
        </div>

        {/* Temporal Event Timeline */}
        <div className="card">
          <h3 className="card-title">
            <Cpu size={18} color="var(--color-accent)" />
            <span>Digital Twin Timeline Events</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {(twin?.timeline_events || []).map((ev, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '1rem',
                paddingBottom: '1rem',
                borderBottom: idx < twin.timeline_events.length - 1 ? '1px solid var(--color-border)' : 'none'
              }}>
                <div style={{
                  minWidth: '90px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--text-muted)'
                }}>
                  {ev.date}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    {ev.title}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {ev.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
