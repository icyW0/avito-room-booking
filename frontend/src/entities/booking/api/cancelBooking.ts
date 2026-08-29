import { createApiErrorFromResponse } from '../../../shared/api/ApiError'
import { env } from '../../../shared/config/env'

export async function cancelBooking(bookingId: string): Promise<void> {
  const response = await fetch(`${env.apiUrl}/bookings/${bookingId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw await createApiErrorFromResponse(response)
  }
}
