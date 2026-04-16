import { useQuery } from '@tanstack/react-query'
import { fetchActualites } from '@/services/portApi'
import { ActualiteResponse } from '@/types'

export function useActualites(page = 1) {
  return useQuery<ActualiteResponse, Error>({
    queryKey: ['actualites', page],
    queryFn: () => fetchActualites(page),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}
