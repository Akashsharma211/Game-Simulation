import { motion, AnimatePresence } from 'framer-motion'
import { useNotificationStore } from '../../store/gameStore'

const typeColors = {
  info: 'border-cyan-500/50 text-cyan-300',
  area: 'border-green-500/50 text-green-300',
  portal: 'border-purple-500/50 text-purple-300',
  level: 'border-yellow-500/50 text-yellow-300',
  loading: 'border-blue-500/50 text-blue-300',
  discovery: 'border-pink-500/50 text-pink-300',
}

export default function NotificationPanel() {
  const notifications = useNotificationStore((s) => s.notifications)

  return (
    <div className="fixed bottom-24 right-4 w-72 flex flex-col gap-2 z-50 pointer-events-none">
      <AnimatePresence>
        {notifications.slice(-5).map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`game-panel px-4 py-2 text-sm border-l-4 ${typeColors[n.type] || typeColors.info}`}
          >
            {n.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
