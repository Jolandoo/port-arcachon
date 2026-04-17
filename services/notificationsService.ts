import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import type { MareeJour } from '@/types'
import { WIND_THRESHOLDS } from '@/constants'

// Expo Go ne supporte pas les push notifications depuis SDK 53
export const IS_EXPO_GO =
  Constants.executionEnvironment === 'storeClient' ||
  (Constants as any).appOwnership === 'expo'

// ── Configuration handler (uniquement hors Expo Go) ───────────────────────────
if (!IS_EXPO_GO) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge:  false,
      shouldShowBanner: true,
      shouldShowList:   true,
    }),
  })
}

// ── Demande de permission ─────────────────────────────────────────────────────
export async function requestNotificationPermission(): Promise<boolean> {
  if (IS_EXPO_GO) return false
  try {
    const { status: existing } = await Notifications.getPermissionsAsync()
    if (existing === 'granted') return true

    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== 'granted') return false

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name:             'Port d\'Arcachon',
        importance:       Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      })
      await Notifications.setNotificationChannelAsync('alertes', {
        name:             'Alertes météo',
        importance:       Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
      })
    }
    return true
  } catch {
    return false
  }
}

// ── Annule toutes les notifs planifiées ───────────────────────────────────────
export async function cancelAllScheduled() {
  if (IS_EXPO_GO) return
  try { await Notifications.cancelAllScheduledNotificationsAsync() } catch {}
}

// ── Notif immédiate alerte météo ──────────────────────────────────────────────
export async function sendWeatherAlert(windSpeed: number) {
  if (IS_EXPO_GO || windSpeed < WIND_THRESHOLDS.strong) return
  try {
    const severity = windSpeed >= WIND_THRESHOLDS.storm ? '⛔ Tempête' : '⚠️ Vent fort'
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${severity} — ${Math.round(windSpeed)} kt`,
        body:  'Vérifiez vos amarrages et consultez la météo complète.',
        data:  { screen: 'meteo' },
        sound: true,
      },
      trigger: null,
    })
  } catch {}
}

// ── Notif marée haute dans 30 min ─────────────────────────────────────────────
export async function scheduleMareeHauteReminder(jours: MareeJour[]) {
  if (IS_EXPO_GO) return
  try {
    await Notifications.cancelAllScheduledNotificationsAsync()
    const now = new Date()
    for (const jour of jours) {
      for (const maree of jour.marees) {
        if (maree.type !== 'haute') continue
        const [hh, mm] = maree.heure.split(':').map(Number)
        const mareeDate = new Date(jour.date)
        mareeDate.setHours(hh, mm, 0, 0)
        const triggerDate = new Date(mareeDate.getTime() - 30 * 60 * 1000)
        if (triggerDate <= now) continue
        const coeff = maree.coefficient ? ` — Coeff. ${maree.coefficient}` : ''
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `🌊 Marée haute dans 30 min`,
            body:  `${maree.heure} — ${maree.hauteur.toFixed(2)} m${coeff}`,
            data:  { screen: 'meteo' },
            sound: true,
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
        })
      }
    }
  } catch {}
}

// ── Notif météo quotidienne 7h ────────────────────────────────────────────────
export async function scheduleDailyForecast() {
  if (IS_EXPO_GO) return
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync()
    for (const n of scheduled) {
      if (n.content.data?.type === 'daily-forecast') {
        await Notifications.cancelScheduledNotificationAsync(n.identifier)
      }
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⛵ Météo du jour — Port d\'Arcachon',
        body:  'Consultez les prévisions et les marées du jour.',
        data:  { screen: 'meteo', type: 'daily-forecast' },
        sound: false,
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 7, minute: 0 },
    })
  } catch {}
}
