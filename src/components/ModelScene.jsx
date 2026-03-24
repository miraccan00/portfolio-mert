import { Suspense, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  BakeShadows,
  useProgress,
  Html,
} from '@react-three/drei'
import { useModelLoader, GLBModel } from '../hooks/useModelLoader'
import FallbackModel from './FallbackModel'

/* ---------- Loading indicator (canvas içinde) ---------- */
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{
        color: '#f0ece4',
        fontFamily: "'DM Mono', monospace",
        fontSize: '11px',
        letterSpacing: '0.1em',
        opacity: 0.6,
      }}>
        {Math.round(progress)}%
      </div>
    </Html>
  )
}

/* ---------- Ambient particle ring ---------- */
function ParticleRing({ color }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.08
  })

  const count = 80
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const r = 3.2 + Math.random() * 0.4
    positions[i * 3] = Math.cos(angle) * r
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.6
    positions[i * 3 + 2] = Math.sin(angle) * r
  }

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color={color} transparent opacity={0.35} sizeAttenuation />
    </points>
  )
}

/* ---------- Sahne ---------- */
export default function ModelScene({ model, wireframe, autoRotate }) {
  const glbAvailable = useModelLoader(model.glb)

  return (
    <>
      {/* Ortam aydınlatması — en kolay profesyonel görünüm */}
      <Environment preset="city" />

      {/* Işıklar */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} castShadow />
      <pointLight position={[-4, 3, -4]} intensity={0.6} color={model.accentColor} />
      <pointLight position={[4, -2, 4]} intensity={0.3} color="#ffffff" />

      {/* Parçacık halkası */}
      <ParticleRing color={model.accentColor} />

      {/* Model — GLB varsa gerçek, yoksa fallback */}
      <Suspense fallback={<Loader />}>
        {glbAvailable ? (
          <GLBModel path={model.glb} scale={model.scale} />
        ) : (
          <FallbackModel
            type={model.fallback}
            color={model.accentColor}
            scale={model.scale}
          />
        )}
      </Suspense>

      {/* Zemin gölgesi */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.5}
        scale={8}
        blur={2.5}
        far={4}
        color={model.accentColor}
      />

      {/* Orbit kontrolleri */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2.5}
        maxDistance={8}
        autoRotate={autoRotate}
        autoRotateSpeed={model.autoRotateSpeed}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.1}
      />
    </>
  )
}
