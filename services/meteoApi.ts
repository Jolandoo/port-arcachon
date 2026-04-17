import { API, METEO_PARAMS, MARINE_PARAMS } from '@/constants'
import { MeteoResponse, MeteoActuelle, MeteoJour } from '@/types'

function buildUrl(base: string, params: Record<string, string | number>): string {
  const query = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  return `${base}?${query}`
}

/** Trouve la hauteur de vague à l'heure courante dans les données horaires marine */
function currentWaveHeight(hourlyTime: string[], waveHeight: (number | null)[]): number | null {
  const now = new Date()
  // Cherche l'index de l'heure la plus proche (arrondi à l'heure)
  const nowHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()).getTime()
  let best = 0
  let bestDiff = Infinity
  hourlyTime.forEach((t, i) => {
    const diff = Math.abs(new Date(t).getTime() - nowHour)
    if (diff < bestDiff) { bestDiff = diff; best = i }
  })
  return waveHeight[best] ?? null
}

export async function fetchMeteo(): Promise<MeteoResponse> {
  const [meteoRes, marineRes] = await Promise.all([
    fetch(buildUrl(API.OPEN_METEO_BASE,   METEO_PARAMS  as unknown as Record<string, string | number>)),
    fetch(buildUrl(API.OPEN_METEO_MARINE, MARINE_PARAMS as unknown as Record<string, string | number>)),
  ])

  if (!meteoRes.ok)  throw new Error(`Erreur Open-Meteo: ${meteoRes.status}`)
  // Marine peut échouer silencieusement (zone sans données)
  const meteoData  = await meteoRes.json()
  const marineData = marineRes.ok ? await marineRes.json() : null

  const actuelle: MeteoActuelle = {
    temperature:   meteoData.current.temperature_2m,
    windSpeed:     meteoData.current.wind_speed_10m,
    windDirection: meteoData.current.wind_direction_10m,
    windGusts:     meteoData.current.wind_gusts_10m,
    weatherCode:   meteoData.current.weather_code,
    timestamp:     meteoData.current.time,
    waveHeight: marineData
      ? currentWaveHeight(marineData.hourly.time, marineData.hourly.wave_height)
      : null,
  }

  const previsions: MeteoJour[] = (meteoData.daily.time as string[]).map(
    (date: string, i: number) => ({
      date,
      weatherCode:    meteoData.daily.weather_code[i],
      temperatureMax: meteoData.daily.temperature_2m_max[i],
      temperatureMin: meteoData.daily.temperature_2m_min[i],
      windSpeedMax:   meteoData.daily.wind_speed_10m_max[i],
      windGustsMax:   meteoData.daily.wind_gusts_10m_max[i],
    })
  )

  return { actuelle, previsions }
}
