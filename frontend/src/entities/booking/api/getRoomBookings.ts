import { createApiErrorFromResponse } from '../../../shared/api/ApiError'
import { env } from '../../../shared/config/env'
import type { BookingsResponse } from '../model/types'

export interface GetRoomBookingsParams {
  roomId: string
  from: string
  to: string
}

export async function getRoomBookings({
  roomId,
  from,
  to,
}: GetRoomBookingsParams): Promise<BookingsResponse> {
  const searchParams = new URLSearchParams({
    from,
    to,
  })

  const response = await fetch(
    `${env.apiUrl}/rooms/${roomId}/bookings?${searchParams.toString()}`,
  )

  if (!response.ok) {
    throw await createApiErrorFromResponse(response)
  }

  return response.json() as Promise<BookingsResponse>
}
