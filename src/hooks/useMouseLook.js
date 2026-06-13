import { useEffect, useRef } from 'react'
import { PLAYER } from '../utils/constants'

/** Mouse look for third-person camera */
export const useMouseLook = (enabled = true, onMove) => {
  const isLocked = useRef(false)
  const yaw = useRef(0)
  const pitch = useRef(0.3)

  useEffect(() => {
    if (!enabled) return

    const onMouseMove = (e) => {
      if (!isLocked.current) return
      yaw.current -= e.movementX * PLAYER.MOUSE_SENSITIVITY
      pitch.current = Math.max(
        PLAYER.MIN_CAMERA_PITCH,
        Math.min(PLAYER.MAX_CAMERA_PITCH, pitch.current - e.movementY * PLAYER.MOUSE_SENSITIVITY),
      )
      onMove?.(yaw.current, pitch.current)
    }

    const onClick = () => {
      if (!isLocked.current) {
        document.body.requestPointerLock?.()
      }
    }

    const onLockChange = () => {
      isLocked.current = document.pointerLockElement === document.body
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick)
    document.addEventListener('pointerlockchange', onLockChange)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick)
      document.removeEventListener('pointerlockchange', onLockChange)
      document.exitPointerLock?.()
    }
  }, [enabled, onMove])

  return { yaw, pitch, isLocked }
}
