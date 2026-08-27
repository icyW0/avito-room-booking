import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Button, IconButton, Popover, Typography } from '@mui/material'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState, type MouseEvent } from 'react'

interface DatePickerProps {
  value: string
  min: string
  max: string
  onChange: (value: string) => void
  label?: string
  fullWidth?: boolean
}

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function DatePicker({
  value,
  min,
  max,
  onChange,
  label = 'Выбрать дату',
  fullWidth = false,
}: DatePickerProps) {
  const selectedDate = parseISO(value)
  const minDate = parseISO(min)
  const maxDate = parseISO(max)
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(selectedDate))
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: 1 }),
  })

  function openCalendar(event: MouseEvent<HTMLButtonElement>) {
    setVisibleMonth(startOfMonth(selectedDate))
    setAnchorElement(event.currentTarget)
  }

  function selectDate(date: Date) {
    onChange(format(date, 'yyyy-MM-dd'))
    setAnchorElement(null)
  }

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        startIcon={<CalendarTodayOutlinedIcon />}
        onClick={openCalendar}
        sx={{
          width: fullWidth ? '100%' : 194,
          height: 52,
          color: 'text.primary',
          borderColor: 'divider',
          fontSize: 16,
          fontWeight: 600,
          textTransform: 'none',
        }}
      >
        {label}
      </Button>

      <Popover
        open={Boolean(anchorElement)}
        anchorEl={anchorElement}
        onClose={() => setAnchorElement(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              mt: 1,
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(16, 24, 40, 0.12)',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            mb: 1.5,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
            {format(visibleMonth, 'LLLL yyyy', { locale: ru })}
          </Typography>

          <Box>
            <IconButton
              size="small"
              aria-label="Предыдущий месяц"
              onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
              disabled={isBefore(endOfMonth(addMonths(visibleMonth, -1)), minDate)}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              size="small"
              aria-label="Следующий месяц"
              onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
              disabled={isAfter(startOfMonth(addMonths(visibleMonth, 1)), maxDate)}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {weekDays.map((day) => (
            <Typography
              key={day}
              sx={{
                py: 1,
                color: 'text.secondary',
                fontSize: 12,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {day}
            </Typography>
          ))}

          {calendarDays.map((date) => {
            const isDisabled = isBefore(date, minDate) || isAfter(date, maxDate)
            const isSelected = isSameDay(date, selectedDate)

            return (
              <Button
                key={date.toISOString()}
                type="button"
                disabled={isDisabled}
                aria-label={format(date, 'd MMMM yyyy', { locale: ru })}
                onClick={() => selectDate(date)}
                sx={{
                  minWidth: 0,
                  width: 36,
                  height: 36,
                  mx: 'auto',
                  color: isSameMonth(date, visibleMonth)
                    ? 'text.primary'
                    : 'text.disabled',
                  bgcolor: isSelected ? 'primary.main' : 'transparent',
                  borderRadius: 1,
                  fontSize: 13,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: isSelected ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                {format(date, 'd')}
              </Button>
            )
          })}
        </Box>
      </Popover>
    </>
  )
}
