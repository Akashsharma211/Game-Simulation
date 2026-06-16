import { memo, useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { CITY_DATA } from '../../utils/cityGenerator'
import { COLORS, MAP } from '../../utils/constants'
import { useSettingsStore } from '../../store/gameStore'

const StreetLight = memo(({ light, isNight }) => (
  <group position={[light.x, 0, light.z]}>
    <mesh castShadow position={[0, 2.5, 0]}>
      <cylinderGeometry args={[0.06, 0.08, 5, 6]} />
      <meshStandardMaterial color="#4b5563" />
    </mesh>
    <mesh position={[0, 5.2, 0]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial
        color={isNight ? '#fef08a' : '#d1d5db'}
        emissive={isNight ? '#fef08a' : '#000000'}
        emissiveIntensity={isNight ? 2 : 0}
      />
    </mesh>
    {isNight && (
      <pointLight position={[0, 5, 0]} intensity={1.5} distance={15} decay={2} color="#fef08a" castShadow />
    )}
  </group>
))

StreetLight.displayName = 'StreetLight'

const Bench = memo(({ bench }) => (
  <group position={[bench.x, 0, bench.z]} rotation={[0, bench.rotation, 0]}>
    <mesh castShadow position={[0, 0.4, 0]}>
      <boxGeometry args={[1.5, 0.1, 0.5]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
    <mesh castShadow position={[-0.6, 0.2, 0]}>
      <boxGeometry args={[0.1, 0.4, 0.4]} />
      <meshStandardMaterial color="#654321" />
    </mesh>
    <mesh castShadow position={[0.6, 0.2, 0]}>
      <boxGeometry args={[0.1, 0.4, 0.4]} />
      <meshStandardMaterial color="#654321" />
    </mesh>
  </group>
))

Bench.displayName = 'Bench'

const Billboard = memo(({ board }) => (
  <group position={[board.x, 0, board.z]} rotation={[0, board.rotation, 0]}>
    <mesh castShadow position={[0, 3, 0]}>
      <cylinderGeometry args={[0.1, 0.15, 6, 6]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
    <mesh castShadow position={[0, 5.5, 0]}>
      <boxGeometry args={[4, 2.5, 0.2]} />
      <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.5} />
    </mesh>
  </group>
))

Billboard.displayName = 'Billboard'

export default function Environment() {
  const isDayMode = useSettingsStore((s) => s.isDayMode)
  
  const treeTrunkRef = useRef()
  const treeCone1Ref = useRef()
  const treeCone2Ref = useRef()

  const treesData = useMemo(() => CITY_DATA.trees, [])

  useEffect(() => {
    const dummy = new THREE.Object3D()
    if (treeTrunkRef.current) {
      treesData.forEach((t, i) => {
        dummy.position.set(t.x, 1.5 * t.scale, t.z)
        dummy.scale.set(t.scale, t.scale, t.scale)
        dummy.updateMatrix()
        treeTrunkRef.current.setMatrixAt(i, dummy.matrix)

        dummy.position.set(t.x, 3.5 * t.scale, t.z)
        dummy.updateMatrix()
        treeCone1Ref.current.setMatrixAt(i, dummy.matrix)

        dummy.position.set(t.x, 4.8 * t.scale, t.z)
        dummy.updateMatrix()
        treeCone2Ref.current.setMatrixAt(i, dummy.matrix)
      })
      treeTrunkRef.current.instanceMatrix.needsUpdate = true
      treeCone1Ref.current.instanceMatrix.needsUpdate = true
      treeCone2Ref.current.instanceMatrix.needsUpdate = true
    }
  }, [treesData])

  return (
    <group name="environment">
      {/* Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[MAP.SIZE, MAP.SIZE]} />
        <meshStandardMaterial color={COLORS.GRASS} roughness={1} metalness={0} />
      </mesh>

      {/* Area zone markers (subtle) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[MAP.HALF - 5, MAP.HALF - 4, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
      </mesh>

      {/* Instanced Trees */}
      {treesData.length > 0 && (
        <group>
          <instancedMesh ref={treeTrunkRef} args={[null, null, treesData.length]} castShadow receiveShadow>
            <cylinderGeometry args={[0.15, 0.2, 3, 6]} />
            <meshStandardMaterial color="#5c4033" roughness={0.9} />
          </instancedMesh>
          <instancedMesh ref={treeCone1Ref} args={[null, null, treesData.length]} castShadow receiveShadow>
            <coneGeometry args={[1.2, 2.5, 8]} />
            <meshStandardMaterial color="#228B22" roughness={0.8} />
          </instancedMesh>
          <instancedMesh ref={treeCone2Ref} args={[null, null, treesData.length]} castShadow receiveShadow>
            <coneGeometry args={[0.9, 2, 8]} />
            <meshStandardMaterial color="#2d8a2d" roughness={0.8} />
          </instancedMesh>
        </group>
      )}

      {CITY_DATA.streetLights.map((l) => (
        <StreetLight key={l.id} light={l} isNight={!isDayMode} />
      ))}
      {CITY_DATA.benches.map((b) => (
        <Bench key={b.id} bench={b} />
      ))}
      {CITY_DATA.billboards.map((b) => (
        <Billboard key={b.id} board={b} />
      ))}

      {/* Parking areas */}
      {[[30, -10], [-30, 30]].map(([x, z], i) => (
        <mesh key={`park-${i}`} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, z]}>
          <planeGeometry args={[15, 10]} />
          <meshStandardMaterial color="#4b5563" roughness={0.9} />
        </mesh>
      ))}

      {/* Water tanks in industrial */}
      {[[50, -55], [55, -65]].map(([x, z], i) => (
        <group key={`tank-${i}`} position={[x, 0, z]}>
          <mesh castShadow position={[0, 3, 0]}>
            <cylinderGeometry args={[2, 2, 6, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Containers */}
      {[[-55, -55], [-65, -60], [-50, -70]].map(([x, z], i) => (
        <mesh key={`container-${i}`} castShadow position={[x, 1.5, z]}>
          <boxGeometry args={[6, 3, 2.5]} />
          <meshStandardMaterial color={['#dc2626', '#2563eb', '#16a34a'][i]} metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}
