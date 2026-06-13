import { lazy, Suspense, useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useGameStore, usePlayerStore, useSettingsStore } from '../store/gameStore'
import { savePlayer } from '../services/playerService'
import WelcomeScreen from '../components/UI/WelcomeScreen'
import SettingsMenu from '../components/UI/SettingsMenu'
import InstructionsModal from '../components/UI/InstructionsModal'
import PauseMenu from '../components/UI/PauseMenu'
import LoadingScreen, { GameLoadingScreen } from '../components/UI/LoadingScreen'
import GameHUD from '../components/HUD/GameHUD'
import AudioManager from '../components/Audio/AudioManager'

const CityScene = lazy(() => import('../scenes/CityScene/CityScene'))

export default function GamePage() {
  const screen = useGameStore((s) => s.screen)
  const startGame = useGameStore((s) => s.startGame)
  const finishLoading = useGameStore((s) => s.finishLoading)
  const resumeGame = useGameStore((s) => s.resumeGame)
  const pauseGame = useGameStore((s) => s.pauseGame)
  const returnToWelcome = useGameStore((s) => s.returnToWelcome)
  const resetPosition = usePlayerStore((s) => s.resetPosition)
  const getSaveData = usePlayerStore((s) => s.getSaveData)
  const setPlayerName = useSettingsStore((s) => s.setPlayerName)
  const playerName = useSettingsStore((s) => s.playerName)

  const [showSettings, setShowSettings] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  // Initial game load sequence
  useEffect(() => {
    if (screen === 'loading' && !useGameStore.getState().loadingLevel) {
      const timer = setTimeout(() => finishLoading(), 2500)
      return () => clearTimeout(timer)
    }
  }, [screen, finishLoading])

  const handleStart = () => {
    setPlayerName(playerName)
    startGame()
  }

  const handleQuit = async () => {
    await savePlayer(getSaveData())
    returnToWelcome()
    document.exitPointerLock?.()
  }

  const handleRestart = () => {
    resetPosition()
    resumeGame()
    document.body.requestPointerLock?.()
  }

  return (
    <div className="w-full h-full relative">
      <AnimatePresence>
        {screen === 'welcome' && (
          <WelcomeScreen
            onStart={handleStart}
            onSettings={() => setShowSettings(true)}
            onInstructions={() => setShowInstructions(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {screen === 'loading' && (
          useGameStore.getState().loadingLevel
            ? <LoadingScreen />
            : <GameLoadingScreen />
        )}
      </AnimatePresence>

      {(screen === 'playing' || screen === 'paused') && (
        <Suspense fallback={<GameLoadingScreen />}>
          <div className="absolute inset-0">
            <CityScene />
          </div>
          <GameHUD />
          <AudioManager />
        </Suspense>
      )}

      <AnimatePresence>
        {screen === 'paused' && (
          <PauseMenu
            onResume={() => { resumeGame(); document.body.requestPointerLock?.() }}
            onSettings={() => setShowSettings(true)}
            onRestart={handleRestart}
            onQuit={handleQuit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && <SettingsMenu onClose={() => setShowSettings(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
      </AnimatePresence>
    </div>
  )
}
