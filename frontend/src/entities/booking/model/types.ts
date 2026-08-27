import type { Office } from '../../office/model/types'
import type { RoomFeature } from '../../room/model/types'

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

export interface BookingOwner {
  id: string
  login: string
  displayName: string
  email: string
  avatarUrl: string | null
  initials: string
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
  owner: BookingOwner
}
