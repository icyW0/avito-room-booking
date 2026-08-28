import { Box, Button, Card, Stack, Typography, Skeleton } from '@mui/material'
import { addDays, format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState } from 'react'
import type { Room } from '../../../entities/room/model/types'
import { DatePicker } from '../../../shared/ui/DatePicker'
import { BookingModal } from './BookingModal'
import { ScheduleTimeline } from './ScheduleTimeline'
import { useRoomBookingsQuery } from '../../../entities/booking/api/useRoomBookingsQuery'
import { getDayInterval } from '../../../entities/booking/lib/getDayInterval'
import { DataLoadingError } from '../../../shared/ui/ErrorLoadingPage'
import { useCurrentUserQuery } from '../../../entities/user/api/useCurrentUserQuery'

interface RoomScheduleProps {
  room: Room
}

function getDateInTimezone(timezone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? ''

  return `${part('year')}-${part('month')}-${part('day')}`
}


export function RoomSchedule({ room }: RoomScheduleProps) {
  const { id: roomId, office } = room
  const timezone = office.timezone
  const today = getDateInTimezone(timezone)
  const [selectedDate, setSelectedDate] = useState(today)
  const [isBookingModalOpen, setBookingModalOpen] = useState(false)

  const titleId = `room-${roomId}-schedule-title`

  const interval = getDayInterval({
    date: selectedDate,
    timezone,
  })

  const bookingsQuery = useRoomBookingsQuery({
    roomId,
    from: interval.from,
    to: interval.to,
  })

  const currentUserQuery = useCurrentUserQuery()

  const isLoading = bookingsQuery.isPending || currentUserQuery.isPending

  const isError = bookingsQuery.isError || currentUserQuery.isError

  function retryLoading() {
    void bookingsQuery.refetch()
    void currentUserQuery.refetch()
  }

  if (isError) {
    return (
      <Card
        component="section"
        variant="outlined"
        sx={{
          display: 'flex',
          width: '100%',
          minHeight: 568,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: 'divider',
          borderRadius: 2.5,
          boxShadow: 'none',
        }}
      >
        <DataLoadingError
          title="Не удалось загрузить расписание"
          description="Произошла ошибка при загрузке расписания переговорной"
          onRetry={retryLoading}
        />
      </Card>
    )
  }

  return (
    <Card
      component="section"
      aria-labelledby={titleId}
      variant="outlined"
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: 1048,
        p: 4,
        flexDirection: 'column',
        borderColor: 'divider',
        borderRadius: 2.5,
        boxShadow: 'none',
      }}
    >
      {bookingsQuery.isPending ? (
        <Stack
          direction="row"
          sx={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Skeleton variant="rounded" width={262} height={34} />

            <Skeleton
              variant="rounded"
              width={184}
              height={20}
              sx={{ mt: 1 }}
            />
          </Box>

          <Skeleton variant="rounded" width={194} height={52} />
        </Stack>
      ) : (
        <Stack
          direction="row"
          sx={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              id={titleId}
              component="h2"
              sx={{
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              Расписание на день
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: 'text.secondary',
                fontSize: 16,
              }}
            >
              {format(parseISO(selectedDate), 'EEEE, d MMMM', { locale: ru })}
            </Typography>
          </Box>

          <DatePicker
            value={selectedDate}
            min={today}
            max={format(addDays(parseISO(today), 30), 'yyyy-MM-dd')}
            onChange={setSelectedDate}
          />
        </Stack>
      )}

      <ScheduleTimeline />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        {bookingsQuery.isPending ? (
          <Skeleton variant="rounded" width={288} height={52} sx={{ mt: 3 }} />
        ) : (
          <Button
            type="button"
            variant="contained"
            onClick={() => setBookingModalOpen(true)}
            sx={{
              width: 288,
              height: 52,
              mt: 3,
              fontSize: 16,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
            }}
          >
            Забронировать комнату
          </Button>
        )}
      </Box>

      {isBookingModalOpen && (
        <BookingModal
          open
          room={room}
          initialDate={selectedDate}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </Card>
  )
}
