const apiUrl = import.meta.env.VITE_API_URL
const webSocketUrl = import.meta.env.VITE_WS_URL

if (!apiUrl || !webSocketUrl) {
  throw new Error('Не заданы VITE_API_URL и VITE_WS_URL')
}

export const env = {
  apiUrl,
  webSocketUrl,
} as const
