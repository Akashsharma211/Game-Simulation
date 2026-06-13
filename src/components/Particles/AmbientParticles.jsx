import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSettingsStore } from '../../store/gameStore'

/** Ambient floating particles across the city */
export default function AmbientParticles() {
  const ref = useRef()
  const enabled = useSettingsStore((s) => s.particlesEnabled)
  const count = 200

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 180
      arr[i * 3 + 1] = Math.random() * 20 + 2
      arr[i * 3 + 2] = (Math.random() - 0.5) * 180
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current || !enabled) return
    ref.current.rotation.y = clock.elapsedTime * 0.02
  })

  if (!enabled) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.3} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  )
}

/** Dust particles near ground level */
export function DustParticles() {
  const ref = useRef()
  const enabled = useSettingsStore((s) => s.particlesEnabled)
  const count = 80

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 100
      arr[i * 3 + 1] = Math.random() * 0.5 + 0.1
      arr[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(clock.elapsedTime + i) * 0.001
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  if (!enabled) return null

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#d4a574" transparent opacity={0.2} sizeAttenuation />
    </points>
  )
}
