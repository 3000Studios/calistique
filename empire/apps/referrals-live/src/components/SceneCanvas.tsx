import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Orb() {
  const ref = useRef<Mesh>(null);
  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.2;
    ref.current.rotation.y += delta * 0.35;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#22d3ee" emissive="#a855f7" emissiveIntensity={0.4} />
    </mesh>
  );
}

export function SceneCanvas() {
  return (
    <div className="h-64 w-full rounded-2xl border border-cyan-400/40 bg-slate-950/60">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={10} />
        <Stars radius={30} depth={30} count={1000} factor={4} fade speed={1} />
        <Orb />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.8} />
      </Canvas>
    </div>
  );
}
