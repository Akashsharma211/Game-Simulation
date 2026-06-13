import { useCallback, useRef } from 'react'
import { useSettingsStore } from '../store/gameStore'

/** Placeholder audio system using Web Audio API oscillators */
export const useAudio = () => {
  const { isMuted, masterVolume, sfxVolume, ambientVolume } = useSettingsStore()
  const ctxRef = useRef(null)

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctxRef.current
  }, [])

  const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.1) => {
    if (isMuted) return
    try {
      const ctx = getContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.value = frequency
      gain.gain.value = volume * masterVolume * sfxVolume
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.stop(ctx.currentTime + duration)
    } catch {
      // Audio not available
    }
  }, [isMuted, masterVolume, sfxVolume, getContext])

  const playFootstep = useCallback(() => playTone(80, 0.05, 'triangle', 0.08), [playTone])
  const playRunStep = useCallback(() => playTone(100, 0.04, 'triangle', 0.1), [playTone])
  const playJump = useCallback(() => playTone(300, 0.15, 'sine', 0.12), [playTone])
  const playPortal = useCallback(() => {
    playTone(440, 0.2, 'sine', 0.15)
    setTimeout(() => playTone(660, 0.3, 'sine', 0.12), 100)
  }, [playTone])
  const playInteract = useCallback(() => playTone(520, 0.1, 'square', 0.1), [playTone])

  const startAmbient = useCallback(() => {
    if (isMuted) return
    // Placeholder ambient - low frequency hum
    try {
      const ctx = getContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 55
      gain.gain.value = 0.02 * masterVolume * ambientVolume
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      return () => { osc.stop(); gain.disconnect() }
    } catch {
      return () => {}
    }
  }, [isMuted, masterVolume, ambientVolume, getContext])

  return { playFootstep, playRunStep, playJump, playPortal, playInteract, startAmbient }
}
