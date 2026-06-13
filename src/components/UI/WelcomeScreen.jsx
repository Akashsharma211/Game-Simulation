import { motion } from 'framer-motion'
import { GAME_NAME } from '../../utils/constants'

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 10 + 10,
}))

export default function WelcomeScreen({ onStart, onSettings, onInstructions }) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Animated city background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#1a1a3e] to-[#0a0e17]">
        {/* City silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 bg-gradient-to-t from-gray-900 to-gray-800"
              style={{
                left: `${i * 5}%`,
                width: `${3 + Math.random() * 4}%`,
                height: `${20 + Math.random() * 40}%`,
                opacity: 0.6 + Math.random() * 0.3,
              }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Floating particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan-400/30"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 glow-text mb-4">
            {GAME_NAME}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 text-lg md:text-xl max-w-lg mx-auto leading-relaxed"
          >
            Explore the city.<br />
            Find level portals.<br />
            Complete website challenges.<br />
            Unlock new areas.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={onStart}
            className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition-transform shadow-lg shadow-cyan-500/30"
          >
            Start Game
          </button>
          <button
            onClick={onSettings}
            className="px-10 py-4 game-panel text-cyan-400 font-bold text-lg rounded-xl hover:scale-105 transition-transform"
          >
            Settings
          </button>
          <button
            onClick={onInstructions}
            className="px-10 py-4 game-panel text-purple-400 font-bold text-lg rounded-xl hover:scale-105 transition-transform"
          >
            Instructions
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-gray-600 text-sm mt-12"
        >
          Press Start to enter the city • WASD to move • E to interact
        </motion.p>
      </div>
    </div>
  )
}
