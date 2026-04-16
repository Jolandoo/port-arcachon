export type TypeMaree = 'haute' | 'basse'

export interface Maree {
  heure: string
  hauteur: number
  type: TypeMaree
  coefficient?: number
}

export interface MareeJour {
  date: string
  marees: Maree[]
}

export interface ProchaineMaree extends Maree {
  minutesRestantes: number
  heureExacte: Date
}

export interface MareeResponse {
  port: string
  codePort: string
  jours: MareeJour[]
}
