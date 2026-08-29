export interface Office {
  id: string
  name: string
  address: string
  timezone: string
}

export interface OfficesResponse {
  items: Office[]
}
