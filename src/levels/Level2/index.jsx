/** Level placeholder - future website challenge page */
export default function LevelPlaceholder({ level }) {
  return null
}

export const createLevelMeta = (id) => ({
  id,
  name: `Level ${id}`,
  description: `Website challenge level ${id}`,
  challengeType: ['security', 'web', 'network', 'crypto', 'forensics'][id % 5],
})
