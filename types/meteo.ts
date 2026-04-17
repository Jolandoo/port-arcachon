export type WindCondition = 'calm' | 'moderate' | 'strong' | 'storm'

export interface MeteoActuelle {
  temperature: number
  windSpeed: number
  windDirection: number
  windGusts: number
  weatherCode: number
  timestamp: string
  waveHeight: number | null
}

export interface MeteoJour {
  date: string
  weatherCode: number
  temperatureMax: number
  temperatureMin: number
  windSpeedMax: number
  windGustsMax: number
}

export interface MeteoResponse {
  actuelle: MeteoActuelle
  previsions: MeteoJour[]
}

export interface AlerteMeteo {
  id: string
  type: 'wind' | 'wave' | 'storm'
  severity: 'warning' | 'danger'
  message: string
  timestamp: string
}
