import { motion } from 'framer-motion'
import { useSettingsStore } from '../../store/gameStore'

export default function SettingsMenu({ onClose }) {
  const {
    isDayMode, toggleDayNight, masterVolume, setMasterVolume,
    sfxVolume, setSfxVolume, ambientVolume, setAmbientVolume,
    isMuted, toggleMute, showFPS, setShowFPS, showMinimap, setShowMinimap,
    shadowQuality, setShadowQuality, bloomEnabled, setBloomEnabled,
    particlesEnabled, setParticlesEnabled, playerName, setPlayerName,
  } = useSettingsStore()

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
        className="game-panel p-8 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 glow-text">Settings</h2>

        <div className="space-y-5">
          {/* Player Name */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">Player Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-cyan-500 outline-none"
            />
          </div>

          {/* Day/Night */}
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Day / Night Mode</span>
            <button
              onClick={toggleDayNight}
              className={`px-4 py-2 rounded-lg font-bold ${isDayMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-indigo-500/20 text-indigo-400'}`}
            >
              {isDayMode ? '☀️ Day' : '🌙 Night'}
            </button>
          </div>

          {/* Audio */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300">Audio</span>
              <button onClick={toggleMute} className="text-sm text-cyan-400">{isMuted ? '🔇 Unmute' : '🔊 Mute'}</button>
            </div>
            {[
              { label: 'Master Volume', value: masterVolume, setter: setMasterVolume },
              { label: 'SFX Volume', value: sfxVolume, setter: setSfxVolume },
              { label: 'Ambient Volume', value: ambientVolume, setter: setAmbientVolume },
            ].map(({ label, value, setter }) => (
              <div key={label} className="mb-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{label}</span>
                  <span>{Math.round(value * 100)}%</span>
                </div>
                <input type="range" min="0" max="1" step="0.05" value={value} onChange={(e) => setter(parseFloat(e.target.value))} className="w-full accent-cyan-500" />
              </div>
            ))}
          </div>

          {/* Graphics */}
          <div>
            <span className="text-gray-300 block mb-3">Graphics</span>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Show FPS</span>
                <input type="checkbox" checked={showFPS} onChange={(e) => setShowFPS(e.target.checked)} className="accent-cyan-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Show Minimap</span>
                <input type="checkbox" checked={showMinimap} onChange={(e) => setShowMinimap(e.target.checked)} className="accent-cyan-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Bloom Effect</span>
                <input type="checkbox" checked={bloomEnabled} onChange={(e) => setBloomEnabled(e.target.checked)} className="accent-cyan-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Particles</span>
                <input type="checkbox" checked={particlesEnabled} onChange={(e) => setParticlesEnabled(e.target.checked)} className="accent-cyan-500" />
              </div>
              <div>
                <span className="text-gray-400 text-sm">Shadow Quality</span>
                <select
                  value={shadowQuality}
                  onChange={(e) => setShadowQuality(e.target.value)}
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}
