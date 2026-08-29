import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from './getCurrentUser'

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
  })
}
