export const PORT_ARCACHON = {
  latitude: 44.6635, longitude: -1.1673,
  latitudeDelta: 0.01, longitudeDelta: 0.01,
} as const

export const API = {
  OPEN_METEO_BASE: 'https://api.open-meteo.com/v1/forecast',
  SHOM_BASE: 'https://services.data.shom.fr/hdm/visu',
  SHOM_PORT_CODE: '0222A',
  PORT_WEBSITE: 'https://www.port-arcachon.fr',
} as const

export const METEO_PARAMS = {
  latitude: PORT_ARCACHON.latitude,
  longitude: PORT_ARCACHON.longitude,
  current: 'temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code',
  hourly: 'wave_height,wave_direction',
  daily: 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_gusts_10m_max',
  wind_speed_unit: 'kn',
  timezone: 'Europe/Paris',
  forecast_days: 7,
} as const

export const WIND_THRESHOLDS = { calm: 10, moderate: 20, strong: 30, storm: 40 } as const

export const CAPITAINERIE = {
  nom:            'Capitainerie d\'Arcachon',
  adresse:        'Quai Goslar, 33120 Arcachon',
  telPlaisanciers:'08 90 71 17 33',  // surtaxé 15 cts €/mn
  telManutention: '05 56 22 36 88',  // manutention + port à sec
  vhf:            'Canal 9',
  email:          'plaisance@port-arcachon.com',
} as const
