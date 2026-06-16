import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { easing } from 'maath'
import { PLAYER, PORTAL } from '../../utils/constants'
import { CITY_DATA } from '../../utils/cityGenerator'
import {
  clampToMapBounds,
  checkBuildingCollision,
  resolveBuildingCollision,
  getMoveDirection,
  getAreaAtPosition,
  isInPortalRange,
  lerp,
} from '../../utils/helpers'
import { PORTAL_POSITIONS } from '../../utils/constants'
import { usePlayerStore, useGameStore, useSettingsStore, useNotificationStore } from '../../store/gameStore'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useMouseLook } from '../../hooks/useMouseLook'
import { useFPS } from '../../hooks/useFPS'
import Character from './Character'

const { buildings } = CITY_DATA

export default function PlayerController() {
  const groupRef = useRef()
  const velocityRef = useRef({ x: 0, y: 0, z: 0 })
  const yawRef = useRef(0)
  const pitchRef = useRef(0.3)
  const footstepTimer = useRef(0)
  const lastArea = useRef('')
  
  // Create a separate position vector for camera targeting to decouple from character
  const cameraTarget = useMemo(() => new THREE.Vector3(), [])

  const { camera } = useThree()
  
  // We only subscribe to screen
  const screen = useGameStore((s) => s.screen)
  const startLevelLoading = useGameStore((s) => s.startLevelLoading)
  const pauseGame = useGameStore((s) => s.pauseGame)

  // Actions
  const setPosition = usePlayerStore((s) => s.setPosition)
  const setVelocity = usePlayerStore((s) => s.setVelocity)
  const setGrounded = usePlayerStore((s) => s.setGrounded)
  const setRunning = usePlayerStore((s) => s.setRunning)
  const setAnimationState = usePlayerStore((s) => s.setAnimationState)
  const setCameraAngles = usePlayerStore((s) => s.setCameraAngles)
  const setCurrentArea = usePlayerStore((s) => s.setCurrentArea)
  const setNearbyPortal = usePlayerStore((s) => s.setNearbyPortal)
  const setFps = usePlayerStore((s) => s.setFps)
  const visitArea = usePlayerStore((s) => s.visitArea)
  const discoverPortal = usePlayerStore((s) => s.discoverPortal)

  const enabled = screen === 'playing'
  const { keysRef, consumeInteract, consumePause } = useKeyboard(enabled)

  useMouseLook(enabled, (yaw, pitch) => {
    yawRef.current = yaw
    pitchRef.current = pitch
    setCameraAngles(yaw, pitch)
  })

  useFPS(setFps)

  useEffect(() => {
    const state = usePlayerStore.getState()
    if (groupRef.current) {
      groupRef.current.position.set(state.position.x, state.position.y, state.position.z)
    }
  }, [])

  useFrame((state, delta) => {
    if (!enabled || !groupRef.current) return

    if (consumePause()) {
      pauseGame()
      document.exitPointerLock?.()
      return
    }

    const dt = Math.min(delta, 0.05)
    const vel = velocityRef.current
    const pos = groupRef.current.position

    const forward = new THREE.Vector3(Math.sin(yawRef.current), 0, Math.cos(yawRef.current))
    const right = new THREE.Vector3(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current))

    const keys = keysRef.current
    const moveDir = getMoveDirection(forward, right, keys)
    const isMoving = moveDir.magnitude > 0
    const isRunning = keys.run && isMoving
    const targetSpeed = isRunning ? PLAYER.RUN_SPEED : PLAYER.WALK_SPEED

    if (isMoving) {
      // Improved acceleration curve
      vel.x = lerp(vel.x, moveDir.x * targetSpeed, PLAYER.ACCELERATION * dt)
      vel.z = lerp(vel.z, moveDir.z * targetSpeed, PLAYER.ACCELERATION * dt)
    } else {
      // Improved deceleration curve
      vel.x = lerp(vel.x, 0, PLAYER.DECELERATION * dt * 1.5)
      vel.z = lerp(vel.z, 0, PLAYER.DECELERATION * dt * 1.5)
    }

    let grounded = pos.y <= PLAYER.SPAWN.y + 0.01
    if (keys.jump && grounded) {
      vel.y = PLAYER.JUMP_FORCE
      grounded = false
    }

    if (!grounded) {
      vel.y -= PLAYER.GRAVITY * dt
    } else if (vel.y < 0) {
      vel.y = 0
      pos.y = PLAYER.SPAWN.y
    }

    let newX = pos.x + vel.x * dt
    let newZ = pos.z + vel.z * dt
    let newY = pos.y + vel.y * dt

    for (const building of buildings) {
      if (checkBuildingCollision(newX, newZ, PLAYER.RADIUS, building)) {
        const resolved = resolveBuildingCollision(newX, newZ, PLAYER.RADIUS, building)
        newX = resolved.x
        newZ = resolved.z
        vel.x *= 0.1
        vel.z *= 0.1
      }
    }

    const bounded = clampToMapBounds(newX, newZ)
    newX = bounded.x
    newZ = bounded.z

    pos.set(newX, Math.max(PLAYER.SPAWN.y, newY), newZ)

    if (isMoving) {
      const targetAngle = Math.atan2(moveDir.x, moveDir.z)
      easing.dampE(groupRef.current.rotation, [0, targetAngle, 0], 0.1, dt)
    }

    // AAA Third Person Camera
    const camDist = PLAYER.CAMERA_DISTANCE
    const camHeight = PLAYER.CAMERA_HEIGHT
    
    // Desired camera position
    const idealCamX = pos.x - Math.sin(yawRef.current) * Math.cos(pitchRef.current) * camDist
    const idealCamY = pos.y + camHeight + Math.sin(pitchRef.current) * camDist * 0.5
    const idealCamZ = pos.z - Math.cos(yawRef.current) * Math.cos(pitchRef.current) * camDist
    
    // Smooth camera target
    cameraTarget.lerp(new THREE.Vector3(pos.x, pos.y + 1, pos.z), 12 * dt)

    easing.damp3(camera.position, [idealCamX, idealCamY, idealCamZ], 0.15, dt)
    camera.lookAt(cameraTarget)

    const pState = usePlayerStore.getState()
    let newAnimState = 'idle'
    if (!grounded) newAnimState = 'jump'
    else if (isRunning) newAnimState = 'run'
    else if (isMoving) newAnimState = 'walk'

    if (pState.animationState !== newAnimState) setAnimationState(newAnimState)
    if (pState.isRunning !== isRunning) setRunning(isRunning)
    if (pState.isGrounded !== grounded) setGrounded(grounded)
    
    // Optimization: only update position occasionally or via ref directly if possible
    // But since minimap reads it, we still dispatch
    setVelocity({ ...vel })
    setPosition({ x: pos.x, y: pos.y, z: pos.z })

    const area = getAreaAtPosition(pos.x, pos.z)
    if (pState.currentArea !== area.name) setCurrentArea(area.name)
    if (area.id !== lastArea.current) {
      lastArea.current = area.id
      if (area.id !== 'outskirts') visitArea(area.id)
    }

    let nearestPortal = null
    let nearestDist = Infinity
    for (const portal of PORTAL_POSITIONS) {
      const dist = Math.sqrt((pos.x - portal.x) ** 2 + (pos.z - portal.z) ** 2)
      if (dist < PORTAL.INTERACT_RADIUS && dist < nearestDist) {
        nearestDist = dist
        nearestPortal = portal
      }
    }

    if (pState.nearbyPortal?.level !== nearestPortal?.level) setNearbyPortal(nearestPortal)

    if (nearestPortal) {
      if (discoverPortal(nearestPortal.level)) {
        useNotificationStore.getState().addNotification(`Portal Found — Level ${nearestPortal.level}`, 'portal', 4000)
      }
      if (consumeInteract()) {
        startLevelLoading(nearestPortal.level)
      }
    }

    if (isMoving && grounded) {
      footstepTimer.current += dt * 1000
    } else {
      footstepTimer.current = 0
    }
  })

  return (
    <group ref={groupRef}>
      <Character />
    </group>
  )
}
