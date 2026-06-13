import { Sky, Cloud, Stars } from '@react-three/drei'
import { useSettingsStore } from '../../store/gameStore'
import { COLORS, LIGHTING, MAP } from '../../utils/constants'

export default function SkyEnvironment() {
  const isDayMode = useSettingsStore((s) => s.isDayMode)

  return (
    <>
      <color attach="background" args={[isDayMode ? COLORS.SKY_DAY : COLORS.SKY_NIGHT]} />
      <fog attach="fog" args={[isDayMode ? COLORS.FOG_DAY : COLORS.FOG_NIGHT, 60, MAP.SIZE * 1.2]} />

      {isDayMode ? (
        <>
          <Sky
            distance={450000}
            sunPosition={[80, 40, 50]}
            inclination={0.52}
            azimuth={0.25}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
            rayleigh={0.5}
          />
          <Cloud position={[30, 30, -20]} speed={0.1} opacity={0.4} bounds={[10, 2, 10]} segments={20} />
          <Cloud position={[-40, 35, 30]} speed={0.08} opacity={0.3} bounds={[8, 2, 8]} segments={15} />
          <Cloud position={[0, 40, 50]} speed={0.12} opacity={0.35} bounds={[12, 2, 12]} segments={18} />
        </>
      ) : (
        <Stars radius={300} depth={60} count={3000} factor={4} saturation={0} fade speed={0.5} />
      )}

      <ambientLight intensity={isDayMode ? LIGHTING.AMBIENT_DAY : LIGHTING.AMBIENT_NIGHT} />
      <directionalLight
        castShadow
        position={isDayMode ? [80, 60, 40] : [-40, 30, -20]}
        intensity={isDayMode ? LIGHTING.SUN_DAY : LIGHTING.MOON_NIGHT}
        color={isDayMode ? COLORS.SUN_DAY : COLORS.SUN_NIGHT}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0005}
      />
      {!isDayMode && (
        <directionalLight position={[40, 20, 40]} intensity={LIGHTING.MOON_NIGHT} color="#c4b5fd" />
      )}
    </>
  )
}
