import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import type { Booking } from '../../../entities/booking/model/types'

interface BookingSuccessSnackbarProps {
  booking: Booking | null
  onClose: () => void
}

function formatBookingDate(timestamp: string, timezone: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: timezone,
    day: 'numeric',
    month: 'long',
  }).format(new Date(timestamp))
}

function formatBookingTime(timestamp: string, timezone: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function BookingSuccessSnackbar({
  booking,
  onClose,
}: BookingSuccessSnackbarProps) {
  if (!booking) {
    return null
  }

  const timezone = booking.office.timezone

  const date = formatBookingDate(booking.startsAt, timezone)

  const startsAt = formatBookingTime(booking.startsAt, timezone)

  const endsAt = formatBookingTime(booking.endsAt, timezone)

  const timezoneLabel = timezone === 'Europe/Moscow' ? 'MSK' : timezone

  return (
    <Snackbar
      open
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      onClose={(_, reason) => {
        if (reason !== 'clickaway') {
          onClose()
        }
      }}
      sx={{
        top: {
          xs: 16,
          sm: 24,
        },
      }}
    >
      <Paper
        role="status"
        elevation={8}
        sx={{
          display: 'flex',
          width: {
            xs: 'calc(100vw - 32px)',
            sm: 736,
          },
          maxWidth: 'calc(100vw - 32px)',
          minHeight: 108,
          p: 3,
          gap: 2,
          alignItems: 'center',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: '#10b981',
          borderRadius: 2,
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            display: 'flex',
            width: 48,
            height: 48,
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'center',
            color: '#087f72',
            bgcolor: '#ccfbf1',
            borderRadius: '50%',
          }}
        >
          <CheckIcon />
        </Box>

        <Stack spacing={0.5} sx={{ minWidth: 0, flexGrow: 1 }}>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Бронирование создано
          </Typography>

          <Typography
            sx={{
              overflow: 'hidden',
              color: 'text.secondary',
              fontSize: 15,
              textOverflow: 'ellipsis',
              whiteSpace: {
                xs: 'normal',
                sm: 'nowrap',
              },
            }}
          >
            Комната {booking.room.name}, {date}, {startsAt}–{endsAt}{' '}
            {timezoneLabel}
          </Typography>
        </Stack>

        <IconButton
          type="button"
          aria-label="Закрыть уведомление"
          onClick={onClose}
          sx={{
            flexShrink: 0,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Paper>
    </Snackbar>
  )
}
