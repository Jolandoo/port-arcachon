import type { Maree, MareeJour, MareeResponse } from '@/types'

// SHOM SPM API — nécessite une clé API
// Obtenir une clé : https://services.data.shom.fr/
// Ajouter dans .env : EXPO_PUBLIC_SHOM_API_KEY=votre_cle
const SHOM_API_KEY = process.env.EXPO_PUBLIC_SHOM_API_KEY ?? ''
const SHOM_URL = 'https://services.data.shom.fr/spm/v1/predictions'
const HARBOUR_ID = 'ARCACHON'

export async function fetchMarees(): Promise<MareeResponse> {
  // Si clé API disponible → appel SHOM réel
  if (SHOM_API_KEY) {
    return fetchShomReal()
  }
  // Sinon → données simulées réalistes
  return generateMockMarees()
}

async function fetchShomReal(): Promise<MareeResponse> {
  const params = new URLSearchParams({
    harbourId: HARBOUR_ID,
    duration:  String(4 * 24 * 60),  // 4 jours en minutes
    onlyHLWater: 'true',
  })
  const res = await fetch(`${SHOM_URL}?${params}`, {
    headers: { 'x-api-key': SHOM_API_KEY },
  })
  if (!res.ok) throw new Error(`SHOM ${res.status}`)
  const data = await res.json()
  return parseShomResponse(data)
}

function parseShomResponse(data: Record<string, unknown>): MareeResponse {
  // Format SHOM : { predictions: [{ datetime, height, type }] }
  const predictions = data.predictions as Array<{ datetime: string; height: number; type: 'HIGH' | 'LOW' }>
  const joursMap = new Map<string, Maree[]>()

  for (const p of predictions) {
    const date = p.datetime.split('T')[0]
    const heure = p.datetime.split('T')[1]?.substring(0, 5) ?? '00:00'
    const maree: Maree = {
      heure,
      hauteur: Math.round(p.height * 100) / 100,
      type: p.type === 'HIGH' ? 'haute' : 'basse',
    }
    if (!joursMap.has(date)) joursMap.set(date, [])
    joursMap.get(date)!.push(maree)
  }

  return {
    port: 'Arcachon',
    codePort: '0222A',
    jours: Array.from(joursMap.entries()).map(([date, marees]) => ({ date, marees })),
  }
}

// ── Mock réaliste basé sur les marées semi-diurnes d'Arcachon ──────────────
function generateMockMarees(): MareeResponse {
  const jours: MareeJour[] = []
  const now = new Date()

  // Décalage initial simulant le cycle lunaire (~12h25 entre marées)
  const CYCLE_MIN = 12 * 60 + 25
  const startOffset = (now.getHours() * 60 + now.getMinutes()) % CYCLE_MIN

  for (let d = 0; d < 4; d++) {
    const date = new Date(now)
    date.setDate(date.getDate() + d)
    const dateStr = date.toISOString().split('T')[0]

    const marees: Maree[] = []
    // 2 hautes + 2 basses par jour
    const timesMin = [
      startOffset + d * 24 * 60,
      startOffset + d * 24 * 60 + CYCLE_MIN,
    ]

    for (const t of timesMin) {
      const hh = (t % (24 * 60)) / 60
      const haute: Maree = {
        heure:   formatHHMM(hh),
        hauteur: +(3.8 + Math.random() * 0.8).toFixed(2),
        type:    'haute',
        coefficient: Math.round(60 + Math.random() * 40),
      }
      const basse: Maree = {
        heure:   formatHHMM(hh + 6.2),
        hauteur: +(0.5 + Math.random() * 0.4).toFixed(2),
        type:    'basse',
      }
      marees.push(haute, basse)
    }

    marees.sort((a, b) => a.heure.localeCompare(b.heure))
    jours.push({ date: dateStr, marees })
  }

  return { port: 'Arcachon', codePort: '0222A', jours }
}

function formatHHMM(totalHours: number): string {
  const h = Math.floor(totalHours % 24)
  const m = Math.floor((totalHours % 1) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
