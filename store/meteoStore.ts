import { create } from 'zustand'
import { AlerteMeteo } from '@/types'

interface MeteoState {
  alertes: AlerteMeteo[]
  addAlerte: (alerte: AlerteMeteo) => void
  removeAlerte: (id: string) => void
  clearAlertes: () => void
}

export const useMeteoStore = create<MeteoState>((set) => ({
  alertes: [],
  addAlerte: (alerte) =>
    set((state) => ({ alertes: [...state.alertes, alerte] })),
  removeAlerte: (id) =>
    set((state) => ({ alertes: state.alertes.filter((a) => a.id !== id) })),
  clearAlertes: () => set({ alertes: [] }),
}))
