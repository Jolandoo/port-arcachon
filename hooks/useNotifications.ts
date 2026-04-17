import { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import {
  IS_EXPO_GO,
  requestNotificationPermission,
  scheduleMareeHauteReminder,
  scheduleDailyForecast,
  sendWeatherAlert,
  cancelAllScheduled,
} from '@/services/notificationsService'
import { useSettingsStore } from '@/store/settingsStore'
import { useMarees } from '@/hooks/useMarees'
import { useMeteo } from '@/hooks/useMeteo'
import { WIND_THRESHOLDS } from '@/constants'

export function useNotifications() {
  const { notifMarees, notifMeteo, notifUrgences } = useSettingsStore()
  const marees    = useMarees()
  const meteo     = useMeteo()
  const alertSent = useRef(false)

  // Demande permission au premier lancement (no-op en Expo Go)
  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // Navigation depuis tap sur notif (uniquement hors Expo Go)
  useEffect(() => {
    if (IS_EXPO_GO) return
    try {
      const sub = Notifications.addNotificationResponseReceivedListener((response) => {
        const screen = response.notification.request.content.data?.screen
        if (screen === 'meteo') router.push('/(tabs)/meteo')
      })
      return () => sub.remove()
    } catch {}
  }, [])

  // Planifie rappels marées
  useEffect(() => {
    if (!notifMarees || !marees.data) return
    scheduleMareeHauteReminder(marees.data.jours)
  }, [notifMarees, marees.data])

  // Annule rappels marées si désactivé
  useEffect(() => {
    if (!notifMarees) cancelAllScheduled()
  }, [notifMarees])

  // Prévision quotidienne 7h
  useEffect(() => {
    if (notifMeteo) scheduleDailyForecast()
  }, [notifMeteo])

  // Alerte vent fort (une seule fois par session)
  useEffect(() => {
    if (!notifUrgences || !meteo.data || alertSent.current) return
    const { windSpeed } = meteo.data.actuelle
    if (windSpeed >= WIND_THRESHOLDS.strong) {
      alertSent.current = true
      sendWeatherAlert(windSpeed)
    }
  }, [notifUrgences, meteo.data])
}
