import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

const SEVERITY_COLORS = {
  critical: "#ef4444", // Red
  high: "#f97316",     // Orange
  moderate: "#eab308", // Yellow
  low: "#22c55e",      // Green
  none: "#6b7280"      // Gray
};

function BiasSpike({ x, z, height, group, attribute, severity, onHover }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.none;
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (severity === "critical") {
        material.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 3 + x) * 0.3;
      } else if (hovered) {
        material.emissiveIntensity = 0.8;
      } else {
        material.emissiveIntensity = 0;
      }
    }
  });

  // Calculate actual position based on grid
  const posX = (x - 1) * 4; // Spacing of 4
  const posZ = (z - 1) * 4;
  const actualHeight = Math.max(height * 15, 0.2); // Scale height

  return (
    <group 
      position={[posX, 0, posZ]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover({ group, attribute, height, severity, x: e.clientX, y: e.clientY }); }}
      onPointerOut={() => { setHovered(false); onHover(null); }}
    >
      <mesh ref={meshRef} position={[0, actualHeight / 2, 0]} castShadow>
        <boxGeometry args={[1.5, actualHeight, 1.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      {/* Glow Base */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.4 : 0.1} />
      </mesh>
      
      {/* Label for the spike if hovered or critical */}
      {(hovered || severity === 'critical') && (
        <Text 
          position={[0, actualHeight + 1, 0]} 
          fontSize={0.5} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000"
        >
          {group}
        </Text>
      )}
    </group>
  );
}

function GroundGrid() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#050510" />
      </mesh>
      <gridHelper args={[40, 20, "#333", "#111"]} position={[0, 0.01, 0]} />
    </group>
  );
}

export function BiasTopologyMap({ topologyData }) {
  const [tooltip, setTooltip] = useState(null);

  // Parse data for Three.js layout if needed, but we'll use x, y from topologyData
  return (
    <div className="w-full h-full bg-black relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2 className="text-2xl font-light text-white tracking-wide">Bias Topology Map</h2>
        <p className="text-gray-400 text-sm mt-1">
          Height = Disparity Magnitude. <span className="text-purple-400">Peaks indicate severe bias.</span>
        </p>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-6 right-6 z-10 glass-panel p-3 rounded-lg flex flex-col gap-2 pointer-events-none">
        {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
          <div key={sev} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: color, color: color }} />
            <span className="text-gray-300 text-xs uppercase tracking-wider">{sev}</span>
          </div>
        ))}
      </div>

      {/* Tooltip Overlay */}
      {tooltip && (
        <div 
          className="absolute z-20 glass-panel p-4 rounded-xl pointer-events-none transition-opacity"
          style={{ 
            left: Math.min(tooltip.x + 20, window.innerWidth - 200), 
            top: tooltip.y - 40 
          }}
        >
          <div className="text-xs text-gray-400 uppercase">{tooltip.attribute}</div>
          <div className="text-lg font-bold text-white mb-1">{tooltip.group}</div>
          <div className="text-sm">
            Disparity: <span className="font-mono text-purple-400">{(tooltip.height * 100).toFixed(1)}%</span>
          </div>
          <div className="text-xs mt-1" style={{ color: SEVERITY_COLORS[tooltip.severity] }}>
            {tooltip.severity.toUpperCase()} RISK
          </div>
        </div>
      )}

      <Canvas camera={{ position: [15, 12, 15], fov: 45 }} shadows dpr={[1, 2]}>
        <color attach="background" args={['#030008']} />
        <fog attach="fog" args={['#030008', 20, 50]} />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-10, 10, -10]} color="#a855f7" intensity={2} />
        
        <GroundGrid />
        
        <group position={[0, 0, 0]}>
          {topologyData.map((point, i) => (
            <BiasSpike
              key={i}
              x={point.x}
              z={point.y}
              height={point.z}
              group={point.group}
              attribute={point.attribute}
              severity={point.severity}
              onHover={setTooltip}
            />
          ))}
        </group>
        
        <OrbitControls
          enablePan={false}
          minDistance={10}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate
          autoRotateSpeed={0.8}
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
