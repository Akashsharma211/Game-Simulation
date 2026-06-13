import { create } from 'zustand'
import { DEFAULT_PLAYER_DATA, PLAYER } from '../utils/constants'

export const useGameStore = create((set) => ({
  screen: 'welcome',
  isLoading: false,
  loadingLevel: null,
  loadingMessage: '',

  setScreen: (screen) => set({ screen }),
  startGame: () => set({ screen: 'loading', isLoading: true }),
  finishLoading: () => set({ screen: 'playing', isLoading: false }),
  pauseGame: () => set({ screen: 'paused' }),
  resumeGame: () => set({ screen: 'playing' }),
  returnToWelcome: () => set({ screen: 'welcome', isLoading: false, loadingLevel: null }),

  startLevelLoading: (level) => {
    set({
      screen: 'loading',
      isLoading: true,
      loadingLevel: level,
      loadingMessage: `Loading Level ${level}...`,
    })

    useNotificationStore.getState().addNotification(`Loading Level ${level}...`, 'loading', 2000)
    if (level < 10) usePlayerStore.getState().unlockLevel(level + 1)

    return new Promise((resolve) => {
      setTimeout(() => {
        set({ screen: 'playing', isLoading: false, loadingLevel: null, loadingMessage: '' })
        useNotificationStore.getState().addNotification(`Returned from Level ${level}`, 'info', 3000)
        resolve()
      }, 2000)
    })
  },
}))

export const usePlayerStore = create((set, get) => ({
  ...DEFAULT_PLAYER_DATA,
  velocity: { x: 0, y: 0, z: 0 },
  isGrounded: true,
  isRunning: false,
  isJumping: false,
  animationState: 'idle',
  cameraYaw: 0,
  cameraPitch: 0.3,
  currentArea: 'Downtown',
  visitedAreas: new Set(['downtown']),
  nearbyPortal: null,
  fps: 60,

  setPosition: (position) => set({ position }),
  setVelocity: (velocity) => set({ velocity }),
  setGrounded: (isGrounded) => set({ isGrounded }),
  setRunning: (isRunning) => set({ isRunning }),
  setJumping: (isJumping) => set({ isJumping }),
  setAnimationState: (animationState) => set({ animationState }),
  setCameraAngles: (cameraYaw, cameraPitch) => set({ cameraYaw, cameraPitch }),
  setCurrentArea: (currentArea) => set({ currentArea }),
  setNearbyPortal: (nearbyPortal) => set({ nearbyPortal }),
  setFps: (fps) => set({ fps }),

  visitArea: (areaId) => {
    const visited = new Set(get().visitedAreas)
    visited.add(areaId)
    set({ visitedAreas: visited })
  },

  discoverPortal: (level) => {
    const discovered = get().discoveredPortals
    if (!discovered.includes(level)) {
      set({ discoveredPortals: [...discovered, level] })
      return true
    }
    return false
  },

  unlockLevel: (level) => {
    const unlocked = get().unlockedLevels
    if (!unlocked.includes(level)) {
      set({ unlockedLevels: [...unlocked, level] })
    }
  },

  completeLevel: (level) => {
    const completed = get().completedLevels
    if (!completed.includes(level)) {
      set({ completedLevels: [...completed, level], xp: get().xp + 100, coins: get().coins + 50 })
    }
  },

  resetPosition: () => set({
    position: { ...PLAYER.SPAWN },
    velocity: { x: 0, y: 0, z: 0 },
    isGrounded: true,
    animationState: 'idle',
  }),

  loadFromSave: (data) => {
    const merged = { ...DEFAULT_PLAYER_DATA, ...data }
    if (data.visitedAreas) merged.visitedAreas = new Set(data.visitedAreas)
    set(merged)
  },

  getSaveData: () => {
    const state = get()
    return {
      name: state.name,
      position: state.position,
      unlockedLevels: state.unlockedLevels,
      completedLevels: state.completedLevels,
      achievements: state.achievements,
      coins: state.coins,
      xp: state.xp,
      discoveredPortals: state.discoveredPortals,
      visitedAreas: Array.from(state.visitedAreas),
    }
  },
}))

export const useSettingsStore = create((set) => ({
  isDayMode: true,
  masterVolume: 0.5,
  sfxVolume: 0.7,
  ambientVolume: 0.4,
  isMuted: false,
  showFPS: true,
  showMinimap: true,
  shadowQuality: 'medium',
  bloomEnabled: true,
  particlesEnabled: true,
  playerName: 'Explorer',

  toggleDayNight: () => set((s) => ({ isDayMode: !s.isDayMode })),
  setMasterVolume: (masterVolume) => set({ masterVolume }),
  setSfxVolume: (sfxVolume) => set({ sfxVolume }),
  setAmbientVolume: (ambientVolume) => set({ ambientVolume }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setShowFPS: (showFPS) => set({ showFPS }),
  setShowMinimap: (showMinimap) => set({ showMinimap }),
  setShadowQuality: (shadowQuality) => set({ shadowQuality }),
  setBloomEnabled: (bloomEnabled) => set({ bloomEnabled }),
  setParticlesEnabled: (particlesEnabled) => set({ particlesEnabled }),
  setPlayerName: (playerName) => set({ playerName }),
}))

export const useNotificationStore = create((set, get) => ({
  notifications: [],

  addNotification: (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    set({ notifications: [...get().notifications, { id, message, type, timestamp: Date.now() }] })
    setTimeout(() => get().removeNotification(id), duration)
  },

  removeNotification: (id) => {
    set({ notifications: get().notifications.filter((n) => n.id !== id) })
  },

  clearAll: () => set({ notifications: [] }),
}))

export const useAudioStore = create((set) => ({
  currentAmbient: null,
  footstepTimer: null,
  setFootstepTimer: (footstepTimer) => set({ footstepTimer }),
}))
