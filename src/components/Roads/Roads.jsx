import { memo } from 'react'
import { ROAD_DATA } from '../../utils/cityGenerator'
import { COLORS } from '../../utils/constants'

const RoadSegment = memo(({ road }) => {
  const { x, z, width, depth, horizontal } = road
  return (
    <group position={[x, 0.02, z]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[horizontal ? width : depth, horizontal ? depth : width]} />
        <meshStandardMaterial color={COLORS.ROAD} roughness={0.9} />
      </mesh>
      {/* Center line */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[horizontal ? width : 0.3, horizontal ? 0.3 : depth]} />
        <meshStandardMaterial color={COLORS.ROAD_MARKING} />
      </mesh>
    </group>
  )
})

RoadSegment.displayName = 'RoadSegment'

const TrafficLight = memo(({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 2, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 4, 6]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
    <mesh position={[0, 4.2, 0]}>
      <boxGeometry args={[0.3, 0.8, 0.3]} />
      <meshStandardMaterial color="#1f2937" />
    </mesh>
    <mesh position={[0, 4.5, 0.16]}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
    </mesh>
  </group>
))

TrafficLight.displayName = 'TrafficLight'

export default function Roads() {
  const intersections = [
    [0, 0], [-40, 0], [40, 0], [0, -40], [0, 40],
    [-40, -40], [-40, 40], [40, -40], [40, 40],
  ]

  return (
    <group name="roads">
      {ROAD_DATA.map((road) => (
        <RoadSegment key={road.id} road={road} />
      ))}
      {intersections.map(([x, z], i) => (
        <TrafficLight key={`tl-${i}`} position={[x + 5, 0, z + 5]} />
      ))}
    </group>
  )
}
