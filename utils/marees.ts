import type { Maree, ProchaineMaree, MareeJour } from '@/types'

export function getProchaineMaree(jours: MareeJour[]): ProchaineMaree | null {
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const nowMin = now.getHours() * 60 + now.getMinutes()

  // Cherche dans aujourd'hui + demain
  for (const jour of jours.slice(0, 2)) {
    const isToday = jour.date === todayStr
    for (const maree of jour.marees) {
      const [h, m] = maree.heure.split(':').map(Number)
      const mareeMin = h * 60 + (m ?? 0)
      const diffMin = isToday
        ? mareeMin - nowMin
        : mareeMin + (24 * 60 - nowMin)

      if (diffMin > 0) {
        return {
          ...maree,
          minutesRestantes: diffMin,
          heureExacte: new Date(now),
        }
      }
    }
  }
  return null
}
