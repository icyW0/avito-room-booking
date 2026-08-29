import { createApiErrorFromResponse } from '../../../shared/api/ApiError'
import { env } from '../../../shared/config/env'
import type { BookingsResponse } from '../model/types'

export type BookingsScope = 'upcoming' | 'past' | 'all'

export interface GetMyBookingsParams {
  scope: BookingsScope
  officeId?: string
}

export async function getMyBookings({
  scope,
  officeId,
}: GetMyBookingsParams): Promise<BookingsResponse> {
  const searchParams = new URLSearchParams({
    scope,
  })

  if (officeId) {
    searchParams.set('officeId', officeId)
  }

  const response = await fetch(
    `${env.apiUrl}/bookings?${searchParams.toString()}`,
  )

  if (!response.ok) {
    throw await createApiErrorFromResponse(response)
  }

  return response.json() as Promise<BookingsResponse>
}
