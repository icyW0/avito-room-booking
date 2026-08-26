import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { env } from '../config/env'

type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting'

const reconnectDelays = [1_000, 2_000, 5_000, 10_000]

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

    function connect() {
      socket = new WebSocket(env.webSocketUrl)

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
