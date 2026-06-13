import { memo } from 'react'
import { CITY_DATA } from '../../utils/cityGenerator'

const Building = memo(({ building }) => {
  const { x, z, width, depth, height, color, type, isBoundary } = building

  if (isBoundary) {
    return (
      <mesh position={[x, height / 2, z]} visible={false}>
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    )
  }

  return (
    <group position={[x, 0, z]}>
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={type === 'skyscraper' ? 0.4 : 0.1} />
      </mesh>
      {/* Roof accent for skyscrapers */}
      {type === 'skyscraper' && (
        <mesh castShadow position={[0, height + 0.5, 0]}>
          <boxGeometry args={[width * 0.6, 1, depth * 0.6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} />
        </mesh>
      )}
      {/* Windows */}
      {height > 5 && (
        <mesh position={[0, height * 0.6, depth / 2 + 0.01]}>
          <planeGeometry args={[width * 0.8, height * 0.5]} />
          <meshStandardMaterial color="#1e3a5f" emissive="#334155" emissiveIntensity={0.3} transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  )
})

Building.displayName = 'Building'

export default function Buildings() {
  return (
    <group name="buildings">
      {CITY_DATA.buildings.map((b) => (
        <Building key={b.id} building={b} />
      ))}
    </group>
  )
}
