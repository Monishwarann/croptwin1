import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RefreshCw } from 'lucide-react';
import CropZone from './CropZone';
import FarmBuilding from './FarmBuilding';
import Tractor from './Tractor';
import HealthMarker from './HealthMarker';

/**
 * CameraControls Component
 * Manages camera ref and smooth view reset.
 */
function CameraController({ controlsRef }) {
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={6}
      maxDistance={40}
      maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera going below ground
      target={[0, 0, 0]}
    />
  );
}

/**
 * FarmScene Component
 * Interactive 3D Canvas rendering the digital twin farm field, barn, tractor, trees, boundary, and zones.
 */
export default function FarmScene({ zones, selectedZone, onSelectZone }) {
  const controlsRef = useRef();

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(16, 14, 16);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // Perimeter Trees
  const treePositions = [
    [-13, 0, -11], [-13, 0, -6], [-13, 0, -1], [-13, 0, 4], [-13, 0, 9],
    [13, 0, -11], [13, 0, -6], [13, 0, -1], [13, 0, 4], [13, 0, 9],
    [-8, 0, -11], [-3, 0, -11], [2, 0, -11], [8, 0, -11],
    [-8, 0, 9], [-3, 0, 9], [2, 0, 9], [8, 0, 9]
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '520px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: '#e2e8f0' }}>
      
      {/* Floating Viewport Controls */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: 10,
        display: 'flex',
        gap: '0.5rem'
      }}>
        <button
          onClick={handleResetCamera}
          className="btn btn-outline"
          style={{
            padding: '0.4rem 0.75rem',
            fontSize: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          title="Reset Camera Viewpoint"
        >
          <RefreshCw size={13} />
          <span>Reset View</span>
        </button>
      </div>

      {/* R3F 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [16, 14, 16], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#e0f2fe']} />
        
        {/* Soft Ambient & Directional Sun Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[20, 25, 15]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={60}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <hemisphereLight skyColor="#ffffff" groundColor="#334155" intensity={0.4} />

        {/* Orbit Camera Controller */}
        <CameraController controlsRef={controlsRef} />

        {/* Ground Terrain (Main Grass Field Base) */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[30, 0.2, 24]} />
          <meshStandardMaterial color="#4d7c0f" roughness={0.8} /> {/* Grass Green */}
        </mesh>

        {/* Tilled Crop Field Soil Bed Base */}
        <mesh position={[0, 0.01, -0.5]} receiveShadow>
          <boxGeometry args={[18, 0.05, 12]} />
          <meshStandardMaterial color="#352317" roughness={0.9} /> {/* Tilled Earth */}
        </mesh>

        {/* Irrigation Water Ditch */}
        <group position={[0, 0.02, 7]}>
          {/* Water Surface */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[26, 1.8]} />
            <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.1} opacity={0.85} transparent />
          </mesh>
          {/* Stone Banks */}
          <mesh position={[0, 0.01, -1]}>
            <boxGeometry args={[26, 0.08, 0.2]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.01, 1]}>
            <boxGeometry args={[26, 0.08, 0.2]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
        </group>

        {/* Wooden Field Boundary Fencing */}
        {/* Front & Rear Fence Line */}
        {[-13.5, 13.5].map((x, i) => (
          <group key={`fence-side-${i}`} position={[x, 0, 0]}>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.2, 0.8, 22]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Trees along Perimeter */}
        {treePositions.map((pos, idx) => (
          <group key={`tree-${idx}`} position={pos}>
            {/* Trunk */}
            <mesh position={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.25, 1.2, 8]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
            {/* Canopy */}
            <mesh position={[0, 1.8, 0]} castShadow>
              <coneGeometry args={[0.9, 1.8, 8]} />
              <meshStandardMaterial color="#15803d" roughness={0.7} />
            </mesh>
            <mesh position={[0, 2.5, 0]} castShadow>
              <coneGeometry args={[0.7, 1.4, 8]} />
              <meshStandardMaterial color="#166534" roughness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Farm Building (Barn & Silo) */}
        <FarmBuilding position={[-9.5, 0, -6.5]} rotation={[0, Math.PI / 6, 0]} />

        {/* Agricultural Tractor */}
        <Tractor position={[-5.8, 0, -4.5]} rotation={[0, -Math.PI / 4, 0]} />

        {/* Interactive Crop Field Zones */}
        {zones.map((z) => (
          <React.Fragment key={z.id}>
            <CropZone
              zone={z}
              isSelected={selectedZone?.id === z.id}
              onSelectZone={onSelectZone}
            />
            <HealthMarker
              zone={z}
              isSelected={selectedZone?.id === z.id}
              onClick={onSelectZone}
            />
          </React.Fragment>
        ))}

      </Canvas>
    </div>
  );
}
