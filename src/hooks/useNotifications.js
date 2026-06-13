import { useCallback } from 'react'
import { useNotificationStore } from '../store/gameStore'

/** Notification helper hook */
export const useNotifications = () => {
  const addNotification = useNotificationStore((s) => s.addNotification)

  const notify = useCallback((message, type = 'info', duration = 4000) => {
    addNotification(message, type, duration)
  }, [addNotification])

  const notifyAreaEnter = useCallback((areaName) => {
    notify(`Entered ${areaName}`, 'area', 3000)
  }, [notify])

  const notifyPortalFound = useCallback((level) => {
    notify(`Portal Found — Level ${level}`, 'portal', 4000)
  }, [notify])

  const notifyLevelAvailable = useCallback((level) => {
    notify(`Level ${level} Available — Press E`, 'level', 5000)
  }, [notify])

  const notifyLoading = useCallback((level) => {
    notify(`Loading Level ${level}...`, 'loading', 2000)
  }, [notify])

  const notifyDiscovery = useCallback((message) => {
    notify(message, 'discovery', 4000)
  }, [notify])

  return {
    notify,
    notifyAreaEnter,
    notifyPortalFound,
    notifyLevelAvailable,
    notifyLoading,
    notifyDiscovery,
  }
}
