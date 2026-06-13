import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
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

  const { camera } = useThree()
  const screen = useGameStore((s) => s.screen)
  const startLevelLoading = useGameStore((s) => s.startLevelLoading)
  const pauseGame = useGameStore((s) => s.pauseGame)

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
  const position = usePlayerStore((s) => s.position)

  const enabled = screen === 'playing'
  const { keysRef, consumeInteract, consumePause } = useKeyboard(enabled)

  useMouseLook(enabled, (yaw, pitch) => {
    yawRef.current = yaw
    pitchRef.current = pitch
    setCameraAngles(yaw, pitch)
  })

  useFPS(setFps)

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(position.x, position.y, position.z)
    }
  }, [])

  useFrame((_, delta) => {
    if (!enabled || !groupRef.current) return

    if (consumePause()) {
      pauseGame()
      document.exitPointerLock?.()
      return
    }

    const dt = Math.min(delta, 0.05)
    const vel = velocityRef.current
    const pos = groupRef.current.position

    // Camera-relative movement vectors
    const forward = new THREE.Vector3(Math.sin(yawRef.current), 0, Math.cos(yawRef.current))
    const right = new THREE.Vector3(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current))

    const keys = keysRef.current
    const moveDir = getMoveDirection(forward, right, keys)
    const isMoving = moveDir.magnitude > 0
    const isRunning = keys.run && isMoving
    const targetSpeed = isRunning ? PLAYER.RUN_SPEED : PLAYER.WALK_SPEED

    // Acceleration / deceleration
    if (isMoving) {
      vel.x = lerp(vel.x, moveDir.x * targetSpeed, PLAYER.ACCELERATION * dt)
      vel.z = lerp(vel.z, moveDir.z * targetSpeed, PLAYER.ACCELERATION * dt)
    } else {
      vel.x = lerp(vel.x, 0, PLAYER.DECELERATION * dt)
      vel.z = lerp(vel.z, 0, PLAYER.DECELERATION * dt)
    }

    // Jump
    let grounded = pos.y <= PLAYER.SPAWN.y + 0.01
    if (keys.jump && grounded) {
      vel.y = PLAYER.JUMP_FORCE
      grounded = false
    }

    // Gravity
    if (!grounded) {
      vel.y -= PLAYER.GRAVITY * dt
    } else if (vel.y < 0) {
      vel.y = 0
      pos.y = PLAYER.SPAWN.y
    }

    // Apply movement
    let newX = pos.x + vel.x * dt
    let newZ = pos.z + vel.z * dt
    let newY = pos.y + vel.y * dt

    // Building collision
    for (const building of buildings) {
      if (checkBuildingCollision(newX, newZ, PLAYER.RADIUS, building)) {
        const resolved = resolveBuildingCollision(newX, newZ, PLAYER.RADIUS, building)
        newX = resolved.x
        newZ = resolved.z
        vel.x *= 0.3
        vel.z *= 0.3
      }
    }

    // Map bounds
    const bounded = clampToMapBounds(newX, newZ)
    newX = bounded.x
    newZ = bounded.z

    pos.set(newX, Math.max(PLAYER.SPAWN.y, newY), newZ)

    // Character rotation toward movement
    if (isMoving) {
      const targetAngle = Math.atan2(moveDir.x, moveDir.z)
      groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, targetAngle, 10 * dt)
    }

    // Camera follow
    const camDist = PLAYER.CAMERA_DISTANCE
    const camHeight = PLAYER.CAMERA_HEIGHT
    const camX = pos.x - Math.sin(yawRef.current) * Math.cos(pitchRef.current) * camDist
    const camY = pos.y + camHeight + Math.sin(pitchRef.current) * camDist * 0.5
    const camZ = pos.z - Math.cos(yawRef.current) * Math.cos(pitchRef.current) * camDist

    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 8 * dt)
    camera.lookAt(pos.x, pos.y + 1, pos.z)

    // Animation state
    if (!grounded) setAnimationState('jump')
    else if (isRunning) setAnimationState('run')
    else if (isMoving) setAnimationState('walk')
    else setAnimationState('idle')

    setRunning(isRunning)
    setGrounded(grounded)
    setVelocity({ ...vel })
    setPosition({ x: pos.x, y: pos.y, z: pos.z })

    // Area detection
    const area = getAreaAtPosition(pos.x, pos.z)
    setCurrentArea(area.name)
    if (area.id !== lastArea.current) {
      lastArea.current = area.id
      if (area.id !== 'outskirts') visitArea(area.id)
    }

    // Portal detection
    let nearestPortal = null
    let nearestDist = Infinity
    for (const portal of PORTAL_POSITIONS) {
      const dist = Math.sqrt((pos.x - portal.x) ** 2 + (pos.z - portal.z) ** 2)
      if (dist < PORTAL.INTERACT_RADIUS && dist < nearestDist) {
        nearestDist = dist
        nearestPortal = portal
      }
    }

    setNearbyPortal(nearestPortal)

    if (nearestPortal) {
      if (discoverPortal(nearestPortal.level)) {
        useNotificationStore.getState().addNotification(`Portal Found — Level ${nearestPortal.level}`, 'portal', 4000)
      }
      if (consumeInteract()) {
        startLevelLoading(nearestPortal.level)
      }
    }

    // Footstep timer placeholder (audio handled in HUD)
    if (isMoving && grounded) {
      footstepTimer.current += dt * 1000
    } else {
      footstepTimer.current = 0
    }
  })

  return (
    <group ref={groupRef} position={[position.x, position.y, position.z]}>
      <Character />
    </group>
  )
}
