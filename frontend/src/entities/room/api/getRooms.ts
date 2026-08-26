import { env } from '../../../shared/config/env'
import type { Room, RoomsResponse } from '../model/types'

export interface GetRoomsParams {
  officeId: string
  minCapacity?: number
  from?: string
  to?: string
}

export async function getRooms(params: GetRoomsParams): Promise<RoomsResponse> {
  const searchParams = new URLSearchParams({
    officeId: params.officeId,
  })

  if (params.minCapacity !== undefined) {
    searchParams.set('minCapacity', String(params.minCapacity))
  }

  if (params.from && params.to) {
    searchParams.set('from', params.from)
    searchParams.set('to', params.to)
  }

  const response = await fetch(`${env.apiUrl}/rooms?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error(`Не удалось загрузить переговорные: ${response.status}`)
  }

  return response.json() as Promise<RoomsResponse>
}

export async function getRoom(roomId: string):Promise<Room>{
  const response = await fetch(`${env.apiUrl}/rooms/${roomId}`);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить переговорную: ${response.status}`)
  }

  return response.json() as Promise<Room>;
}