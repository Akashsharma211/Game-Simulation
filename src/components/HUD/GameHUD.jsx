import { useEffect, useRef } from 'react'
import { usePlayerStore, useSettingsStore, useGameStore } from '../../store/gameStore'
import { formatCoords } from '../../utils/helpers'
import { CONTROLS_HINT } from '../../utils/constants'
import { useNotifications } from '../../hooks/useNotifications'
import MiniMap from '../MiniMap/MiniMap'
import NotificationPanel from './NotificationPanel'

export default function GameHUD() {
  const playerName = useSettingsStore((s) => s.playerName)
  const showFPS = useSettingsStore((s) => s.showFPS)
  const showMinimap = useSettingsStore((s) => s.showMinimap)
  const position = usePlayerStore((s) => s.position)
  const currentArea = usePlayerStore((s) => s.currentArea)
  const fps = usePlayerStore((s) => s.fps)
  const nearbyPortal = usePlayerStore((s) => s.nearbyPortal)
  const discoveredPortals = usePlayerStore((s) => s.discoveredPortals)
  const unlockedLevels = usePlayerStore((s) => s.unlockedLevels)
  const lastArea = useRef('')

  const { notifyAreaEnter, notifyPortalFound, notifyLevelAvailable } = useNotifications()

  useEffect(() => {
    if (currentArea && currentArea !== lastArea.current) {
      if (lastArea.current) notifyAreaEnter(currentArea)
      lastArea.current = currentArea
    }
  }, [currentArea, notifyAreaEnter])

  const lastPortalNotified = useRef(null)

  useEffect(() => {
    if (nearbyPortal && lastPortalNotified.current !== nearbyPortal.level) {
      lastPortalNotified.current = nearbyPortal.level
      notifyLevelAvailable(nearbyPortal.level)
    }
    if (!nearbyPortal) lastPortalNotified.current = null
  }, [nearbyPortal, notifyLevelAvailable])

  const currentLevel = nearbyPortal?.level || unlockedLevels[unlockedLevels.length - 1] || 1

  return (
    <>
      {/* Top Left - Player Info */}
      <div className="fixed top-4 left-4 z-40 pointer-events-none">
        <div className="game-panel px-4 py-3 space-y-1 min-w-[220px]">
          <div className="text-cyan-400 font-bold text-lg glow-text">{playerName}</div>
          <div className="text-gray-400 text-xs">{formatCoords(position.x, position.z)}</div>
          <div className="text-green-400 text-sm">📍 {currentArea}</div>
          <div className="text-purple-400 text-sm">🎯 Level {currentLevel}</div>
          {showFPS && (
            <div className={`text-xs ${fps >= 50 ? 'text-green-500' : fps >= 30 ? 'text-yellow-500' : 'text-red-500'}`}>
              {fps} FPS
            </div>
          )}
          <div className="text-gray-500 text-xs pt-1 border-t border-gray-700">
            Portals: {discoveredPortals.length}/10
          </div>
        </div>
      </div>

      {/* Top Right - Minimap */}
      {showMinimap && (
        <div className="fixed top-4 right-4 z-40">
          <MiniMap />
        </div>
      )}

      {/* Portal Interaction Prompt */}
      {nearbyPortal && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <div className="game-panel px-8 py-4 text-center portal-glow">
            <div className="text-purple-400 text-xl font-bold mb-1">Level Available</div>
            <div className="text-white text-2xl font-bold mb-2">Level {nearbyPortal.level}</div>
            <div className="text-cyan-400 text-lg animate-pulse">Press E To Start</div>
          </div>
        </div>
      )}

      {/* Bottom Center - Controls */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="game-panel px-6 py-3 flex gap-4 flex-wrap justify-center">
          {CONTROLS_HINT.map((c) => (
            <div key={c.key} className="text-center">
              <div className="text-cyan-400 text-xs font-bold bg-gray-800 px-2 py-1 rounded">{c.key}</div>
              <div className="text-gray-400 text-[10px] mt-1">{c.action}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Click to play hint */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 translate-y-16 z-30 pointer-events-none">
        <div className="text-gray-500 text-sm animate-pulse">Click to capture mouse</div>
      </div>

      <NotificationPanel />
    </>
  )
}
