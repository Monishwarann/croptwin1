import React, { useEffect, useState } from 'react';
import { Clock, Cpu } from 'lucide-react';
import DigitalTwinStatus from '../components/digitaltwin/DigitalTwinStatus';
import FarmLegend from '../components/digitaltwin/FarmLegend';
import FarmScene from '../components/digitaltwin/FarmScene';
import ZoneDetails from '../components/digitaltwin/ZoneDetails';
import HealthCard from '../components/HealthCard';
import WeatherCard from '../components/WeatherCard';
import ChartCard from '../components/ChartCard';
import { fetchDigitalTwinData, submitVerification } from '../api/api';

export default function DigitalTwin({ selectedField }) {
  const [twin, setTwin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);

  // Initial zone network data representing the field digital twin
  const [zones, setZones] = useState([
    {
      id: 'zone-01',
      zone: 'Zone 01',
      crop: 'Tomato',
      healthScore: 92,
      condition: 'Healthy',
      temperature: 27,
      humidity: 64,
      ndvi: 0.81,
      risk: 'Low',
      forecast: 'Stable',
      marker: 'Healthy',
      position: [-5, 0, -3],
      size: [4.2, 3.2]
    },
    {
      id: 'zone-02',
      zone: 'Zone 02',
      crop: 'Tomato',
      healthScore: 85,
      condition: 'Healthy',
      temperature: 28,
      humidity: 65,
      ndvi: 0.76,
      risk: 'Low',
      forecast: 'Stable',
      marker: 'Healthy',
      position: [0, 0, -3],
      size: [4.2, 3.2]
    },
    {
      id: 'zone-03',
      zone: 'Zone 03',
      crop: 'Tomato',
      healthScore: 61,
      condition: 'Possible Stress',
      temperature: 34,
      humidity: 58,
      ndvi: 0.62,
      risk: 'Medium',
      forecast: 'Monitor',
      marker: 'Stress',
      position: [5, 0, -3],
      size: [4.2, 3.2]
    },
    {
      id: 'zone-04',
      zone: 'Zone 04',
      crop: 'Tomato',
      healthScore: 48,
      condition: 'Early Blight Detected',
      temperature: 32,
      humidity: 78,
      ndvi: 0.51,
      risk: 'High',
      forecast: 'High Risk',
      marker: 'Disease',
      position: [-5, 0, 2],
      size: [4.2, 3.2]
    },
    {
      id: 'zone-05',
      zone: 'Zone 05',
      crop: 'Tomato',
      healthScore: 55,
      condition: 'Unknown Condition',
      unseenPattern: true,
      temperature: 31,
      humidity: 72,
      ndvi: 0.58,
      risk: 'Medium',
      forecast: 'Uncertain',
      marker: 'Unknown',
      position: [0, 0, 2],
      size: [4.2, 3.2]
    },
    {
      id: 'zone-06',
      zone: 'Zone 06',
      crop: 'Tomato',
      healthScore: 89,
      condition: 'Healthy',
      temperature: 27,
      humidity: 66,
      ndvi: 0.79,
      risk: 'Low',
      forecast: 'Stable',
      marker: 'Healthy',
      position: [5, 0, 2],
      size: [4.2, 3.2]
    }
  ]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchDigitalTwinData(selectedField);
        setTwin(res);
        
        // Synchronize general telemetry into Zone 01/03 if backend data returns
        if (res && res.current_health) {
          setZones((prevZones) =>
            prevZones.map((z) => {
              if (z.id === 'zone-03') {
                return {
                  ...z,
                  healthScore: Math.round(res.current_health),
                  condition: res.current_condition || z.condition,
                  risk: res.disease_risk || z.risk
                };
              }
              return z;
            })
          );
        }
      } catch (err) {
        console.error('Digital twin backend load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedField]);

  // Set default selected zone to Zone 03 on initial load
  useEffect(() => {
    if (!selectedZone && zones.length > 0) {
      setSelectedZone(zones[2]); // Zone 03
    }
  }, [zones, selectedZone]);

  const handleSendVerification = async (targetZone) => {
    try {
      await submitVerification(1, {
        verified_label: 'Pending Expert Inspection',
        notes: `Submitted from 3D Digital Twin map for ${targetZone.zone}`
      });
    } catch (err) {
      console.warn('Verification submission fallback:', err);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Synchronizing 3D Digital Twin Field Telemetry...
      </div>
    );
  }

  const historicalData = [
    { day: 'W-4', health: 85 },
    { day: 'W-3', health: 82 },
    { day: 'W-2', health: 78 },
    { day: 'W-1', health: 75 },
    { day: 'Current', health: twin?.current_health || 72 }
  ];

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">3D Digital Twin Farm</h1>
          <p className="page-subtitle">
            Interactive virtual model representing real-time crop health telemetry for {twin?.field_name || 'Tomato Plot 01'}
          </p>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <Clock size={14} />
          <span>Last Synced: {twin?.last_updated || 'Today'}</span>
        </div>
      </div>

      {/* Digital Twin Field Telemetry Overview Panel */}
      <DigitalTwinStatus
        fieldHealth={Math.round(twin?.current_health || 72)}
        activeAlerts={2}
        unknownPatterns={1}
        lastUpdated={twin?.last_updated || 'Today'}
        modelVersion="v1.2"
      />

      {/* 3D Farm Viewport & Side Inspector Layout */}
      <div className="digital-twin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.25rem', marginBottom: '1.5rem' }}>
        
        {/* Left Column: 3D Scene Viewport */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>
              Interactive 3D Field Representation
            </h3>
            <FarmLegend />
          </div>

          <FarmScene
            zones={zones}
            selectedZone={selectedZone}
            onSelectZone={(z) => setSelectedZone(z)}
          />
        </div>

        {/* Right Column: Selected Zone Details Inspector */}
        <div>
          <ZoneDetails
            zone={selectedZone}
            onSendVerification={handleSendVerification}
          />
        </div>

      </div>

      {/* Bottom Historical Health & Environmental Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <ChartCard
            title="Historical Health Trend"
            data={historicalData}
            dataKey="health"
            xKey="day"
          />
        </div>

        <div>
          <WeatherCard
            temperature={twin?.environmental_summary?.temperature || '24.5 °C'}
            humidity={twin?.environmental_summary?.humidity || '68%'}
            rainfall={twin?.environmental_summary?.rainfall || '12.0 mm'}
            ndvi={twin?.environmental_summary?.ndvi || '0.78'}
          />
        </div>
      </div>

    </div>
  );
}
