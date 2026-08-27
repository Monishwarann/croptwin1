import React from 'react';

/**
 * FarmBuilding Component
 * Lightweight, procedural 3D red barn & silver silo model for the digital twin farm scene.
 */
export default function FarmBuilding({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Barn Base / Walls */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 2.5, 2.4]} />
        <meshStandardMaterial color="#9a3412" roughness={0.6} /> {/* Rustic Barn Red */}
      </mesh>

      {/* Barn Pitched Roof */}
      <mesh position={[0, 3.1, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0, 2.4, 3.3, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.4} /> {/* Slate Dark Grey Roof */}
      </mesh>

      {/* Barn White Trim Frame & Doors */}
      {/* Front Door Frame */}
      <mesh position={[0, 0.9, 1.21]}>
        <boxGeometry args={[1.1, 1.7, 0.05]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Front Double Door Inner */}
      <mesh position={[0, 0.85, 1.24]}>
        <boxGeometry args={[0.95, 1.5, 0.05]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>

      {/* Loft Window */}
      <mesh position={[0, 2.1, 1.22]}>
        <boxGeometry args={[0.6, 0.6, 0.05]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.3} />
      </mesh>

      {/* Silo Attachment */}
      <group position={[2.2, 0, 0]}>
        {/* Silo Body */}
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.7, 4, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.3} />
        </mesh>
        {/* Silo Dome Roof */}
        <mesh position={[0, 4.35, 0]} castShadow>
          <sphereGeometry args={[0.7, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}
