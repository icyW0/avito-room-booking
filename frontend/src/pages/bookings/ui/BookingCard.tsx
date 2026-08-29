import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import { Box, Button, Card, Stack, Typography } from '@mui/material'
import type { Booking } from '../../../entities/booking/model/types'

interface BookingCardProps {
  booking: Booking
  canCancel: boolean
  onCancel: (booking: Booking) => void
}

function formatMonth(timestamp: string, timezone: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: timezone,
    month: 'long',
  })
    .format(new Date(timestamp))
    .toUpperCase()
}

function formatDay(timestamp: string, timezone: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: timezone,
    day: 'numeric',
  }).format(new Date(timestamp))
}

function formatTime(timestamp: string, timezone: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

function getTimezoneLabel(timezone: string) {
  if (timezone === 'Europe/Moscow') {
    return 'MSK'
  }

  return timezone
}

export function BookingCard({
  booking,
  canCancel,
  onCancel,
}: BookingCardProps) {
  const timezone = booking.office.timezone
  const month = formatMonth(booking.startsAt, timezone)
  const day = formatDay(booking.startsAt, timezone)
  const startsAt = formatTime(booking.startsAt, timezone)
  const endsAt = formatTime(booking.endsAt, timezone)
  const timezoneLabel = getTimezoneLabel(timezone)

  return (
    <Card
      component="article"
      variant="outlined"
      sx={{
        display: 'flex',
        minHeight: 168,
        p: { xs: 2, md: 3 },
        gap: { xs: 2, md: 3 },
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderColor: 'divider',
        borderRadius: 2.5,
        boxShadow: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 104,
          height: 104,
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          bgcolor: '#f8fafc',
          borderRadius: 2,
        }}
      >
        <Typography
          sx={{
            color: '#94a3b8',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {month}
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {day}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography
          component="h2"
          sx={{
            overflow: 'hidden',
            fontSize: { xs: 18, md: 21 },
            fontWeight: 700,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {booking.title}
        </Typography>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            mt: 1.25,
            alignItems: 'center',
            color: 'text.secondary',
            flexWrap: 'wrap',
          }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: 'center',
              color: 'primary.main',
            }}
          >
            <MeetingRoomOutlinedIcon sx={{ fontSize: 21 }} />

            <Typography
              sx={{
                color: 'inherit',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              {booking.room.name}
            </Typography>
          </Stack>

          <Typography aria-hidden="true">•</Typography>

          <Typography sx={{ fontSize: 15 }}>
            {booking.room.floor} этаж
          </Typography>

          <Typography aria-hidden="true">•</Typography>

          <Typography sx={{ fontSize: 15 }}>
            {startsAt}–{endsAt} {timezoneLabel}
          </Typography>
        </Stack>
      </Box>

      {canCancel && (
        <Button
          type="button"
          variant="outlined"
          color="error"
          onClick={() => onCancel(booking)}
          sx={{
            minWidth: 132,
            height: 52,
            flexShrink: 0,
            borderRadius: 1.5,
            fontSize: 16,
            fontWeight: 500,
            textTransform: 'none',
          }}
        >
          Отменить
        </Button>
      )}
    </Card>
  )
}
