import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { addDays, addMinutes, format, parse, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState, type FormEvent } from 'react'
import type { Room } from '../../../entities/room/model/types'
import { DatePicker } from '../../../shared/ui/DatePicker'
import { useCreateBookingMutation } from '../../../entities/booking/api/useCreateBookingMutation'
import { getBookingInterval } from '../../../entities/booking/lib/getBookingInterval'
import { ApiError } from '../../../shared/api/ApiError'
import type { Booking } from '../../../entities/booking/model/types'

interface BookingModalProps {
  open: boolean
  room: Room
  initialDate: string
  onClose: () => void
  onCreated: (booking: Booking) => void
  onConflict: () => void
}

const durationOptions = Array.from(
  { length: 8 },
  (_, index) => (index + 1) * 15,
)
const timeOptions = Array.from({ length: 44 }, (_, index) => {
  const totalMinutes = 9 * 60 + index * 15
  return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(
    totalMinutes % 60,
  ).padStart(2, '0')}`
})

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function minutesToTime(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(
    value % 60,
  ).padStart(2, '0')}`
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} мин`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (rest === 0) return hours === 1 ? '1 час' : `${hours} часа`
  return `${hours} ч ${rest} мин`
}

function getEndTime(date: string, time: string, duration: number) {
  const startsAt = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date())
  return format(addMinutes(startsAt, duration), 'HH:mm')
}

export function BookingModal({
  open,
  room,
  initialDate,
  onClose,
  onCreated,
  onConflict,
}: BookingModalProps) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(initialDate)
  const [startTime, setStartTime] = useState('15:00')
  const [duration, setDuration] = useState(60)
  const [comment, setComment] = useState('')
  const [titleError, setTitleError] = useState(false)
  const [dateTimeError, setDateTimeError] = useState<string | null>(null)

  const createBookingMutation = useCreateBookingMutation()

  const endTime = getEndTime(date, startTime, duration)
  const dateLabel = format(parseISO(date), 'd MMMM, EEE', { locale: ru })
  const availableTimeOptions = timeOptions.filter(
    (time) => timeToMinutes(time) + duration <= 20 * 60,
  )

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const hasTitleError = title.trim().length === 0
    setTitleError(hasTitleError)
    setDateTimeError(null)

    if (hasTitleError) {
      return
    }

    const interval = getBookingInterval({
      date,
      startTime,
      duration,
      timezone: room.office.timezone,
    })

    if (new Date(interval.startsAt).getTime() <= Date.now()) {
      setDateTimeError('Нельзя создать бронирование в прошлом')
      return
    }

    createBookingMutation.mutate(
      {
        roomId: room.id,
        title: title.trim(),

        ...(comment.trim()
          ? {
              comment: comment.trim(),
            }
          : {}),

        ...interval,
      },
      {
        onSuccess: (booking) => {
          onCreated(booking)
        },
        onError: (error) => {
          if (
            error instanceof ApiError &&
            error.status === 409 &&
            error.code === 'BOOKING_CONFLICT'
          ) {
            onConflict()
          }
        },
      },
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: 'min(736px, calc(100% - 32px))',
            m: 2,
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 3, sm: 5 } }}>
        <Typography component="h2" sx={{ fontSize: 28, fontWeight: 700 }}>
          Новое бронирование
        </Typography>

        <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 16 }}>
          Переговорная:{' '}
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
            {room.name}
          </Box>{' '}
          ({room.office.name}, {room.floor} этаж)
        </Typography>

        <Divider sx={{ my: 3.5 }} />

        <Box component="form" noValidate onSubmit={submitForm}>
          <Stack spacing={2.5}>
            <Box>
              <FieldLabel>Тема встречи *</FieldLabel>
              <TextField
                fullWidth
                value={title}
                error={titleError}
                placeholder="Укажите тему встречи"
                helperText={titleError ? 'Обязательное поле' : ' '}
                onChange={(event) => {
                  setTitle(event.target.value)
                  if (event.target.value.trim()) setTitleError(false)
                }}
                slotProps={{ htmlInput: { maxLength: 120 } }}
                sx={fieldSx}
              />
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box sx={{ width: '100%' }}>
                <FieldLabel>Дата</FieldLabel>
                <DatePicker
                  value={date}
                  min={today}
                  max={format(addDays(parseISO(today), 30), 'yyyy-MM-dd')}
                  label={dateLabel}
                  fullWidth
                  error={Boolean(dateTimeError)}
                  helperText={dateTimeError ?? undefined}
                  onChange={(value) => {
                    setDate(value)
                    setDateTimeError(null)
                  }}
                />
              </Box>

              <Box sx={{ width: '100%' }}>
                <FieldLabel>Время начала</FieldLabel>
                <Select
                  fullWidth
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  renderValue={(value) => (
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{ alignItems: 'center' }}
                    >
                      <AccessTimeOutlinedIcon
                        sx={{ color: 'text.secondary' }}
                      />
                      <span>{value}</span>
                    </Stack>
                  )}
                  sx={selectSx}
                >
                  {availableTimeOptions.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Stack>

            <Box>
              <FieldLabel>Продолжительность</FieldLabel>
              <FormControl fullWidth>
                <Select
                  value={duration}
                  onChange={(event) => {
                    const nextDuration = Number(event.target.value)
                    const latestStart = 20 * 60 - nextDuration
                    setDuration(nextDuration)
                    if (timeToMinutes(startTime) > latestStart) {
                      setStartTime(minutesToTime(latestStart))
                    }
                  }}
                  renderValue={(value) =>
                    `${formatDuration(Number(value))} (до ${endTime})`
                  }
                  sx={selectSx}
                >
                  {durationOptions.map((minutes) => (
                    <MenuItem key={minutes} value={minutes}>
                      {formatDuration(minutes)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <FieldLabel>Комментарий</FieldLabel>
              <TextField
                fullWidth
                multiline
                minRows={3}
                value={comment}
                placeholder="Дополнительная информация для участников встречи..."
                onChange={(event) => setComment(event.target.value)}
                slotProps={{ htmlInput: { maxLength: 500 } }}
                sx={fieldSx}
              />
            </Box>

            {createBookingMutation.isError &&
              !(
                createBookingMutation.error instanceof ApiError &&
                createBookingMutation.error.code === 'BOOKING_CONFLICT'
              ) && (
                <Alert severity="error">
                  {createBookingMutation.error instanceof ApiError
                    ? createBookingMutation.error.message
                    : 'Не удалось создать бронирование. Попробуйте снова.'}
                </Alert>
              )}

            <Stack
              direction="row"
              spacing={1.25}
              sx={{
                p: 2,
                alignItems: 'center',
                color: '#087f72',
                bgcolor: '#ccfbf1',
                borderRadius: 1.5,
              }}
            >
              <InfoOutlinedIcon sx={{ flexShrink: 0, fontSize: 22 }} />

              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                Бронирование на {dateLabel}, {startTime}–{endTime} (
                {formatDuration(duration)})
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: 'flex-end' }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={onClose}
                sx={modalButtonSx}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createBookingMutation.isPending}
                sx={modalButtonSx}
              >
                {createBookingMutation.isPending
                  ? 'Бронируем...'
                  : 'Забронировать'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Typography sx={{ mb: 0.75, color: 'text.secondary', fontWeight: 700 }}>
      {children}
    </Typography>
  )
}

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: 1.5 },
}

const selectSx = {
  height: 52,
  borderRadius: 1.5,
}

const modalButtonSx = {
  minWidth: 132,
  height: 52,
  fontSize: 16,
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
}
