import { useEffect, useRef, useCallback } from 'react'

/** Track keyboard input state */
export const useKeyboard = (enabled = true) => {
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    jump: false,
    interact: false,
    pause: false,
  })

  const interactPressed = useRef(false)

  useEffect(() => {
    if (!enabled) return

    const keyMap = {
      KeyW: 'forward',
      KeyS: 'backward',
      KeyA: 'left',
      KeyD: 'right',
      ShiftLeft: 'run',
      ShiftRight: 'run',
      Space: 'jump',
      KeyE: 'interact',
      Escape: 'pause',
    }

    const onKeyDown = (e) => {
      const action = keyMap[e.code]
      if (!action) return
      e.preventDefault()
      keys.current[action] = true
      if (action === 'interact') interactPressed.current = true
    }

    const onKeyUp = (e) => {
      const action = keyMap[e.code]
      if (!action) return
      keys.current[action] = false
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [enabled])

  const consumeInteract = useCallback(() => {
    if (interactPressed.current) {
      interactPressed.current = false
      return true
    }
    return false
  }, [])

  const consumePause = useCallback(() => {
    if (keys.current.pause) {
      keys.current.pause = false
      return true
    }
    return false
  }, [])

  return { keysRef: keys, consumeInteract, consumePause }
}
