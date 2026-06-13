import { API_ENDPOINTS, SAVE_KEYS, DEFAULT_PLAYER_DATA } from '../utils/constants'

const API_BASE = import.meta.env.VITE_API_URL || ''

/** Placeholder fetch wrapper for future MERN backend */
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    })
    if (!response.ok) throw new Error(`API Error: ${response.status}`)
    return response.json()
  } catch {
    // Return mock data when backend is unavailable
    return null
  }
}

/** GET /api/player */
export const getPlayer = async () => {
  const data = await apiFetch(API_ENDPOINTS.PLAYER)
  if (data) return data

  const saved = localStorage.getItem(SAVE_KEYS.PLAYER)
  return saved ? JSON.parse(saved) : DEFAULT_PLAYER_DATA
}

/** POST /api/player/save */
export const savePlayer = async (playerData) => {
  localStorage.setItem(SAVE_KEYS.PLAYER, JSON.stringify(playerData))

  const result = await apiFetch(API_ENDPOINTS.PLAYER_SAVE, {
    method: 'POST',
    body: JSON.stringify(playerData),
  })
  return result || { success: true, savedLocally: true }
}

/** GET /api/player/progress */
export const getPlayerProgress = async () => {
  const data = await apiFetch(API_ENDPOINTS.PLAYER_PROGRESS)
  if (data) return data

  const saved = localStorage.getItem(SAVE_KEYS.PROGRESS)
  return saved ? JSON.parse(saved) : {
    unlockedLevels: [1],
    completedLevels: [],
    achievements: [],
    coins: 0,
    xp: 0,
  }
}

/** POST /api/player/unlock */
export const unlockLevel = async (levelId) => {
  const result = await apiFetch(API_ENDPOINTS.PLAYER_UNLOCK, {
    method: 'POST',
    body: JSON.stringify({ levelId }),
  })
  return result || { success: true, levelId, savedLocally: true }
}

/** GET /api/levels */
export const getLevels = async () => {
  const data = await apiFetch(API_ENDPOINTS.LEVELS)
  if (data) return data

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Level ${i + 1}`,
    description: `Website challenge level ${i + 1}`,
    unlocked: i === 0,
    completed: false,
    url: `/levels/level-${i + 1}`,
  }))
}

/** POST /api/levels/start */
export const startLevel = async (levelId) => {
  const result = await apiFetch(API_ENDPOINTS.LEVEL_START, {
    method: 'POST',
    body: JSON.stringify({ levelId }),
  })
  return result || { success: true, levelId, startedAt: Date.now() }
}

/** POST /api/levels/complete */
export const completeLevel = async (levelId, score = 100) => {
  const result = await apiFetch(API_ENDPOINTS.LEVEL_COMPLETE, {
    method: 'POST',
    body: JSON.stringify({ levelId, score }),
  })
  return result || { success: true, levelId, score, savedLocally: true }
}

/** Multiplayer placeholder - future architecture */
export const multiplayerService = {
  connect: async () => ({ status: 'placeholder', message: 'Multiplayer coming soon' }),
  disconnect: async () => ({ status: 'disconnected' }),
  syncPosition: async () => ({ status: 'placeholder' }),
  getPlayers: async () => ([]),
}
