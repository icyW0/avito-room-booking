import { useQuery } from '@tanstack/react-query'
import { getMyBookings, type GetMyBookingsParams } from './getMyBookings'

export function useMyBookingsQuery(params: GetMyBookingsParams) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => getMyBookings(params),
  })
}
