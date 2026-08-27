import { Box, Typography } from '@mui/material'

const workingHours = Array.from({ length: 12 }, (_, index) => 9 + index)

export function ScheduleTimeline() {
  return (
    <Box sx={{ position: 'relative', mt: 4, flexGrow: 1 }}>
      {workingHours.map((hour, index) => (
        <Box
          key={hour}
          sx={{
            display: 'grid',
            height: index === workingHours.length - 1 ? 32 : 63,
            gridTemplateColumns: '64px minmax(0, 1fr)',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: 14,
              lineHeight: 1,
            }}
          >
            {String(hour).padStart(2, '0')}:00
          </Typography>

          <Box sx={{ borderTop: 1, borderColor: 'divider' }} />
        </Box>
      ))}
    </Box>
  )
}
