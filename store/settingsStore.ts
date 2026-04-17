import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type WindUnit = 'kt' | 'kmh' | 'mph' | 'ms'
export type TempUnit = 'C' | 'F'
export type WaveUnit = 'm' | 'ft'

interface SettingsState {
  notifMeteo:    boolean
  notifMarees:   boolean
  notifActus:    boolean
  notifUrgences: boolean
  windUnit:      WindUnit
  tempUnit:      TempUnit
  waveUnit:      WaveUnit
  setNotifMeteo:    (v: boolean)   => void
  setNotifMarees:   (v: boolean)   => void
  setNotifActus:    (v: boolean)   => void
  setNotifUrgences: (v: boolean)   => void
  setWindUnit:      (v: WindUnit)  => void
  setTempUnit:      (v: TempUnit)  => void
  setWaveUnit:      (v: WaveUnit)  => void
  reset: () => void
}

const DEFAULTS = {
  notifMeteo:    true,
  notifMarees:   true,
  notifActus:    false,
  notifUrgences: true,
  windUnit:      'kt' as WindUnit,
  tempUnit:      'C'  as TempUnit,
  waveUnit:      'm'  as WaveUnit,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setNotifMeteo:    (v) => set({ notifMeteo: v }),
      setNotifMarees:   (v) => set({ notifMarees: v }),
      setNotifActus:    (v) => set({ notifActus: v }),
      setNotifUrgences: (v) => set({ notifUrgences: v }),
      setWindUnit:      (v) => set({ windUnit: v }),
      setTempUnit:      (v) => set({ tempUnit: v }),
      setWaveUnit:      (v) => set({ waveUnit: v }),
      reset: () => set(DEFAULTS),
    }),
    {
      name:    'port-arcachon-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)

// ── Helpers conversions ───────────────────────────────────────────────────────
export function formatWind(kt: number, unit: WindUnit): string {
  switch (unit) {
    case 'kt':  return `${Math.round(kt)} kt`
    case 'kmh': return `${Math.round(kt * 1.852)} km/h`
    case 'mph': return `${Math.round(kt * 1.151)} mph`
    case 'ms':  return `${(kt * 0.5144).toFixed(1)} m/s`
  }
}

export function formatTemp(celsius: number, unit: TempUnit): string {
  if (unit === 'F') return `${Math.round(celsius * 9 / 5 + 32)}°F`
  return `${Math.round(celsius)}°C`
}

export function formatWave(m: number, unit: WaveUnit): string {
  if (unit === 'ft') return `${(m * 3.281).toFixed(1)} ft`
  return `${m.toFixed(1)} m`
}
