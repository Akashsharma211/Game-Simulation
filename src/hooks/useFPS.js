import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

/** Real-time FPS counter */
export const useFPS = (onUpdate) => {
  const frames = useRef(0)
  const lastTime = useRef(performance.now())

  useFrame(() => {
    frames.current += 1
    const now = performance.now()
    if (now - lastTime.current >= 1000) {
      onUpdate?.(frames.current)
      frames.current = 0
      lastTime.current = now
    }
  })
}

/** DOM-based FPS hook for HUD */
export const useFPSCounter = (enabled = true) => {
  const fpsRef = useRef(60)

  useEffect(() => {
    if (!enabled) return
    let frames = 0
    let last = performance.now()
    let raf

    const tick = () => {
      frames += 1
      const now = performance.now()
      if (now - last >= 1000) {
        fpsRef.current = frames
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled])

  return fpsRef
}
