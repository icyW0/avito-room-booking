import { Box, Button, Card, Stack, Typography } from '@mui/material'
import { addDays, format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState } from 'react'
import { DatePicker } from '../../../shared/ui/DatePicker'
import { ScheduleTimeline } from './ScheduleTimeline'

interface RoomScheduleProps {
  roomId: string
  timezone: string
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

export function RoomSchedule({ roomId, timezone }: RoomScheduleProps) {
  const today = getDateInTimezone(timezone)
  const [selectedDate, setSelectedDate] = useState(today)
  const titleId = `room-${roomId}-schedule-title`

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
            {format(parseISO(selectedDate), 'EEEE, d MMMM', {
              locale: ru,
            })}
          </Typography>
        </Box>

        <DatePicker
          value={selectedDate}
          min={today}
          max={format(addDays(parseISO(today), 30), 'yyyy-MM-dd')}
          onChange={setSelectedDate}
        />
      </Stack>

      <ScheduleTimeline />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
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
      </Box>
    </Card>
  )
}
