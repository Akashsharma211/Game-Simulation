import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { usePlayerStore } from '../../store/gameStore'

/** Low-poly third-person character with animation states */
export default function Character() {
  const groupRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  
  // Get animation state dynamically
  const animationState = usePlayerStore((s) => s.animationState)
  const time = useRef(0)

  useFrame((_, delta) => {
    time.current += delta
    const t = time.current

    const walkSpeed = animationState === 'run' ? 12 : 6
    const swing = animationState === 'idle' ? 0 : Math.sin(t * walkSpeed) * 0.4
    const jumpOffset = animationState === 'jump' ? 0.2 : 0

    if (leftLegRef.current) leftLegRef.current.rotation.x = swing
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing
    if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.6
    if (rightArmRef.current) rightArmRef.current.rotation.x = swing * 0.6

    if (groupRef.current) {
      groupRef.current.position.y = jumpOffset
    }
  })

  const bodyColor = '#3b82f6'
  const skinColor = '#fcd9b6'
  const pantsColor = '#1e293b'
  const backpackColor = '#64748b'

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.3]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Backpack */}
      <mesh castShadow receiveShadow position={[0, 1.0, -0.2]}>
        <boxGeometry args={[0.4, 0.5, 0.15]} />
        <meshStandardMaterial color={backpackColor} roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh castShadow receiveShadow position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} />
      </mesh>
      
      {/* Visor/Glasses */}
      <mesh castShadow position={[0, 1.48, 0.18]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.12, 0.35, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[0.18, 0.5, 0.18]} />
          <meshStandardMaterial color={pantsColor} roughness={0.9} />
        </mesh>
      </group>
      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.12, 0.35, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[0.18, 0.5, 0.18]} />
          <meshStandardMaterial color={pantsColor} roughness={0.9} />
        </mesh>
      </group>
      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.35, 1.0, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
          <boxGeometry args={[0.14, 0.4, 0.14]} />
          <meshStandardMaterial color={bodyColor} roughness={0.6} />
        </mesh>
      </group>
      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.35, 1.0, 0]}>
        <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
          <boxGeometry args={[0.14, 0.4, 0.14]} />
          <meshStandardMaterial color={bodyColor} roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}
