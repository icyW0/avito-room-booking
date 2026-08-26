import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import { Box, MenuItem, Select, Stack, Typography } from '@mui/material'
import { addDays, format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState } from 'react'

const capacityOptions = [2, 4, 6, 8, 10, 12]
const durationOptions = Array.from({ length: 8 }, (_, index) => (index + 1) * 15)

function formatTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function getTimeOptions(duration: number) {
  const firstStart = 9 * 60
  const lastStart = 20 * 60 - duration
  const slotsCount = Math.floor((lastStart - firstStart) / 15) + 1

  return Array.from({ length: slotsCount }, (_, index) =>
    formatTime(firstStart + index * 15),
  )
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)

  return hours * 60 + minutes
}

const fieldLabelSx = {
  color: '#98a2b3',
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

const selectSx = {
  height: 52,
  bgcolor: 'background.paper',
  borderRadius: 1.5,
  fontSize: 16,
  fontWeight: 500,

  '& .MuiSelect-select': {
    display: 'flex',
    height: '100%',
    py: 0,
    pr: '36px !important',
    pl: 2,
    alignItems: 'center',
  },

  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d0d9e5',
  },

  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'text.secondary',
  },

  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderWidth: 1,
    borderColor: 'primary.main',
    boxShadow: '0 0 0 2px rgba(0, 156, 140, 0.16)',
  },

  '& .MuiSelect-icon': {
    right: 10,
    color: 'text.secondary',
  },
}

const menuProps = {
  slotProps: {
    paper: {
      sx: {
        maxHeight: 320,
        mt: 0.75,
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: '0 8px 24px rgba(16, 24, 40, 0.12)',
      },
    },
    list: {
      sx: {
        p: 1,
      },
    },
  },
}

function formatDateLabel(value: string) {
  const label = format(parseISO(value), 'd MMMM, EEE', { locale: ru }).replace('.', '')

  return label.charAt(0).toUpperCase() + label.slice(1)
}

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} мин`
  }

  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60

  if (restMinutes === 0) {
    return hours === 1 ? '1 час' : `${hours} часа`
  }

  return `${hours} ч ${restMinutes} мин`
}

function FilterLabel({ id, children }: { id: string; children: string }) {
  return (
    <Typography id={id} sx={fieldLabelSx}>
      {children}
    </Typography>
  )
}

export function RoomsFilters() {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(format(today, 'yyyy-MM-dd'))
  const [startTime, setStartTime] = useState('15:00')
  const [duration, setDuration] = useState(60)
  const [minCapacity, setMinCapacity] = useState(4)
  const availableTimeOptions = getTimeOptions(duration)

  return (
    <Box
      component="section"
      aria-label="Фильтры переговорных"
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: {
          xs: 'auto',
          md: 132,
        },
        px: {
          xs: 2,
          md: 5,
        },
        py: {
          xs: 2.5,
          md: 3,
        },
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: '100%',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          rowGap: 2,
        }}
      >
        <Stack spacing={0.75}>
          <FilterLabel id="rooms-date-label">Дата</FilterLabel>

          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              width: 196,
              height: 52,
              px: 2,
              gap: 1.25,
              alignItems: 'center',
              color: 'text.primary',
              bgcolor: 'background.paper',
              border: 1,
              borderColor: '#d0d9e5',
              borderRadius: 1.5,
              transition: 'border-color 150ms ease, box-shadow 150ms ease',

              '&:hover': {
                borderColor: 'text.secondary',
              },

              '&:focus-within': {
                borderColor: 'primary.main',
                boxShadow: '0 0 0 2px rgba(0, 156, 140, 0.16)',
              },
            }}
          >
            <CalendarTodayOutlinedIcon
              sx={{ flexShrink: 0, color: 'text.secondary', fontSize: 22 }}
            />
            <Typography
              sx={{
                overflow: 'hidden',
                fontSize: 16,
                fontWeight: 500,
                lineHeight: 1.25,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {formatDateLabel(selectedDate)}
            </Typography>
            <Box
              id="rooms-date-filter"
              component="input"
              type="date"
              aria-labelledby="rooms-date-label"
              value={selectedDate}
              min={format(today, 'yyyy-MM-dd')}
              max={format(addDays(today, 30), 'yyyy-MM-dd')}
              onChange={(event) => {
                if (event.target.value) {
                  setSelectedDate(event.target.value)
                }
              }}
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer',
                opacity: 0,
              }}
            />
          </Box>
        </Stack>

        <Stack spacing={0.75}>
          <FilterLabel id="rooms-time-label">Время начала</FilterLabel>
          <Select
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            IconComponent={ExpandMoreIcon}
            MenuProps={menuProps}
            inputProps={{ 'aria-labelledby': 'rooms-time-label' }}
            renderValue={(value) => (
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                <AccessTimeOutlinedIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
                <span>{value}</span>
              </Stack>
            )}
            sx={{ ...selectSx, width: 132 }}
          >
            {availableTimeOptions.map((time) => (
              <MenuItem key={time} value={time}>
                {time}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack spacing={0.75}>
          <FilterLabel id="rooms-duration-label">Длительность</FilterLabel>
          <Select
            value={duration}
            onChange={(event) => {
              const nextDuration = Number(event.target.value)
              const latestStart = 20 * 60 - nextDuration

              setDuration(nextDuration)

              if (timeToMinutes(startTime) > latestStart) {
                setStartTime(formatTime(latestStart))
              }
            }}
            IconComponent={ExpandMoreIcon}
            MenuProps={menuProps}
            inputProps={{ 'aria-labelledby': 'rooms-duration-label' }}
            renderValue={(value) => formatDuration(Number(value))}
            sx={{ ...selectSx, width: 142 }}
          >
            {durationOptions.map((minutes) => (
              <MenuItem key={minutes} value={minutes}>
                {formatDuration(minutes)}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack spacing={0.75}>
          <FilterLabel id="rooms-capacity-label">Вместимость</FilterLabel>
          <Select
            value={minCapacity}
            onChange={(event) => setMinCapacity(Number(event.target.value))}
            IconComponent={ExpandMoreIcon}
            MenuProps={menuProps}
            inputProps={{ 'aria-labelledby': 'rooms-capacity-label' }}
            renderValue={(value) => (
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                <PeopleOutlinedIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
                <span>Мин. {value} чел.</span>
              </Stack>
            )}
            sx={{ ...selectSx, width: 174 }}
          >
            {capacityOptions.map((capacity) => (
              <MenuItem key={capacity} value={capacity}>
                {capacity} чел.
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>
    </Box>
  )
}
