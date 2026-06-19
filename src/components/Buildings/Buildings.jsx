import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { CITY_DATA } from '../../utils/cityGenerator'
import { Textures } from '../../utils/TextureGenerator'

const { buildings } = CITY_DATA

export default function Buildings() {
  const meshRef = useRef()
  const roofRef = useRef()
  const windowRef = useRef()
  const boundaryRef = useRef()

  const { buildingData, roofData, windowData, boundaryData } = useMemo(() => {
    const bData = []
    const rData = []
    const wData = []
    const boundData = []

    buildings.forEach((b) => {
      const { x, z, width, depth, height, color, type, isBoundary } = b

      if (isBoundary) {
        boundData.push({ x, y: height / 2, z, width, height, depth })
        return
      }

      bData.push({ x, y: height / 2, z, width, height, depth, color, type })

      if (type === 'skyscraper') {
        rData.push({ x, y: height + 0.5, z, width: width * 0.6, height: 1, depth: depth * 0.6 })
      }

      if (height > 5) {
        wData.push({ x, y: height * 0.6, z: z + depth / 2 + 0.01, width: width * 0.8, height: height * 0.5 })
      }
    })

    return { buildingData: bData, roofData: rData, windowData: wData, boundaryData: boundData }
  }, [])

  useEffect(() => {
    const dummy = new THREE.Object3D()
    const colorObj = new THREE.Color()

    // Main buildings
    if (meshRef.current) {
      buildingData.forEach((b, i) => {
        dummy.position.set(b.x, b.y, b.z)
        dummy.scale.set(b.width, b.height, b.depth)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        
        colorObj.set(b.color)
        meshRef.current.setColorAt(i, colorObj)
      })
      meshRef.current.instanceMatrix.needsUpdate = true
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
    }

    // Roofs
    if (roofRef.current) {
      roofData.forEach((b, i) => {
        dummy.position.set(b.x, b.y, b.z)
        dummy.scale.set(b.width, b.height, b.depth)
        dummy.updateMatrix()
        roofRef.current.setMatrixAt(i, dummy.matrix)
      })
      roofRef.current.instanceMatrix.needsUpdate = true
    }

    // Windows
    if (windowRef.current) {
      windowData.forEach((b, i) => {
        dummy.position.set(b.x, b.y, b.z)
        dummy.scale.set(b.width, b.height, 1)
        dummy.updateMatrix()
        windowRef.current.setMatrixAt(i, dummy.matrix)
      })
      windowRef.current.instanceMatrix.needsUpdate = true
    }

    // Boundaries
    if (boundaryRef.current) {
      boundaryData.forEach((b, i) => {
        dummy.position.set(b.x, b.y, b.z)
        dummy.scale.set(b.width, b.height, b.depth)
        dummy.updateMatrix()
        boundaryRef.current.setMatrixAt(i, dummy.matrix)
      })
      boundaryRef.current.instanceMatrix.needsUpdate = true
    }
  }, [buildingData, roofData, windowData, boundaryData])

  return (
    <group name="buildings">
      {/* Boundaries */}
      {boundaryData.length > 0 && (
        <instancedMesh ref={boundaryRef} args={[null, null, boundaryData.length]} visible={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial transparent opacity={0} />
        </instancedMesh>
      )}

      {/* Buildings */}
      {buildingData.length > 0 && (
        <instancedMesh ref={meshRef} args={[null, null, buildingData.length]} castShadow receiveShadow frustumCulled>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={Textures.concrete} roughness={0.8} metalness={0.1} />
        </instancedMesh>
      )}

      {/* Roofs */}
      {roofData.length > 0 && (
        <instancedMesh ref={roofRef} args={[null, null, roofData.length]} castShadow receiveShadow frustumCulled>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} />
        </instancedMesh>
      )}

      {/* Windows */}
      {windowData.length > 0 && (
        <instancedMesh ref={windowRef} args={[null, null, windowData.length]} frustumCulled>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial map={Textures.windowEmissive} emissiveMap={Textures.windowEmissive} emissive="#ffffff" emissiveIntensity={1.5} transparent opacity={0.9} />
        </instancedMesh>
      )}
    </group>
  )
}
