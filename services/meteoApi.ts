import { API, METEO_PARAMS } from '@/constants'
import { MeteoResponse, MeteoActuelle, MeteoJour, HourlyWave } from '@/types'

function buildUrl(params: Record<string, string | number>): string {
  const query = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  return `${API.OPEN_METEO_BASE}?${query}`
}

export async function fetchMeteo(): Promise<MeteoResponse> {
  const url = buildUrl(METEO_PARAMS as unknown as Record<string, string | number>)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Erreur Open-Meteo: ${res.status}`)
  const data = await res.json()

  const actuelle: MeteoActuelle = {
    temperature: data.current.temperature_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    windGusts: data.current.wind_gusts_10m,
    weatherCode: data.current.weather_code,
    timestamp: data.current.time,
  }

  const previsions: MeteoJour[] = (data.daily.time as string[]).map(
    (date: string, i: number) => ({
      date,
      weatherCode: data.daily.weather_code[i],
      temperatureMax: data.daily.temperature_2m_max[i],
      temperatureMin: data.daily.temperature_2m_min[i],
      windSpeedMax: data.daily.wind_speed_10m_max[i],
      windGustsMax: data.daily.wind_gusts_10m_max[i],
    })
  )

  const vagues: HourlyWave = {
    time: data.hourly.time,
    waveHeight: data.hourly.wave_height,
    waveDirection: data.hourly.wave_direction,
  }

  return { actuelle, previsions, vagues }
}
