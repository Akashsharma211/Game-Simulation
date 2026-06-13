import { MAP, PLAYER, AREAS } from './constants'

/** Clamp value between min and max */
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

/** Linear interpolation */
export const lerp = (a, b, t) => a + (b - a) * t

/** Distance between two 2D points */
export const distance2D = (x1, z1, x2, z2) => {
  const dx = x2 - x1
  const dz = z2 - z1
  return Math.sqrt(dx * dx + dz * dz)
}

/** Check AABB collision between player circle and building box */
export const checkBuildingCollision = (px, pz, playerRadius, building) => {
  const { x, z, width, depth } = building
  const halfW = width / 2
  const halfD = depth / 2
  const closestX = clamp(px, x - halfW, x + halfW)
  const closestZ = clamp(pz, z - halfD, z + halfD)
  const dx = px - closestX
  const dz = pz - closestZ
  return dx * dx + dz * dz < playerRadius * playerRadius
}

/** Resolve collision by pushing player out of building */
export const resolveBuildingCollision = (px, pz, playerRadius, building) => {
  const { x, z, width, depth } = building
  const halfW = width / 2 + playerRadius
  const halfD = depth / 2 + playerRadius

  const dx = px - x
  const dz = pz - z

  const overlapX = halfW - Math.abs(dx)
  const overlapZ = halfD - Math.abs(dz)

  if (overlapX <= 0 || overlapZ <= 0) return { x: px, z: pz }

  if (overlapX < overlapZ) {
    return { x: px + (dx > 0 ? overlapX : -overlapX), z: pz }
  }
  return { x: px, z: pz + (dz > 0 ? overlapZ : -overlapZ) }
}

/** Clamp player to map boundaries */
export const clampToMapBounds = (x, z) => ({
  x: clamp(x, -MAP.HALF + MAP.BOUNDARY_PADDING, MAP.HALF - MAP.BOUNDARY_PADDING),
  z: clamp(z, -MAP.HALF + MAP.BOUNDARY_PADDING, MAP.HALF - MAP.BOUNDARY_PADDING),
})

/** Get area name from player position */
export const getAreaAtPosition = (x, z) => {
  for (const area of AREAS) {
    const { minX, maxX, minZ, maxZ } = area.bounds
    if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
      return area
    }
  }
  return { id: 'outskirts', name: 'City Outskirts', color: '#64748b' }
}

/** Format coordinates for HUD display */
export const formatCoords = (x, z) => `X: ${x.toFixed(1)} | Z: ${z.toFixed(1)}`

/** Generate pseudo-random seed-based value */
export const seededRandom = (seed) => {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Debounce function */
export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/** Check if point is inside portal radius */
export const isInPortalRange = (px, pz, portal, radius) =>
  distance2D(px, pz, portal.x, portal.z) <= radius

/** Normalize angle to -PI..PI */
export const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= Math.PI * 2
  while (angle < -Math.PI) angle += Math.PI * 2
  return angle
}

/** Get movement direction from camera yaw */
export const getMoveDirection = (forward, right, keys) => {
  let dx = 0
  let dz = 0
  if (keys.forward) { dx += forward.x; dz += forward.z }
  if (keys.backward) { dx -= forward.x; dz -= forward.z }
  if (keys.left) { dx -= right.x; dz -= right.z }
  if (keys.right) { dx += right.x; dz += right.z }

  const len = Math.sqrt(dx * dx + dz * dz)
  if (len > 0) {
    dx /= len
    dz /= len
  }
  return { x: dx, z: dz, magnitude: len }
}

/** Default spawn position */
export const getSpawnPosition = () => ({ ...PLAYER.SPAWN })
