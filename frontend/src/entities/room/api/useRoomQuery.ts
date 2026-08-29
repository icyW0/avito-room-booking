import { useQuery } from '@tanstack/react-query'
import { getRoom } from './getRooms'
export function useRoomQuery(roomId: string) {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: () => getRoom(roomId),
    enabled: Boolean(roomId),
  })
}
