import { createApiErrorFromResponse } from '../../../shared/api/ApiError'
import { env } from '../../../shared/config/env'
import type { User } from '../model/types'

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${env.apiUrl}/me`)

  if (!response.ok) {
    throw await createApiErrorFromResponse(response)
  }

  return response.json() as Promise<User>
}
