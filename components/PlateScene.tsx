/* eslint-disable react/no-unknown-property -- react-three-fiber turns three.js
   objects into JSX intrinsics (mesh, ambientLight, position, args, …); the DOM
   property rule doesn't know them. This is the standard R3F + eslint-plugin-react
   arrangement. */
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PresentationControls, Float, ContactShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// A real WebGL plate, built procedurally (no model file to ship). The weekly
// dish photo is mapped onto the food disc sitting in the plate well. Loaded as
// its own lazy chunk, so three.js never touches the homepage's critical path.

/** Half cross-section of a dinner plate, revolved around Y by <latheGeometry>. */
function usePlateProfile() {
  return useMemo(() => {
    const p: THREE.Vector2[] = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.9, 0.0),
      new THREE.Vector2(1.02, 0.02),
      new THREE.Vector2(1.12, 0.12),
      new THREE.Vector2(1.5, 0.34),
      new THREE.Vector2(1.56, 0.34),
      new THREE.Vector2(1.2, 0.1),
      new THREE.Vector2(1.05, 0.02),
      new THREE.Vector2(0.95, -0.04),
      new THREE.Vector2(0.5, -0.06),
      new THREE.Vector2(0.0, -0.06),
    ];
    return p;
  }, []);
}

function Food({ url }: { url: string }) {
  // Set colour space / sharpness in the load callback (not during render) so the
  // texture object isn't mutated mid-render.
  const texture = useTexture(url, (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
      {/* Shallow dome so the food mounds slightly instead of reading as a decal. */}
      <sphereGeometry args={[0.92, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2.35]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0} />
    </mesh>
  );
}

function EmptyWell() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <circleGeometry args={[0.92, 64]} />
      <meshStandardMaterial color="#efe7d6" roughness={0.9} metalness={0} />
    </mesh>
  );
}

function Plate({ imageUrl }: { imageUrl: string | null }) {
  const profile = usePlateProfile();
  const spin = useRef<THREE.Group>(null);

  // Gentle, always-on auto-rotation. Composes with the user's drag from
  // PresentationControls because it lives on an inner group.
  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={spin}>
      {/* The ceramic plate */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[profile, 96]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.28}
          metalness={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Thin terracotta accent ring around the rim */}
      <mesh position={[0, 0.335, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.36, 1.5, 96]} />
        <meshStandardMaterial color="#c1552f" roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {imageUrl ? (
        <Suspense fallback={<EmptyWell />}>
          <Food url={imageUrl} />
        </Suspense>
      ) : (
        <EmptyWell />
      )}
    </group>
  );
}

export default function PlateScene({ imageUrl }: { imageUrl: string | null }) {
  return (
    <Canvas
      camera={{ position: [0, 2.35, 4.3], fov: 34 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Warm, appetising lighting — no remote HDRI (keeps it CSP-safe). */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 6, 4]} intensity={1.5} color="#fff6e6" />
      <directionalLight position={[-4, 3, -2]} intensity={0.5} color="#ffd9a8" />
      <pointLight position={[0, 3, 2]} intensity={0.6} color="#ffffff" />

      <PresentationControls
        global
        cursor
        snap
        polar={[-Math.PI / 8, Math.PI / 6]}
        azimuth={[-Math.PI / 3, Math.PI / 3]}
      >
        <Float
          speed={1.4}
          rotationIntensity={0.2}
          floatIntensity={0.5}
          floatingRange={[-0.05, 0.08]}
        >
          <group rotation={[0.35, 0, 0]} position={[0, 0.1, 0]}>
            <Plate imageUrl={imageUrl} />
          </group>
        </Float>
      </PresentationControls>

      <ContactShadows
        position={[0, -0.35, 0]}
        opacity={0.4}
        scale={6}
        blur={2.6}
        far={4}
        color="#3a2a1a"
      />
    </Canvas>
  );
}
