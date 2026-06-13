import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Text, Float } from '@react-three/drei'
import { PORTAL, PORTAL_POSITIONS } from '../../utils/constants'
import { useSettingsStore } from '../../store/gameStore'

const PORTAL_COLORS = [
  '#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316',
]

function PortalParticles({ color }) {
  const ref = useRef()
  const count = 30
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 2
      arr[i * 3 + 1] = Math.random() * 3
      arr[i * 3 + 2] = (Math.random() - 0.5) * 2
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.elapsedTime * 0.5
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color={color} transparent opacity={0.7} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  )
}

export default function LevelPortal({ portal }) {
  const color = PORTAL_COLORS[(portal.level - 1) % PORTAL_COLORS.length]
  const particlesEnabled = useSettingsStore((s) => s.particlesEnabled)
  const ringRef = useRef()

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.8
      ringRef.current.material.opacity = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.3
    }
  })

  return (
    <Float speed={PORTAL.FLOAT_SPEED} rotationIntensity={0.2} floatIntensity={PORTAL.FLOAT_AMPLITUDE}>
      <group position={[portal.x, 1.5, portal.z]}>
        {/* Outer ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.08, 8, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.7} />
        </mesh>
        {/* Inner portal surface */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.5, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        {/* Vertical beam */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.05, 0.3, 3, 8, 1, true]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Level label */}
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor={color}
        >
          {`Level ${portal.level}`}
        </Text>
        <pointLight color={color} intensity={1.5} distance={8} />
        {particlesEnabled && <PortalParticles color={color} />}
      </group>
    </Float>
  )
}

export function Portals() {
  return (
    <group name="portals">
      {PORTAL_POSITIONS.map((portal) => (
        <LevelPortal key={portal.level} portal={portal} />
      ))}
    </group>
  )
}
