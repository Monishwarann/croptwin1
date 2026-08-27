import React from 'react';

/**
 * Tractor Component
 * Lightweight, procedural 3D green agricultural tractor model.
 */
export default function Tractor({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main Body Engine Hood */}
      <mesh position={[0, 0.65, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.8, 1.4]} />
        <meshStandardMaterial color="#15803d" roughness={0.4} /> {/* Agricultural Green */}
      </mesh>

      {/* Driver Cabin */}
      <mesh position={[0, 1.35, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 1.0, 1.0]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} opacity={0.85} transparent /> {/* Dark Glass Window */}
      </mesh>

      {/* Cabin Roof */}
      <mesh position={[0, 1.9, -0.4]} castShadow>
        <boxGeometry args={[1.15, 0.1, 1.1]} />
        <meshStandardMaterial color="#eab308" /> {/* Yellow Roof Top Accent */}
      </mesh>

      {/* Rear Large Wheels */}
      {/* Left Rear Wheel */}
      <mesh position={[-0.7, 0.6, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.35, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {/* Right Rear Wheel */}
      <mesh position={[0.7, 0.6, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.35, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Front Small Wheels */}
      {/* Left Front Wheel */}
      <mesh position={[-0.6, 0.35, 0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      {/* Right Front Wheel */}
      <mesh position={[0.6, 0.35, 0.7]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Exhaust Pipe */}
      <mesh position={[0.35, 1.3, 0.8]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.6} />
      </mesh>
    </group>
  );
}
