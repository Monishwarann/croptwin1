import React, { useState } from 'react';

/**
 * CropZone Component
 * Interactive 3D field zone featuring stylized crop rows and health indicators.
 */
export default function CropZone({ zone, isSelected, onSelectZone }) {
  const [hovered, setHovered] = useState(false);

  // Determine health color scheme
  let cropColor = '#22c55e'; // Green - Healthy
  let borderHighlight = '#15803d';

  if (zone.marker === 'Stress' || zone.condition === 'Possible Stress') {
    cropColor = '#eab308'; // Yellow - Moderate Stress
    borderHighlight = '#d97706';
  } else if (zone.marker === 'Disease' || zone.risk === 'High') {
    cropColor = '#ef4444'; // Red - High Risk / Disease
    borderHighlight = '#dc2626';
  } else if (zone.marker === 'Unknown' || zone.unseenPattern) {
    cropColor = '#a855f7'; // Purple - Unknown Pattern
    borderHighlight = '#7e22ce';
  }

  const [posX, posY, posZ] = zone.position;
  const [width, depth] = zone.size || [4.2, 3.2];

  // Render crop rows inside this zone (3 parallel rows)
  const rowOffsetsZ = [-depth * 0.28, 0, depth * 0.28];
  const plantsPerRow = 5;
  const plantSpacingX = width / (plantsPerRow + 1);

  return (
    <group
      position={[posX, posY, posZ]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelectZone(zone);
      }}
    >
      {/* Soil Plot Base Tile */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial
          color={hovered ? '#4e3629' : '#3d281c'} // Rich brown earth
          roughness={0.9}
        />
      </mesh>

      {/* Row Furrow Lines */}
      {rowOffsetsZ.map((rz, rIdx) => (
        <mesh key={rIdx} position={[0, 0.11, rz]}>
          <boxGeometry args={[width * 0.9, 0.02, 0.35]} />
          <meshStandardMaterial color="#2d1c13" roughness={1.0} />
        </mesh>
      ))}

      {/* Stylized Tomato Crop Plants */}
      {rowOffsetsZ.map((rz, rIdx) =>
        Array.from({ length: plantsPerRow }).map((_, pIdx) => {
          const px = -width / 2 + plantSpacingX * (pIdx + 1);
          // Slight natural jitter
          const jitterX = (pIdx % 2 === 0 ? 0.05 : -0.05);
          return (
            <group key={`${rIdx}-${pIdx}`} position={[px + jitterX, 0.12, rz]}>
              {/* Plant Stem */}
              <mesh position={[0, 0.25, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.04, 0.5, 6]} />
                <meshStandardMaterial color="#166534" />
              </mesh>

              {/* Foliage Main Bush */}
              <mesh position={[0, 0.5, 0]} castShadow>
                <sphereGeometry args={[0.26, 8, 8]} />
                <meshStandardMaterial color={cropColor} roughness={0.7} />
              </mesh>

              {/* Top Leaves */}
              <mesh position={[0, 0.68, 0]} castShadow>
                <sphereGeometry args={[0.18, 6, 6]} />
                <meshStandardMaterial color={cropColor} roughness={0.6} />
              </mesh>

              {/* Tomato Fruits (for healthy & stress crops) */}
              {zone.marker !== 'Unknown' && (
                <>
                  <mesh position={[0.12, 0.42, 0.1]} castShadow>
                    <sphereGeometry args={[0.07, 6, 6]} />
                    <meshStandardMaterial color={zone.marker === 'Disease' ? '#991b1b' : '#dc2626'} />
                  </mesh>
                  <mesh position={[-0.1, 0.38, -0.12]} castShadow>
                    <sphereGeometry args={[0.065, 6, 6]} />
                    <meshStandardMaterial color={zone.marker === 'Disease' ? '#991b1b' : '#ea580c'} />
                  </mesh>
                </>
              )}
            </group>
          );
        })
      )}

      {/* Highlight Boundary Border on Hover or Selection */}
      {(hovered || isSelected) && (
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width + 0.15, depth + 0.15]} />
          <meshBasicMaterial
            color={borderHighlight}
            wireframe
            wireframeLinewidth={3}
            transparent
            opacity={isSelected ? 1.0 : 0.6}
          />
        </mesh>
      )}

      {/* Selected Indicator Floor Glow */}
      {isSelected && (
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[width, depth]} />
          <meshBasicMaterial color={borderHighlight} transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
}
