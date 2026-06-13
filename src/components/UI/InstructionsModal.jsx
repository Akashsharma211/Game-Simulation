import { motion } from 'framer-motion'
import { CONTROLS_HINT, AREAS, ACHIEVEMENTS } from '../../utils/constants'

export default function InstructionsModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="game-panel p-8 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-purple-400 mb-6 glow-text">Instructions</h2>

        <section className="mb-6">
          <h3 className="text-cyan-400 font-semibold mb-3">Controls</h3>
          <div className="grid grid-cols-2 gap-2">
            {CONTROLS_HINT.map((c) => (
              <div key={c.key} className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
                <span className="text-cyan-400 font-bold text-sm">{c.key}</span>
                <span className="text-gray-400 text-sm">{c.action}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-cyan-400 font-semibold mb-3">How to Play</h3>
          <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
            <li>Click Start Game to enter the city</li>
            <li>Click anywhere to capture your mouse for camera control</li>
            <li>Explore the open world using WASD keys</li>
            <li>Find glowing level portals scattered across the city</li>
            <li>Walk into a portal and press E to start a level</li>
            <li>Complete website challenges to unlock new areas</li>
          </ol>
        </section>

        <section className="mb-6">
          <h3 className="text-cyan-400 font-semibold mb-3">City Areas</h3>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((a) => (
              <span key={a.id} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${a.color}33`, color: a.color }}>
                {a.name}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-cyan-400 font-semibold mb-3">Achievements (Coming Soon)</h3>
          <div className="space-y-2">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.id} className="text-gray-400 text-sm bg-gray-800/30 rounded px-3 py-2">
                <span className="text-yellow-400">🏆 {a.name}</span> — {a.description}
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90"
        >
          Got It!
        </button>
      </motion.div>
    </motion.div>
  )
}
