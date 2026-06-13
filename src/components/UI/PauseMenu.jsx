import { motion } from 'framer-motion'
import { useSettingsStore } from '../../store/gameStore'

export default function PauseMenu({ onResume, onSettings, onRestart, onQuit }) {
  const toggleDayNight = useSettingsStore((s) => s.toggleDayNight)
  const isDayMode = useSettingsStore((s) => s.isDayMode)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="game-panel p-8 text-center min-w-[300px]"
      >
        <h2 className="text-3xl font-bold text-cyan-400 mb-8 glow-text">Paused</h2>

        <div className="flex flex-col gap-3">
          <button onClick={onResume} className="py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90">
            Resume
          </button>
          <button onClick={onRestart} className="py-3 game-panel text-yellow-400 font-bold rounded-xl hover:bg-gray-800">
            Restart Position
          </button>
          <button onClick={toggleDayNight} className="py-3 game-panel text-indigo-400 font-bold rounded-xl hover:bg-gray-800">
            {isDayMode ? '🌙 Switch to Night' : '☀️ Switch to Day'}
          </button>
          <button onClick={onSettings} className="py-3 game-panel text-purple-400 font-bold rounded-xl hover:bg-gray-800">
            Settings
          </button>
          <button onClick={onQuit} className="py-3 game-panel text-red-400 font-bold rounded-xl hover:bg-gray-800">
            Quit to Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
