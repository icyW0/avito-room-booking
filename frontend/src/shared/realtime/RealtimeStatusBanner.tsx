import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Box, Typography } from '@mui/material'
import { useRealtimeConnection } from './useRealtimeConnection'

export function RealtimeStatusBanner() {
  const status = useRealtimeConnection()

  if (status !== 'reconnecting') return null

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: 'flex',
        minHeight: 50,
        px: 2,
        gap: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#92400e',
        bgcolor: '#fef08a',
        borderBottom: 1,
        borderColor: '#facc15',
      }}
    >
      <InfoOutlinedIcon sx={{ fontSize: 24 }} />
      <Typography sx={{ fontSize: { xs: 14, sm: 16 }, fontWeight: 600 }}>
        Соединение потеряно. Переподключение…
      </Typography>
    </Box>
  )
}
