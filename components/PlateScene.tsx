/* eslint-disable react/no-unknown-property -- react-three-fiber turns three.js
   objects into JSX intrinsics (mesh, ambientLight, position, args, …); the DOM
   property rule doesn't know them. This is the standard R3F + eslint-plugin-react
   arrangement. */
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PresentationControls, Float, ContactShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// A real WebGL plate, built procedurally (no model file to ship). The weekly
// dish photo lies flat, face-up, in the plate well. Loaded as its own lazy
// chunk, so three.js never touches the homepage's critical path.

/** Half cross-section of a dinner plate, revolved around Y by <latheGeometry>. */
function usePlateProfile() {
  return useMemo(() => {
    const p: THREE.Vector2[] = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.92, 0.0),
      new THREE.Vector2(1.04, 0.03),
      new THREE.Vector2(1.14, 0.13),
      new THREE.Vector2(1.48, 0.32),
      new THREE.Vector2(1.55, 0.33),
      new THREE.Vector2(1.24, 0.11),
      new THREE.Vector2(1.06, 0.02),
      new THREE.Vector2(0.96, -0.05),
      new THREE.Vector2(0.5, -0.07),
      new THREE.Vector2(0.0, -0.07),
    ];
    return p;
  }, []);
}

/** The dish photo, lying flat and face-up in the well. A cream backing sits
 *  just beneath so transparent PNGs never show the dark scene through them. */
function Food({ url }: { url: string }) {
  // Set colour space / sharpness in the load callback (not during render) so the
  // texture object isn't mutated mid-render.
  const texture = useTexture(url, (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  });
  return (
    <group>
      {/* cream backing */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.028, 0]}>
        <circleGeometry args={[0.9, 64]} />
        <meshStandardMaterial color="#f2ead6" roughness={0.9} metalness={0} />
      </mesh>
      {/* the photo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <circleGeometry args={[0.86, 64]} />
        <meshStandardMaterial map={texture} roughness={0.6} metalness={0} />
      </mesh>
      {/* thin seat ring so the food reads as sitting in the plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.036, 0]}>
        <torusGeometry args={[0.87, 0.012, 16, 96]} />
        <meshStandardMaterial color="#00000022" roughness={0.8} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function EmptyWell() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <circleGeometry args={[0.9, 64]} />
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
    if (spin.current) spin.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={spin}>
      {/* The ceramic plate */}
      <mesh castShadow receiveShadow>
        <latheGeometry args={[profile, 128]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Raised terracotta accent band on the rim (a torus, so it never
          z-fights with the plate surface underneath). */}
      <mesh position={[0, 0.315, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.32, 0.028, 20, 128]} />
        <meshStandardMaterial color="#c1552f" roughness={0.45} metalness={0.05} />
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
      // Pulled back with a narrower FOV so the whole plate always fits the frame
      // with margin (no edge clipping).
      camera={{ position: [0, 2.2, 5.6], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Warm, appetising lighting — no remote HDRI (keeps it CSP-safe). */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 6, 4]} intensity={1.4} color="#fff6e6" />
      <directionalLight position={[-4, 3, -2]} intensity={0.5} color="#ffd9a8" />
      <pointLight position={[0, 3, 2]} intensity={0.5} color="#ffffff" />

      <PresentationControls
        global
        cursor
        snap
        polar={[-Math.PI / 8, Math.PI / 6]}
        azimuth={[-Math.PI / 3, Math.PI / 3]}
      >
        <Float
          speed={1.3}
          rotationIntensity={0.15}
          floatIntensity={0.4}
          floatingRange={[-0.03, 0.05]}
        >
          {/* Slightly smaller + tilted for a clean 3/4 view within the frame. */}
          <group rotation={[0.32, 0, 0]} scale={0.92}>
            <Plate imageUrl={imageUrl} />
          </group>
        </Float>
      </PresentationControls>

      <ContactShadows
        position={[0, -0.4, 0]}
        opacity={0.38}
        scale={7}
        blur={2.8}
        far={4}
        color="#3a2a1a"
      />
    </Canvas>
  );
}
