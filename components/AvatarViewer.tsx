import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarViewerProps {
  currentGloss: string | null;
}

// A simple geometric robot that animates based on state
const AvatarModel: React.FC<{ gloss: string | null }> = ({ gloss }) => {
  const group = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current || !leftArm.current || !rightArm.current || !head.current) return;

    const t = state.clock.getElapsedTime();

    // IDLE ANIMATION: Gentle breathing/bobbing
    const breathe = Math.sin(t * 1.5) * 0.05;
    group.current.position.y = -1.5 + breathe;

    if (gloss) {
      // SIGNING ANIMATION: Active, faster movement
      
      // Rotate body slightly side to side
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t * 8) * 0.3, delta * 5);
      
      // Move arms vigorously
      leftArm.current.rotation.x = Math.sin(t * 10) * 0.8;
      rightArm.current.rotation.x = Math.cos(t * 10) * 0.8;
      
      // Head bobbing
      head.current.rotation.x = Math.sin(t * 15) * 0.1;
      head.current.rotation.y = Math.sin(t * 5) * 0.2;

    } else {
      // RETURN TO IDLE: Smooth transition back to neutral
      
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, 0, delta * 2);
      
      // Arms relax
      leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0, delta * 2);
      rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, 0, delta * 2);
      
      // Head stabilizes
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, 0, delta * 2);
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, 0, delta * 2);
    }
  });

  return (
    <group ref={group} dispose={null}>
      {/* Head */}
      <mesh ref={head} position={[0, 1.5, 0]}>
        <boxGeometry args={[0.5, 0.6, 0.5]} />
        <meshStandardMaterial color="#818cf8" /> {/* Indigo-400 */}
      </mesh>
      
      {/* Eyes (Simple Cubes) */}
      <group position={[0, 1.5, 0.25]}>
        <mesh position={[-0.15, 0.1, 0]}>
           <boxGeometry args={[0.1, 0.05, 0.05]} />
           <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.15, 0.1, 0]}>
           <boxGeometry args={[0.1, 0.05, 0.05]} />
           <meshStandardMaterial color="white" />
        </mesh>
      </group>

      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 1.2, 16]} />
        <meshStandardMaterial color="#e0e7ff" /> {/* Indigo-100 */}
      </mesh>

      {/* Shoulders */}
      <mesh position={[0, 1.1, 0]}>
         <boxGeometry args={[1, 0.2, 0.3]} />
         <meshStandardMaterial color="#4f46e5" /> {/* Indigo-600 */}
      </mesh>

      {/* Arms */}
      <mesh ref={leftArm} position={[-0.6, 0.8, 0]}>
         <boxGeometry args={[0.2, 0.8, 0.2]} />
         <meshStandardMaterial color="#818cf8" />
      </mesh>
      
      <mesh ref={rightArm} position={[0.6, 0.8, 0]}>
         <boxGeometry args={[0.2, 0.8, 0.2]} />
         <meshStandardMaterial color="#818cf8" />
      </mesh>
    </group>
  );
};

export const AvatarViewer: React.FC<AvatarViewerProps> = ({ currentGloss }) => {
  return (
    <div className="w-full h-full bg-slate-900/50">
      <Canvas camera={{ position: [0, 0.5, 3.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />
        
        <AvatarModel gloss={currentGloss} />
        <Environment preset="city" />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 1.8}
          minDistance={2}
          maxDistance={5}
        />
        
        {/* Gloss Display Overlay in 3D Space */}
        {currentGloss && (
          <Html position={[0, -1.8, 0]} center zIndexRange={[100, 0]}>
            <div className="flex flex-col items-center">
              <div className="bg-black/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-indigo-500/30 text-white text-center shadow-xl shadow-indigo-900/20 animate-bounce-slight">
                <div className="text-[10px] text-indigo-300 uppercase tracking-[0.2em] mb-1 font-semibold">Translating</div>
                <div className="text-xl font-bold font-mono tracking-wide">{currentGloss}</div>
              </div>
              {/* Connector line visual */}
              <div className="w-px h-8 bg-gradient-to-b from-indigo-500/50 to-transparent"></div>
            </div>
          </Html>
        )}
      </Canvas>
    </div>
  );
};
