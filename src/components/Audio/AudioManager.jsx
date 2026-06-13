import { useEffect } from 'react'
import { useAudio } from '../../hooks/useAudio'
import { usePlayerStore, useGameStore } from '../../store/gameStore'

/** In-game audio manager - reacts to player actions */
export default function AudioManager() {
  const { playFootstep, playRunStep, playJump, playPortal, startAmbient } = useAudio()
  const animationState = usePlayerStore((s) => s.animationState)
  const nearbyPortal = usePlayerStore((s) => s.nearbyPortal)
  const screen = useGameStore((s) => s.screen)

  useEffect(() => {
    if (screen === 'playing') {
      const cleanup = startAmbient()
      return cleanup
    }
  }, [screen, startAmbient])

  useEffect(() => {
    let interval
    if (screen === 'playing' && (animationState === 'walk' || animationState === 'run')) {
      const ms = animationState === 'run' ? 250 : 400
      interval = setInterval(() => {
        animationState === 'run' ? playRunStep() : playFootstep()
      }, ms)
    }
    return () => clearInterval(interval)
  }, [animationState, screen, playFootstep, playRunStep])

  return null
}
