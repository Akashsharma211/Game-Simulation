/** Global game configuration constants */

export const GAME_NAME = 'Website Adventure Simulator'

export const MAP = {
  SIZE: 200,
  HALF: 100,
  BOUNDARY_PADDING: 2,
  GROUND_Y: 0,
}

export const PLAYER = {
  SPAWN: { x: 0, y: 1.6, z: 0 },
  HEIGHT: 1.8,
  RADIUS: 0.4,
  WALK_SPEED: 6,
  RUN_SPEED: 12,
  ACCELERATION: 40,
  DECELERATION: 50,
  JUMP_FORCE: 8,
  GRAVITY: 24,
  MOUSE_SENSITIVITY: 0.002,
  CAMERA_DISTANCE: 5,
  CAMERA_HEIGHT: 2,
  MIN_CAMERA_PITCH: -0.4,
  MAX_CAMERA_PITCH: 1.2,
}

export const PORTAL = {
  COUNT: 10,
  INTERACT_RADIUS: 3.5,
  LOADING_DURATION_MS: 2000,
  FLOAT_AMPLITUDE: 0.3,
  FLOAT_SPEED: 1.5,
}

export const AREAS = [
  { id: 'downtown', name: 'Downtown', color: '#3b82f6', bounds: { minX: -20, maxX: 20, minZ: -20, maxZ: 20 } },
  { id: 'residential', name: 'Residential Area', color: '#22c55e', bounds: { minX: 20, maxX: 60, minZ: -40, maxZ: 40 } },
  { id: 'market', name: 'Shopping Market', color: '#f97316', bounds: { minX: -60, maxX: -20, minZ: -40, maxZ: 0 } },
  { id: 'park', name: 'Park', color: '#10b981', bounds: { minX: -60, maxX: -20, minZ: 0, maxZ: 40 } },
  { id: 'industrial', name: 'Industrial Zone', color: '#6b7280', bounds: { minX: 20, maxX: 60, minZ: -80, maxZ: -40 } },
  { id: 'warehouse', name: 'Warehouse District', color: '#78716c', bounds: { minX: -80, maxX: -40, minZ: -80, maxZ: -40 } },
  { id: 'tech', name: 'Technology Hub', color: '#8b5cf6', bounds: { minX: 40, maxX: 80, minZ: 0, maxZ: 40 } },
  { id: 'training', name: 'Training Area', color: '#ef4444', bounds: { minX: -40, maxX: 0, minZ: 40, maxZ: 80 } },
]

export const PORTAL_POSITIONS = [
  { level: 1, x: 0, z: 5, area: 'downtown' },
  { level: 2, x: 40, z: 0, area: 'residential' },
  { level: 3, x: -40, z: -20, area: 'market' },
  { level: 4, x: -40, z: 20, area: 'park' },
  { level: 5, x: 40, z: -60, area: 'industrial' },
  { level: 6, x: -60, z: -60, area: 'warehouse' },
  { level: 7, x: 60, z: 20, area: 'tech' },
  { level: 8, x: -20, z: 60, area: 'training' },
  { level: 9, x: 15, z: -15, area: 'downtown' },
  { level: 10, x: -15, z: 15, area: 'downtown' },
]

export const COLORS = {
  SKY_DAY: '#87CEEB',
  SKY_NIGHT: '#0a0e27',
  FOG_DAY: '#b0c4de',
  FOG_NIGHT: '#0a0e27',
  SUN_DAY: '#fff5e0',
  SUN_NIGHT: '#c4b5fd',
  ROAD: '#2d2d2d',
  ROAD_MARKING: '#fbbf24',
  GRASS: '#2d5a27',
  SIDEWALK: '#9ca3af',
  BUILDING: {
    office: '#64748b',
    apartment: '#94a3b8',
    warehouse: '#78716c',
    skyscraper: '#475569',
    shop: '#f97316',
  },
}

export const LIGHTING = {
  AMBIENT_DAY: 0.4,
  AMBIENT_NIGHT: 0.15,
  SUN_DAY: 1.2,
  SUN_NIGHT: 0.1,
  MOON_NIGHT: 0.3,
}

export const AUDIO = {
  DEFAULT_VOLUME: 0.5,
  FOOTSTEP_INTERVAL_WALK: 400,
  FOOTSTEP_INTERVAL_RUN: 250,
}

export const GRAPHICS = {
  SHADOW_MAP_SIZE_LOW: 1024,
  SHADOW_MAP_SIZE_MEDIUM: 2048,
  SHADOW_MAP_SIZE_HIGH: 4096,
}

export const SAVE_KEYS = {
  PLAYER: 'was_player_data',
  SETTINGS: 'was_settings',
  PROGRESS: 'was_progress',
}

export const API_ENDPOINTS = {
  PLAYER: '/api/player',
  PLAYER_SAVE: '/api/player/save',
  PLAYER_PROGRESS: '/api/player/progress',
  PLAYER_UNLOCK: '/api/player/unlock',
  LEVELS: '/api/levels',
  LEVEL_START: '/api/levels/start',
  LEVEL_COMPLETE: '/api/levels/complete',
}

export const DEFAULT_PLAYER_DATA = {
  name: 'Explorer',
  position: PLAYER.SPAWN,
  rotation: 0,
  unlockedLevels: [1],
  completedLevels: [],
  achievements: [],
  coins: 0,
  xp: 0,
  discoveredPortals: [],
}

export const ACHIEVEMENTS = [
  { id: 'first_portal', name: 'Portal Finder', description: 'Discover your first portal' },
  { id: 'explorer', name: 'City Explorer', description: 'Visit all 8 areas' },
  { id: 'level_starter', name: 'Challenge Accepted', description: 'Start your first level' },
]

export const CONTROLS_HINT = [
  { key: 'W A S D', action: 'Move' },
  { key: 'SHIFT', action: 'Run' },
  { key: 'SPACE', action: 'Jump' },
  { key: 'E', action: 'Interact' },
  { key: 'MOUSE', action: 'Camera' },
  { key: 'ESC', action: 'Pause' },
]
