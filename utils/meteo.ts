import type { WindCondition } from '@/types'
import { WIND_THRESHOLDS } from '@/constants'

// WMO weather code → label français
export function wmoLabel(code: number): string {
  if (code === 0) return 'Ciel dégagé'
  if (code <= 3) return 'Partiellement nuageux'
  if (code <= 48) return 'Brouillard'
  if (code <= 55) return 'Bruine'
  if (code <= 65) return 'Pluie'
  if (code <= 75) return 'Neige'
  if (code <= 82) return 'Averses'
  if (code <= 86) return 'Averses de neige'
  return 'Orage'
}

// WMO weather code → nom icône Ionicons
export function wmoIcon(code: number): string {
  if (code === 0) return 'sunny'
  if (code <= 2) return 'partly-sunny'
  if (code <= 3) return 'cloudy'
  if (code <= 48) return 'cloud'
  if (code <= 55) return 'rainy'
  if (code <= 65) return 'rainy'
  if (code <= 75) return 'snow'
  if (code <= 82) return 'rainy'
  if (code <= 86) return 'snow'
  return 'thunderstorm'
}

// Degrés → point cardinal
export function degreesToCardinal(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO']
  return dirs[Math.round(deg / 22.5) % 16]
}

// Vitesse vent → condition
export function windCondition(speed: number): WindCondition {
  if (speed < WIND_THRESHOLDS.calm) return 'calm'
  if (speed < WIND_THRESHOLDS.moderate) return 'moderate'
  if (speed < WIND_THRESHOLDS.strong) return 'strong'
  return 'storm'
}

// Condition → couleur
export function conditionColor(condition: WindCondition): string {
  switch (condition) {
    case 'calm':     return '#2E7D32'
    case 'moderate': return '#ED6C02'
    case 'strong':   return '#D32F2F'
    case 'storm':    return '#7B1FA2'
  }
}

// Date ISO → "Lun. 14"
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
  return `${days[date.getDay()]} ${date.getDate()}`
}

// Arrondi 1 décimale
export function round1(n: number): number {
  return Math.round(n * 10) / 10
}
