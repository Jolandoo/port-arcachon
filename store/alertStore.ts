import { create } from 'zustand'

interface AlertPreferences {
  ventActif: boolean
  vagueActif: boolean
  tempeteActif: boolean
  seuilVent: number
  seuilVague: number
}

interface AlertState {
  preferences: AlertPreferences
  updatePreferences: (prefs: Partial<AlertPreferences>) => void
}

const defaultPreferences: AlertPreferences = {
  ventActif: true,
  vagueActif: true,
  tempeteActif: true,
  seuilVent: 20,
  seuilVague: 1.5,
}

export const useAlertStore = create<AlertState>((set) => ({
  preferences: defaultPreferences,
  updatePreferences: (prefs) =>
    set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    })),
}))
