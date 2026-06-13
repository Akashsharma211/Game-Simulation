import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useSettingsStore } from '../../store/gameStore'
import SkyEnvironment from '../../components/Environment/SkyEnvironment'
import Environment from '../../components/Environment/Environment'
import Buildings from '../../components/Buildings/Buildings'
import Roads from '../../components/Roads/Roads'
import { Portals } from '../../components/Portal/LevelPortal'
import AmbientParticles, { DustParticles } from '../../components/Particles/AmbientParticles'
import PlayerController from '../../components/Player/PlayerController'

export default function CityScene() {
  const bloomEnabled = useSettingsStore((s) => s.bloomEnabled)

  return (
    <Canvas
      shadows
      camera={{ position: [0, 5, 10], fov: 60, near: 0.1, far: 500 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <SkyEnvironment />
        <Environment />
        <Roads />
        <Buildings />
        <Portals />
        <AmbientParticles />
        <DustParticles />
        <PlayerController />

        {bloomEnabled && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.4} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  )
}
