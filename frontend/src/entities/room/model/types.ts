export interface RoomFeature {
  code: string
  name: string
}

export interface Office {
  id: string
  name: string
  address: string
  timezone: string
}

export interface Room {
  id: string
  officeId: string
  name: string
  floor: number
  capacity: number
  features: RoomFeature[]
  office: Office
  available?: boolean
}

export interface RoomsResponse {
  items: Room[]
}
