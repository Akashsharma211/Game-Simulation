import { ACHIEVEMENTS } from '../utils/constants'
import { usePlayerStore } from '../store/gameStore'

/** Achievement system placeholder */
export class AchievementTracker {
  constructor() {
    this.definitions = ACHIEVEMENTS
  }

  checkAchievements(playerState) {
    const unlocked = []

    if (playerState.discoveredPortals.length >= 1) {
      unlocked.push('first_portal')
    }
    if (playerState.visitedAreas?.length >= 8) {
      unlocked.push('explorer')
    }
    if (playerState.completedLevels.length >= 1) {
      unlocked.push('level_starter')
    }

    return unlocked.filter((id) => !playerState.achievements.includes(id))
  }

  unlockAchievement(achievementId) {
    const store = usePlayerStore.getState()
    if (!store.achievements.includes(achievementId)) {
      usePlayerStore.setState({
        achievements: [...store.achievements, achievementId],
      })
      const def = this.definitions.find((a) => a.id === achievementId)
      return def
    }
    return null
  }
}

export const achievementTracker = new AchievementTracker()
