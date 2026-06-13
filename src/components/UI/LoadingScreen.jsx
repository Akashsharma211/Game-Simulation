import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'

export default function LoadingScreen({ message }) {
  const loadingLevel = useGameStore((s) => s.loadingLevel)
  const displayMessage = message || (loadingLevel ? `Loading Level ${loadingLevel}...` : 'Loading City...')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#0a0e17]"
    >
      {/* Animated rings */}
      <div className="relative w-32 h-32 mb-8">
        <motion.div
          className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 border-4 border-purple-500/50 rounded-full border-t-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 border-4 border-cyan-400 rounded-full border-b-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🎮</span>
        </div>
      </div>

      <motion.h2
        className="text-2xl font-bold text-white mb-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {displayMessage}
      </motion.h2>

      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mt-4">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-600"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </div>

      <p className="text-gray-500 text-sm mt-4">Please wait...</p>
    </motion.div>
  )
}

/** Initial game loading screen */
export function GameLoadingScreen() {
  return <LoadingScreen message="Entering the City..." />
}
