import { getLevels, startLevel, completeLevel } from './playerService'

export { getLevels, startLevel, completeLevel }

/** Level registry for future level pages */
export const LEVEL_REGISTRY = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Level ${i + 1}`,
  component: null, // Future: lazy-loaded level component
  path: `/levels/level-${i + 1}`,
  challengeType: ['security', 'web', 'network', 'crypto', 'forensics'][i % 5],
}))

/** Get level by ID */
export const getLevelById = (id) => LEVEL_REGISTRY.find((l) => l.id === id)

/** Simulate level entry (returns to city after loading) */
export const enterLevel = async (levelId, onLoadingStart, onLoadingEnd) => {
  onLoadingStart?.(levelId)
  await startLevel(levelId)
  await new Promise((resolve) => setTimeout(resolve, 2000))
  onLoadingEnd?.(levelId)
  return { returnedToCity: true, levelId }
}
