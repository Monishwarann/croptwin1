import React from 'react';
import { Html } from '@react-three/drei';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

/**
 * HealthMarker Component
 * Floating Drei HTML status badge over a 3D crop field zone.
 */
export default function HealthMarker({ zone, isSelected, onClick }) {
  const markerType = zone.marker || (
    zone.unseenPattern ? 'Unknown' : 
    (zone.healthScore < 50 ? 'Disease' : (zone.healthScore < 75 ? 'Stress' : 'Healthy'))
  );

  let badgeStyle = {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    color: '#15803d',
    icon: CheckCircle2,
    label: 'Healthy'
  };

  if (markerType === 'Stress' || zone.condition === 'Possible Stress') {
    badgeStyle = {
      bg: '#fffbe6',
      border: '#fde68a',
      color: '#b45309',
      icon: AlertTriangle,
      label: 'Stress'
    };
  } else if (markerType === 'Disease' || zone.risk === 'High') {
    badgeStyle = {
      bg: '#fef2f2',
      border: '#fecaca',
      color: '#b91c1c',
      icon: AlertCircle,
      label: 'Disease'
    };
  } else if (markerType === 'Unknown' || zone.unseenPattern) {
    badgeStyle = {
      bg: '#f3e8ff',
      border: '#d8b4fe',
      color: '#7e22ce',
      icon: HelpCircle,
      label: 'Unknown'
    };
  }

  const IconComp = badgeStyle.icon;

  return (
    <Html
      position={[zone.position[0], 2.2, zone.position[2]]}
      center
      distanceFactor={18}
      zIndexRange={[100, 0]}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick(zone);
        }}
        style={{
          cursor: 'pointer',
          padding: '0.35rem 0.65rem',
          borderRadius: '20px',
          backgroundColor: badgeStyle.bg,
          border: `2px solid ${isSelected ? badgeStyle.color : badgeStyle.border}`,
          boxShadow: isSelected 
            ? `0 0 12px ${badgeStyle.color}66, 0 4px 6px -1px rgba(0,0,0,0.1)` 
            : '0 2px 4px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          transition: 'all 0.2s ease',
          transform: isSelected ? 'scale(1.1) translateY(-3px)' : 'scale(1)',
          fontSize: '0.75rem',
          fontWeight: '700',
          color: badgeStyle.color
        }}
      >
        <IconComp size={14} color={badgeStyle.color} />
        <span>{zone.zone}: {badgeStyle.label} ({zone.healthScore}%)</span>
      </div>
    </Html>
  );
}
