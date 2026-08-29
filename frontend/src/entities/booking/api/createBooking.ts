import { createApiErrorFromResponse } from '../../../shared/api/ApiError'
import { env } from '../../../shared/config/env'
import type { Booking, CreateBookingPayload } from '../model/types'

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<Booking> {
  const response = await fetch(`${env.apiUrl}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw await createApiErrorFromResponse(response)
  }

  return response.json() as Promise<Booking>
}
