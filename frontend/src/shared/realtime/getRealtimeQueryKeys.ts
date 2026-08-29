type RealtimeQueryKey = readonly unknown[] | null

interface RealtimeEvent {
  type: string
  data: Record<string, unknown>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseRealtimeEvent(payload: string): RealtimeEvent | null {
  try {
    const value: unknown = JSON.parse(payload)

    if (!isRecord(value) || typeof value.type !== 'string' || !isRecord(value.data)) {
      return null
    }

    return {
      type: value.type,
      data: value.data,
    }
  } catch {
    return null
  }
}

function getBookingRoomId(data: Record<string, unknown>) {
  const booking = data.booking

  if (!isRecord(booking) || typeof booking.roomId !== 'string') {
    return null
  }

  return booking.roomId
}

export function getRealtimeQueryKeys(payload: string): RealtimeQueryKey[] {
  const event = parseRealtimeEvent(payload)

  if (!event) return []

  switch (event.type) {
    case 'booking.created':
    case 'booking.cancelled': {
      const roomId = getBookingRoomId(event.data)

      return roomId
        ? [['room-bookings', roomId], ['bookings']]
        : []
    }

    case 'room.availability_changed':
      return [['rooms']]

    case 'data.reset':
      return [null]

    default:
      return []
  }
}
