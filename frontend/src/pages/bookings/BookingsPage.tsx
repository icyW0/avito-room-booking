import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import {
  Box,
  Button,
  Container,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useState, type MouseEvent, type ReactNode } from 'react'
import { useMyBookingsQuery } from '../../entities/booking/api/useMyBookingsQuery.ts'
import type { BookingsScope } from '../../entities/booking/api/getMyBookings.ts'
import { useOfficesQuery } from '../../entities/office/api/useOfficesQuery.ts'
import { BookingCard } from './ui/BookingCard.tsx'
import { DataLoadingError } from '../../shared/ui/ErrorLoadingPage'
import { EmptyState } from '../../shared/ui/EmptyState'
import { BookingsPageSkeleton } from './ui/BookingsPageSkeleton'
import type { Booking } from '../../entities/booking/model/types.ts'
import { CancelBookingDialog } from './ui/CancelBookingDialog'

type BookingsTab = Extract<BookingsScope, 'upcoming' | 'past'>
type BookingsPeriod = 'all' | 'today' | '7days' | '30days'

const periodLabels: Record<BookingsPeriod, string> = {
  all: 'За всё время',
  today: 'Сегодня',
  '7days': 'За 7 дней',
  '30days': 'За 30 дней',
}

function isBookingInPeriod(
  booking: Booking,
  period: BookingsPeriod,
  tab: BookingsTab,
) {
  if (period === 'all') {
    return true
  }

  const now = new Date()
  const startsAt = new Date(booking.startsAt)

  if (period === 'today') {
    return startsAt.toDateString() === now.toDateString()
  }

  const periodInDays = period === '7days' ? 7 : 30
  const boundary = new Date(now)
  boundary.setDate(
    now.getDate() + (tab === 'upcoming' ? periodInDays : -periodInDays),
  )

  return tab === 'upcoming' ? startsAt <= boundary : startsAt >= boundary
}

export function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingsTab>('upcoming')
  const [selectedOfficeId, setSelectedOfficeId] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<BookingsPeriod>('all')
  const [periodMenuAnchor, setPeriodMenuAnchor] = useState<HTMLElement | null>(
    null,
  )

  const officesQuery = useOfficesQuery()

  const bookingsQuery = useMyBookingsQuery({
    scope: activeTab,
    ...(selectedOfficeId
      ? {
          officeId: selectedOfficeId,
        }
      : {}),
  })

  const offices = officesQuery.data?.items ?? []
  const bookings = bookingsQuery.data?.items ?? []
  const filteredBookings = bookings.filter((booking) =>
    isBookingInPeriod(booking, selectedPeriod, activeTab),
  )

  const isLoading = officesQuery.isPending || bookingsQuery.isPending
  const isError = officesQuery.isError || bookingsQuery.isError

  function retryLoading() {
    void officesQuery.refetch()
    void bookingsQuery.refetch()
  }

  if (isLoading) {
    return <BookingsPageSkeleton />
  }

  let content: ReactNode

  if (isError) {
    content = (
      <DataLoadingError
        title="Не удалось загрузить данные"
        description="Произошла ошибка при загрузке ваших бронирований"
        onRetry={retryLoading}
      />
    )
  } else if (filteredBookings.length === 0) {
    content = (
      <EmptyState
        variant="noBookings"
        description={
          activeTab === 'upcoming'
            ? 'У вас пока нет предстоящих бронирований. Перейдите в раздел переговорных, чтобы забронировать комнату.'
            : 'У вас пока нет прошедших бронирований.'
        }
      />
    )
  } else {
    content = (
      <Stack spacing={2.5}>
        {filteredBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            canCancel={activeTab === 'upcoming'}
            onCancel={setSelectedBooking}
          />
        ))}
      </Stack>
    )
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: 'calc(100vh - 72px)',
        bgcolor: 'background.default',
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          px: { xs: 2, md: 5 },
          py: { xs: 3, md: 5 },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 28, md: 36 },
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            Мои бронирования
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Select
              value={selectedOfficeId}
              displayEmpty
              disabled={officesQuery.isPending}
              onChange={(event) => setSelectedOfficeId(event.target.value)}
              sx={{
                width: { xs: '100%', sm: 168 },
                height: 52,
                bgcolor: 'background.paper',
                borderRadius: 1.5,
              }}
            >
              <MenuItem value="">Все офисы</MenuItem>

              {offices.map((office) => (
                <MenuItem key={office.id} value={office.id}>
                  {office.name}
                </MenuItem>
              ))}
            </Select>

            <Button
              type="button"
              variant="outlined"
              startIcon={<CalendarTodayOutlinedIcon />}
              aria-controls={
                periodMenuAnchor ? 'bookings-period-menu' : undefined
              }
              aria-haspopup="menu"
              aria-expanded={periodMenuAnchor ? 'true' : undefined}
              onClick={(event: MouseEvent<HTMLButtonElement>) =>
                setPeriodMenuAnchor(event.currentTarget)
              }
              sx={{
                width: { xs: '100%', sm: 188 },
                height: 52,
                color: 'text.primary',
                bgcolor: 'background.paper',
                borderColor: 'divider',
                borderRadius: 1.5,
                fontSize: 16,
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              {periodLabels[selectedPeriod]}
            </Button>

            <Menu
              id="bookings-period-menu"
              anchorEl={periodMenuAnchor}
              open={Boolean(periodMenuAnchor)}
              onClose={() => setPeriodMenuAnchor(null)}
            >
              {(Object.keys(periodLabels) as BookingsPeriod[]).map((period) => (
                <MenuItem
                  key={period}
                  selected={period === selectedPeriod}
                  onClick={() => {
                    setSelectedPeriod(period)
                    setPeriodMenuAnchor(null)
                  }}
                >
                  <ListItemText>{periodLabels[period]}</ListItemText>
                  {period === selectedPeriod && (
                    <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Stack>

        <Tabs
          value={activeTab}
          onChange={(_, value: BookingsTab) => setActiveTab(value)}
          sx={{
            mt: 4,
            borderBottom: 1,
            borderColor: 'divider',

            '& .MuiTab-root': {
              minHeight: 56,
              px: 0,
              mr: 4,
              fontSize: 18,
              fontWeight: 500,
              textTransform: 'none',
            },

            '& .Mui-selected': {
              fontWeight: 600,
            },
          }}
        >
          <Tab
            value="upcoming"
            label={
              activeTab === 'upcoming'
                ? `Предстоящие (${filteredBookings.length})`
                : 'Предстоящие'
            }
          />

          <Tab
            value="past"
            label={
              activeTab === 'past'
                ? `Прошедшие (${filteredBookings.length})`
                : 'Прошедшие'
            }
          />
        </Tabs>

        <Box sx={{ mt: 4 }}>{content}</Box>

        <CancelBookingDialog
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      </Container>
    </Box>
  )
}
