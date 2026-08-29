import { useQuery } from '@tanstack/react-query'
import { getRooms, type GetRoomsParams } from './getRooms'

export function useRoomsQuery(params: GetRoomsParams) {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: () => getRooms(params),
    enabled: Boolean(params.officeId),
  })
}
