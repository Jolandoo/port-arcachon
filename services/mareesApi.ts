import type { Maree, MareeJour, MareeResponse } from '@/types'
import { API } from '@/constants'

const MAREE_API_KEY = process.env.EXPO_PUBLIC_MAREE_API_KEY ?? ''

export async function fetchMarees(): Promise<MareeResponse> {
  if (MAREE_API_KEY) {
    try {
      return await fetchMareeReal()
    } catch {
      // Fallback mock si API échoue
      return generateMockMarees()
    }
  }
  return generateMockMarees()
}

// ── API api-maree.fr ──────────────────────────────────────────────────────────
async function fetchMareeReal(): Promise<MareeResponse> {
  const now   = new Date()
  const from  = toLocalISO(startOfDay(now))
  const to    = toLocalISO(startOfDay(offsetDays(now, 4)))

  const url = `${API.MAREE_BASE}/water-levels?key=${MAREE_API_KEY}&site=${API.MAREE_SITE}&from=${from}&to=${to}&step=10&tz=Europe/Paris`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`api-maree.fr ${res.status}`)

  const data: { data: { time: string; height: number }[] } = await res.json()
  return parseSeries(data.data)
}

// Amplitude vive-eau de référence pour Arcachon (PM ~4.8m - BM ~0.4m)
const AMPLITUDE_REF = 4.4

/** Calcule le coefficient à partir de l'amplitude PM/BM (approx Arcachon) */
function calcCoefficient(hauteurPM: number, hauteurBM: number): number {
  const amplitude = Math.max(0, hauteurPM - hauteurBM)
  const coeff = Math.round((amplitude / AMPLITUDE_REF) * 95)
  return Math.min(120, Math.max(20, coeff))
}

/** Transforme la série continue → hautes/basses mers groupées par jour */
function parseSeries(series: { time: string; height: number }[]): MareeResponse {
  const extrema = findExtrema(series)

  // Calcul des coefficients : pour chaque PM, cherche la BM adjacente la plus proche
  const withCoeff = extrema.map((pt, i) => {
    if (pt.type !== 'haute') return { ...pt, coefficient: undefined }
    // Cherche BM avant
    const bmBefore = [...extrema.slice(0, i)].reverse().find((e) => e.type === 'basse')
    // Cherche BM après
    const bmAfter  = extrema.slice(i + 1).find((e) => e.type === 'basse')
    const bm = bmBefore && bmAfter
      ? (bmBefore.hauteur + bmAfter.hauteur) / 2
      : (bmBefore?.hauteur ?? bmAfter?.hauteur ?? 0.6)
    return { ...pt, coefficient: calcCoefficient(pt.hauteur, bm) }
  })

  const joursMap = new Map<string, Maree[]>()
  for (const pt of withCoeff) {
    const date  = pt.time.substring(0, 10)
    const heure = pt.time.substring(11, 16)
    if (!joursMap.has(date)) joursMap.set(date, [])
    joursMap.get(date)!.push({
      heure,
      hauteur: pt.hauteur,
      type: pt.type,
      ...(pt.coefficient !== undefined && { coefficient: pt.coefficient }),
    })
  }

  return {
    port: 'Arcachon',
    codePort: 'arcachon',
    jours: Array.from(joursMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, marees]) => ({ date, marees })),
  }
}

/** Détecte les maxima/minima locaux dans la série (fenêtre ±6 points = ±1 heure) */
function findExtrema(series: { time: string; height: number }[]): { time: string; hauteur: number; type: 'haute' | 'basse' }[] {
  const W = 6 // 1h chaque côté
  const result: { time: string; hauteur: number; type: 'haute' | 'basse' }[] = []

  for (let i = W; i < series.length - W; i++) {
    const h = series[i].height
    let isMax = true
    let isMin = true

    for (let j = i - W; j <= i + W; j++) {
      if (j === i) continue
      if (series[j].height > h) isMax = false
      if (series[j].height < h) isMin = false
    }

    if (isMax) result.push({ time: series[i].time, hauteur: Math.round(h * 100) / 100, type: 'haute' })
    if (isMin) result.push({ time: series[i].time, hauteur: Math.round(h * 100) / 100, type: 'basse' })
  }

  return result
}

// ── Helpers date ──────────────────────────────────────────────────────────────
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function offsetDays(d: Date, n: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}
function toLocalISO(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00`
}

// ── Mock réaliste (fallback sans clé) ─────────────────────────────────────────
function generateMockMarees(): MareeResponse {
  const jours: MareeJour[] = []
  const now = new Date()
  const CYCLE_MIN = 12 * 60 + 25
  const startOffset = (now.getHours() * 60 + now.getMinutes()) % CYCLE_MIN

  for (let d = 0; d < 4; d++) {
    const date = new Date(now)
    date.setDate(date.getDate() + d)
    const dateStr = date.toISOString().split('T')[0]
    const marees: Maree[] = []

    const timesMin = [
      startOffset + d * 24 * 60,
      startOffset + d * 24 * 60 + CYCLE_MIN,
    ]

    for (const t of timesMin) {
      const hh = (t % (24 * 60)) / 60
      marees.push({
        heure:   formatHHMM(hh),
        hauteur: +(3.8 + Math.random() * 0.8).toFixed(2),
        type:    'haute',
        coefficient: Math.round(60 + Math.random() * 40),
      })
      marees.push({
        heure:   formatHHMM(hh + 6.2),
        hauteur: +(0.5 + Math.random() * 0.4).toFixed(2),
        type:    'basse',
      })
    }

    marees.sort((a, b) => a.heure.localeCompare(b.heure))
    jours.push({ date: dateStr, marees })
  }

  return { port: 'Arcachon', codePort: 'arcachon', jours }
}

function formatHHMM(totalHours: number): string {
  const h = Math.floor(totalHours % 24)
  const m = Math.floor((totalHours % 1) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
