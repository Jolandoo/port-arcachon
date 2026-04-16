export type CategorieActualite = 'capitainerie' | 'travaux' | 'evenement' | 'securite' | 'general'

export interface Actualite {
  id: string
  titre: string
  resume: string
  contenu?: string
  categorie: CategorieActualite
  datePublication: string
  imageUrl?: string
  lienExterne?: string
  epingle: boolean
}

export interface ActualiteResponse {
  items: Actualite[]
  total: number
  page: number
}
