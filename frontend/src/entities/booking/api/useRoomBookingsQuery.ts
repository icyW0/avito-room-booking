import { useQuery } from '@tanstack/react-query'
import { getRoomBookings, type GetRoomBookingsParams } from './getRoomBookings'

export function useRoomBookingsQuery(params: GetRoomBookingsParams) {
  return useQuery({
    queryKey: ['room-bookings', params.roomId, params.from, params.to],

    queryFn: () => getRoomBookings(params),

    enabled: Boolean(params.roomId && params.from && params.to),
  })
}
