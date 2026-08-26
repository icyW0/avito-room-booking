import { useQuery } from '@tanstack/react-query'
import { getOffices } from './getOffices'

export function useOfficesQuery() {
  return useQuery({
    queryKey: ['offices'],
    queryFn: getOffices,
  })
}
