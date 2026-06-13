import { seededRandom } from './helpers'
import { COLORS, MAP } from './constants'

/** Generate procedural city layout data */
export const generateCityData = () => {
  const buildings = []
  const trees = []
  const streetLights = []
  const benches = []
  const billboards = []
  let seed = 42

  const nextRandom = () => {
    seed += 1
    return seededRandom(seed)
  }

  const zones = [
    { minX: -18, maxX: 18, minZ: -18, maxZ: 18, type: 'skyscraper', count: 8, minH: 15, maxH: 35 },
    { minX: 22, maxX: 58, minZ: -38, maxZ: 38, type: 'apartment', count: 12, minH: 6, maxH: 14 },
    { minX: -58, maxX: -22, minZ: -38, maxZ: -2, type: 'shop', count: 10, minH: 4, maxH: 8 },
    { minX: -58, maxX: -22, minZ: 2, maxZ: 38, type: 'office', count: 6, minH: 3, maxH: 6 },
    { minX: 22, maxX: 58, minZ: -78, maxZ: -42, type: 'warehouse', count: 8, minH: 8, maxH: 12 },
    { minX: -78, maxX: -42, minZ: -78, maxZ: -42, type: 'warehouse', count: 6, minH: 10, maxH: 15 },
    { minX: 42, maxX: 78, minZ: 2, maxZ: 38, type: 'office', count: 8, minH: 10, maxH: 20 },
    { minX: -38, maxX: -2, minZ: 42, maxZ: 78, type: 'office', count: 5, minH: 4, maxH: 8 },
  ]

  zones.forEach((zone) => {
    for (let i = 0; i < zone.count; i++) {
      const x = zone.minX + nextRandom() * (zone.maxX - zone.minX)
      const z = zone.minZ + nextRandom() * (zone.maxZ - zone.minZ)
      const width = 4 + nextRandom() * 8
      const depth = 4 + nextRandom() * 8
      const height = zone.minH + nextRandom() * (zone.maxH - zone.minH)

      buildings.push({
        id: `bld-${buildings.length}`,
        x,
        z,
        width,
        depth,
        height,
        type: zone.type,
        color: COLORS.BUILDING[zone.type] || COLORS.BUILDING.office,
      })
    }
  })

  // Boundary walls (invisible collision)
  buildings.push(
    { id: 'wall-n', x: 0, z: -MAP.HALF + 1, width: MAP.SIZE, depth: 2, height: 10, type: 'fence', color: '#374151', isBoundary: true },
    { id: 'wall-s', x: 0, z: MAP.HALF - 1, width: MAP.SIZE, depth: 2, height: 10, type: 'fence', color: '#374151', isBoundary: true },
    { id: 'wall-e', x: MAP.HALF - 1, z: 0, width: 2, depth: MAP.SIZE, height: 10, type: 'fence', color: '#374151', isBoundary: true },
    { id: 'wall-w', x: -MAP.HALF + 1, z: 0, width: 2, depth: MAP.SIZE, height: 10, type: 'fence', color: '#374151', isBoundary: true },
  )

  // Trees in park and residential
  for (let i = 0; i < 60; i++) {
    seed += 1
    const x = -55 + seededRandom(seed) * 35
    seed += 1
    const z = 5 + seededRandom(seed) * 30
    trees.push({ id: `tree-${i}`, x, z, scale: 0.8 + seededRandom(seed + 1) * 0.6 })
  }

  for (let i = 0; i < 40; i++) {
    seed += 2
    const x = 25 + seededRandom(seed) * 30
    const z = -30 + seededRandom(seed + 1) * 60
    trees.push({ id: `tree-r-${i}`, x, z, scale: 0.7 + seededRandom(seed + 2) * 0.5 })
  }

  // Street lights along main roads
  for (let i = -90; i <= 90; i += 15) {
    streetLights.push({ id: `sl-h-${i}`, x: i, z: 0 })
    streetLights.push({ id: `sl-v-${i}`, x: 0, z: i })
  }

  // Benches in park
  for (let i = 0; i < 8; i++) {
    seed += 3
    benches.push({
      id: `bench-${i}`,
      x: -50 + seededRandom(seed) * 25,
      z: 10 + seededRandom(seed + 1) * 25,
      rotation: seededRandom(seed + 2) * Math.PI * 2,
    })
  }

  // Billboards
  billboards.push({ id: 'bb-1', x: 5, z: -10, rotation: 0, text: 'WAS' })
  billboards.push({ id: 'bb-2', x: -30, z: -15, rotation: Math.PI / 2, text: 'LEVEL UP' })
  billboards.push({ id: 'bb-3', x: 50, z: -50, rotation: -Math.PI / 4, text: 'TRAIN' })

  return { buildings, trees, streetLights, benches, billboards }
}

/** Generate road segments */
export const generateRoads = () => {
  const roads = []
  const roadWidth = 8

  // Main horizontal roads
  ;[-40, 0, 40].forEach((z) => {
    roads.push({ id: `road-h-${z}`, x: 0, z, width: MAP.SIZE - 10, depth: roadWidth, horizontal: true })
  })

  // Main vertical roads
  ;[-40, 0, 40].forEach((x) => {
    roads.push({ id: `road-v-${x}`, x, z: 0, width: roadWidth, depth: MAP.SIZE - 10, horizontal: false })
  })

  return roads
}

export const CITY_DATA = generateCityData()
export const ROAD_DATA = generateRoads()
