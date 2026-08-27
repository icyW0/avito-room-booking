import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBooking } from './createBooking'

export function useCreateBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBooking,

    onSuccess: async (booking) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['rooms'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['room-bookings', booking.roomId],
        }),

        queryClient.invalidateQueries({
          queryKey: ['bookings'],
        }),
      ])
    },
  })
}
