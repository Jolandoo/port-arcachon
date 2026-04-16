import { ActualiteResponse } from '@/types'

// Squelette actualités port — données mockées en attendant l'API réelle
export async function fetchActualites(page = 1): Promise<ActualiteResponse> {
  // TODO: remplacer par l'appel API du port d'Arcachon en session dédiée
  return {
    items: [],
    total: 0,
    page,
  }
}
