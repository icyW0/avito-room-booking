const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw new Error('Не задан VITE_API_URL')
}

const webSocketProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

const webSocketUrl =
  import.meta.env.VITE_WS_URL ||
  `${webSocketProtocol}//${window.location.host}/api/v1/ws`

export const env = {
  apiUrl,
  webSocketUrl,
} as const
