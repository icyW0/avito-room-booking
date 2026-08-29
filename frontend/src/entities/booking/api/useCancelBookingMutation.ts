import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Booking } from '../model/types'
import { cancelBooking } from './cancelBooking'

export function useCancelBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (booking: Booking) => cancelBooking(booking.id),

    onSuccess: async (_, booking) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['bookings'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['rooms'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['room-bookings', booking.roomId],
        }),
      ])
    },
  })
}
