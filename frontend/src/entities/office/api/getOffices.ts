import { env } from '../../../shared/config/env'
import type { OfficesResponse } from '../model/types'

export async function getOffices(): Promise<OfficesResponse> {
  const response = await fetch(`${env.apiUrl}/offices`)

  if (!response.ok) {
    throw new Error(`Не удалось загрузить офисы: ${response.status}`)
  }

  return response.json() as Promise<OfficesResponse>
}
