import { useQuery } from '@tanstack/react-query'
import { fetchMarees } from '@/services/mareesApi'
import { MareeResponse } from '@/types'

export function useMarees() {
  return useQuery<MareeResponse, Error>({
    queryKey: ['marees', 'arcachon'],
    queryFn: fetchMarees,
    staleTime: 60 * 60 * 1000, // 1 heure
  })
}
