import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, MeshWobbleMaterial } from '@react-three/drei'

/**
 * Kendi GLB dosyan gelene kadar bu primitifler gösterilir.
 * Gerçek bir model yüklenince bu bileşen otomatik kaldırılır.
 */
export default function FallbackModel({ type = 'icosahedron', color = '#4a7fe8', scale = 1.4 }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
  })

  const commonProps = {
    ref: meshRef,
    scale,
  }

  const material = (
    <MeshDistortMaterial
      color={color}
      metalness={0.7}
      roughness={0.2}
      distort={0.15}
      speed={2}
      envMapIntensity={1}
    />
  )

  switch (type) {
    case 'torusknot':
      return (
        <mesh {...commonProps}>
          <torusKnotGeometry args={[1, 0.35, 128, 16]} />
          <MeshWobbleMaterial
            color={color}
            metalness={0.6}
            roughness={0.25}
            factor={0.1}
            speed={1.5}
            envMapIntensity={1}
          />
        </mesh>
      )
    case 'box':
      return (
        <mesh {...commonProps}>
          <boxGeometry args={[2, 2, 2]} />
          {material}
        </mesh>
      )
    case 'sphere':
      return (
        <mesh {...commonProps}>
          <sphereGeometry args={[1.2, 64, 64]} />
          {material}
        </mesh>
      )
    case 'cone':
      return (
        <mesh {...commonProps}>
          <coneGeometry args={[1.2, 2.4, 6]} />
          {material}
        </mesh>
      )
    case 'icosahedron':
    default:
      return (
        <mesh {...commonProps}>
          <icosahedronGeometry args={[1.4, 1]} />
          {material}
        </mesh>
      )
  }
}
