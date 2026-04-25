import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "../App";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#F5A0B5",
  high: "#F5C888",
  moderate: "#B8CCEE",
  low: "#98D5B0",
  none: "#3A3A3A",
};

function BiasSpike({ x, z, height, group, attribute, severity, onHover }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.none;
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, hovered ? 0.2 : 0, 0.1);
    }
  });

  const posX = (x - 1) * 4;
  const posZ = (z - 1) * 4;
  const actualHeight = Math.max(height * 15, 0.2);

  return (
    <group
      position={[posX, 0, posZ]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover({ group, attribute, height, severity, x: e.clientX, y: e.clientY });
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(null);
      }}
    >
      <mesh ref={meshRef} position={[0, actualHeight / 2, 0]} castShadow>
        <boxGeometry args={[1.5, actualHeight, 1.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0}
          metalness={0.05}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.15 : 0.04} />
      </mesh>
      {(hovered || severity === "critical") && (
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

function GroundGrid({ isDark }: { isDark: boolean }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={isDark ? "#050505" : "#F0F0F0"} />
      </mesh>
      <gridHelper
        args={[40, 20, isDark ? "#1A1A1A" : "#D1D5DB", isDark ? "#0D0D0D" : "#E5E7EB"]}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}

const SERIF = "'DM Serif Display', serif";
const MONO = "'JetBrains Mono', monospace";

export function BiasTopologyMap({ topologyData }: any) {
  const [tooltip, setTooltip] = useState<any>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bgColor = isDark ? "#000000" : "#FAFAFA";
  const fogColor = isDark ? "#000000" : "#FAFAFA";

  return (
    <div
      className="w-full h-full relative rounded-2xl overflow-hidden"
      style={{
        background: bgColor,
        border: `1px solid var(--theme-border)`,
      }}
    >
      
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2
          className="text-text-primary"
          style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "22px" }}
        >
          Bias Topology Map
        </h2>
        <p className="text-text-3 mt-1" style={{ fontFamily: MONO, fontSize: "11px" }}>
          Height = Disparity Magnitude.{" "}
          <span className="text-iris">Peaks indicate severe bias.</span>
        </p>
      </div>

      <div
        className="absolute bottom-6 right-6 z-10 p-3 rounded-lg flex flex-col gap-2 pointer-events-none"
        style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}
      >
        {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
          <div key={sev} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-text-3 uppercase" style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.12em" }}>
              {sev}
            </span>
          </div>
        ))}
      </div>

      {tooltip && (
        <div
          className="absolute z-20 p-4 rounded-xl pointer-events-none"
          style={{
            background: "var(--theme-surface)",
            border: "1px solid var(--theme-border)",
            left: Math.min(tooltip.x + 20, window.innerWidth - 220),
            top: tooltip.y - 60,
          }}
        >
          <div className="text-text-4 uppercase" style={{ fontFamily: MONO, fontSize: "9px" }}>
            {tooltip.attribute}
          </div>
          <div className="text-text-primary mb-1" style={{ fontFamily: SERIF, fontSize: "20px" }}>
            {tooltip.group}
          </div>
          <div className="text-sm text-text-2">
            Disparity:{" "}
            <span className="text-iris" style={{ fontFamily: MONO }}>
              {(tooltip.height * 100).toFixed(1)}%
            </span>
          </div>
          <div
            className="text-xs mt-1 uppercase font-medium"
            style={{ color: SEVERITY_COLORS[tooltip.severity], fontFamily: MONO, fontSize: "9px", letterSpacing: "0.1em" }}
          >
            {tooltip.severity} RISK
          </div>
        </div>
      )}

      <Canvas camera={{ position: [10, 8, 10], fov: 45 }} shadows dpr={[1, 2]}>
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[fogColor, 18, 45]} />

        <ambientLight intensity={isDark ? 0.7 : 1.2} />
        <directionalLight position={[10, 20, 10]} intensity={isDark ? 0.6 : 0.8} castShadow />
        <pointLight position={[-10, 10, -10]} color={isDark ? "#444" : "#999"} intensity={0.4} />

        <GroundGrid isDark={isDark} />

        <group position={[0, 0, 0]}>
          {topologyData.map((point: any, i: number) => (
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
          autoRotateSpeed={0.3}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
