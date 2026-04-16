import { useQuery } from '@tanstack/react-query'
import { fetchMeteo } from '@/services/meteoApi'
import { MeteoResponse } from '@/types'

export function useMeteo() {
  return useQuery<MeteoResponse, Error>({
    queryKey: ['meteo', 'arcachon'],
    queryFn: fetchMeteo,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
