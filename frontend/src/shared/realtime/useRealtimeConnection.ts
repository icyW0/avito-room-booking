import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { env } from '../config/env'

type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting'

const reconnectDelays = [1_000, 2_000, 5_000, 10_000]

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

export function useRealtimeConnection() {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<ConnectionStatus>('connecting')

  useEffect(() => {
    if (typeof WebSocket === 'undefined') return

    let socket: WebSocket | undefined
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined
    let reconnectAttempt = 0
    let wasDisconnected = false
    let disposed = false

    function handleMessage(message: MessageEvent<string>) {
      const event = parseRealtimeEvent(message.data)

      if (!event) return

      switch (event.type) {
        case 'booking.created':
        case 'booking.cancelled': {
          const roomId = getBookingRoomId(event.data)

          if (!roomId) return

          void queryClient.invalidateQueries({
            queryKey: ['room-bookings', roomId],
          })
          void queryClient.invalidateQueries({
            queryKey: ['bookings'],
          })
          break
        }

        case 'room.availability_changed':
          void queryClient.invalidateQueries({
            queryKey: ['rooms'],
          })
          break

        case 'data.reset':
          void queryClient.invalidateQueries()
          break
      }
    }

    function connect() {
      socket = new WebSocket(env.webSocketUrl)

      socket.addEventListener('message', handleMessage)

      socket.addEventListener('open', () => {
        if (disposed) return

        reconnectAttempt = 0
        setStatus('connected')

        if (wasDisconnected) {
          void queryClient.invalidateQueries()
          wasDisconnected = false
        }
      })

      socket.addEventListener('close', () => {
        if (disposed) return

        wasDisconnected = true
        setStatus('reconnecting')

        const delay = reconnectDelays[
          Math.min(reconnectAttempt, reconnectDelays.length - 1)
        ]
        reconnectAttempt += 1
        reconnectTimer = setTimeout(connect, delay)
      })

      socket.addEventListener('error', () => {
        socket?.close()
      })
    }

    connect()

    return () => {
      disposed = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      socket?.close()
    }
  }, [queryClient])

  return status
}
