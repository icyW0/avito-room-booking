import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useMyBookingsQuery } from '../../entities/booking/api/useMyBookingsQuery.ts'
import type { BookingsScope } from '../../entities/booking/api/getMyBookings.ts'
import { useOfficesQuery } from '../../entities/office/api/useOfficesQuery.ts'

type BookingsTab = Extract<BookingsScope, 'upcoming' | 'past'>

export function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingsTab>('upcoming')
  const [selectedOfficeId, setSelectedOfficeId] = useState('')

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
              За всё время
            </Button>
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
                ? `Предстоящие (${bookings.length})`
                : 'Предстоящие'
            }
          />

          <Tab
            value="past"
            label={
              activeTab === 'past'
                ? `Прошедшие (${bookings.length})`
                : 'Прошедшие'
            }
          />
        </Tabs>

        <Box sx={{ mt: 4 }}>
          <Typography color="text.secondary">
            {bookingsQuery.isPending
              ? 'Загрузка бронирований...'
              : `Получено бронирований: ${bookings.length}`}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
