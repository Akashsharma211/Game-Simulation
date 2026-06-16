import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, N8AO, ToneMapping, Vignette } from '@react-three/postprocessing'
import { SoftShadows, Environment as DreiEnvironment, BakeShadows } from '@react-three/drei'
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
  const shadowQuality = useSettingsStore((s) => s.shadowQuality)

  return (
    <Canvas
      shadows
      camera={{ position: [0, 5, 10], fov: 60, near: 0.1, far: 500 }}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMappingExposure: 1.2 }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        {/* Soft shadows for AAA feel */}
        {shadowQuality === 'high' || shadowQuality === 'ultra' ? (
          <SoftShadows size={20} samples={16} focus={0.5} />
        ) : shadowQuality === 'medium' ? (
          <SoftShadows size={10} samples={10} focus={0.5} />
        ) : null}

        {/* Global illumination */}
        <DreiEnvironment preset="city" />

        <SkyEnvironment />
        <Environment />
        <Roads />
        <Buildings />
        <Portals />
        <AmbientParticles />
        <DustParticles />
        <PlayerController />

        {/* Post Processing Pipeline */}
        <EffectComposer disableNormalPass>
          <N8AO aoRadius={2} intensity={1} luminanceInfluence={0.6} />
          
          {bloomEnabled && (
            <Bloom 
              luminanceThreshold={1.2} 
              mipmapBlur 
              intensity={0.8} 
              levels={8} 
            />
          )}
          
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
          <ToneMapping adaptive={true} resolution={256} middleGrey={0.6} maxLuminance={16.0} averageLuminance={1.0} adaptationRate={1.0} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
