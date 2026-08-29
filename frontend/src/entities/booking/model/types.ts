import type { Office } from '../../office/model/types'
import type { RoomFeature } from '../../room/model/types'
import type { User } from '../../user/model/types'

export interface CreateBookingPayload {
  roomId: string
  title: string
  comment?: string | null
  startsAt: string
  endsAt: string
}

export interface BookingRoom {
  id: string
  officeId: string
  name: string
  floor: number
  capacity: number
  features: RoomFeature[]
}

export interface Booking {
  id: string
  roomId: string
  userId: string
  title: string
  comment: string | null
  startsAt: string
  endsAt: string
  createdAt: string
  room: BookingRoom
  office: Office
  owner: User
}

export interface BookingsResponse {
  items: Booking[]
}
