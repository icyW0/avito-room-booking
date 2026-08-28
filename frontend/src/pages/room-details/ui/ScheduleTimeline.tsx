import { Box, Typography } from '@mui/material'
import type { Booking } from '../../../entities/booking/model/types'

interface ScheduleTimelineProps {
  bookings: Booking[]
  currentUserId: string
  timezone: string
}

const WORKDAY_START = 9 * 60
const WORKDAY_END = 20 * 60
const HOUR_HEIGHT = 63
const TIMELINE_LEFT = 80

const workingHours = Array.from({ length: 12 }, (_, index) => 9 + index)

function getMinutesInTimezone(timestamp: string, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(timestamp))

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0)

  return getPart('hour') * 60 + getPart('minute')
}

export function ScheduleTimeline({
  bookings,
  currentUserId,
  timezone,
}: ScheduleTimelineProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: 725,
        mt: 4,
        flexGrow: 1,
      }}
    >
      {workingHours.map((hour, index) => (
        <Box
          key={hour}
          sx={{
            display: 'grid',
            height: index === workingHours.length - 1 ? 32 : HOUR_HEIGHT,
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

          <Box
            sx={{
              borderTop: 1,
              borderColor: 'divider',
            }}
          />
        </Box>
      ))}

      {bookings.map((booking) => {
        const startMinutes = getMinutesInTimezone(booking.startsAt, timezone)

        const endMinutes = getMinutesInTimezone(booking.endsAt, timezone)

        const visibleStart = Math.max(startMinutes, WORKDAY_START)

        const visibleEnd = Math.min(endMinutes, WORKDAY_END)

        if (visibleEnd <= visibleStart) {
          return null
        }

        const top = ((visibleStart - WORKDAY_START) / 60) * HOUR_HEIGHT

        const height = ((visibleEnd - visibleStart) / 60) * HOUR_HEIGHT

        const isOwnBooking = booking.userId === currentUserId

        const label = isOwnBooking ? booking.title : 'Занято'

        return (
          <Box
            key={booking.id}
            role="group"
            aria-label={`${label}, ${booking.startsAt}–${booking.endsAt}`}
            sx={{
              position: 'absolute',
              top,
              right: 0,
              left: TIMELINE_LEFT,
              display: 'flex',
              height: Math.max(height, 24),
              px: 2,
              alignItems: 'center',
              overflow: 'hidden',
              color: isOwnBooking ? '#087f72' : 'text.primary',
              bgcolor: isOwnBooking ? '#ccfbf1' : '#f1f5f9',
              border: 1,
              borderColor: isOwnBooking ? 'primary.main' : 'divider',
              borderRadius: 1.5,
              zIndex: 1,
            }}
          >
            <Typography
              sx={{
                overflow: 'hidden',
                fontSize: 14,
                fontWeight: 600,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
