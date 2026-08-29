import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material'
import type { Booking } from '../../../entities/booking/model/types'
import { useCancelBookingMutation } from '../../../entities/booking/api/useCancelBookingMutation'
import { ApiError } from '../../../shared/api/ApiError'

interface CancelBookingDialogProps {
  booking: Booking | null
  onClose: () => void
}

function formatBookingDate(timestamp: string, timezone: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone: timezone,
    weekday: 'long',
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

export function CancelBookingDialog({
  booking,
  onClose,
}: CancelBookingDialogProps) {
  const cancelBookingMutation = useCancelBookingMutation()

  function closeDialog() {
    if (cancelBookingMutation.isPending) {
      return
    }

    cancelBookingMutation.reset()
    onClose()
  }

  function confirmCancellation() {
    if (!booking) {
      return
    }

    cancelBookingMutation.mutate(booking, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const timezone = booking?.office.timezone ?? 'Europe/Moscow'

  const date = booking ? formatBookingDate(booking.startsAt, timezone) : ''

  const startsAt = booking ? formatBookingTime(booking.startsAt, timezone) : ''

  const endsAt = booking ? formatBookingTime(booking.endsAt, timezone) : ''

  return (
    <Dialog
      open={Boolean(booking)}
      onClose={closeDialog}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: 'min(632px, calc(100% - 32px))',
            m: 2,
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 3, sm: 5 } }}>
        <Typography
          component="h2"
          sx={{
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          Отменить бронирование?
        </Typography>

        <Typography
          sx={{
            mt: 1.5,
            color: 'text.secondary',
            fontSize: 16,
            lineHeight: 1.5,
          }}
        >
          Это действие нельзя будет отменить. Освободившееся время станет
          доступно другим сотрудникам.
        </Typography>

        {booking && (
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              bgcolor: '#f8fafc',
              borderRadius: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {booking.title}
            </Typography>

            <Stack spacing={1.25} sx={{ mt: 2 }}>
              <Stack
                direction="row"
                spacing={1.25}
                sx={{ alignItems: 'center' }}
              >
                <MeetingRoomOutlinedIcon
                  sx={{
                    color: 'text.secondary',
                    fontSize: 21,
                  }}
                />

                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 15,
                  }}
                >
                  Комната «{booking.room.name}», {booking.room.floor} этаж
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1.25}
                sx={{ alignItems: 'center' }}
              >
                <CalendarTodayOutlinedIcon
                  sx={{
                    color: 'text.secondary',
                    fontSize: 21,
                  }}
                />

                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 15,
                  }}
                >
                  {date}, {startsAt}–{endsAt}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        )}

        {cancelBookingMutation.isError && (
          <Alert severity="error" sx={{ mt: 2.5 }}>
            {cancelBookingMutation.error instanceof ApiError
              ? cancelBookingMutation.error.message
              : 'Не удалось отменить бронирование. Попробуйте снова.'}
          </Alert>
        )}

        <Stack
          direction={{ xs: 'column-reverse', sm: 'row' }}
          spacing={2}
          sx={{ mt: 4 }}
        >
          <Button
            type="button"
            variant="outlined"
            fullWidth
            disabled={cancelBookingMutation.isPending}
            onClick={closeDialog}
            sx={dialogButtonSx}
          >
            Нет, оставить
          </Button>

          <Button
            type="button"
            variant="contained"
            color="error"
            fullWidth
            disabled={cancelBookingMutation.isPending}
            onClick={confirmCancellation}
            sx={dialogButtonSx}
          >
            {cancelBookingMutation.isPending ? 'Отменяем...' : 'Да, отменить'}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

const dialogButtonSx = {
  height: 56,
  borderRadius: 1.5,
  fontSize: 16,
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
}
