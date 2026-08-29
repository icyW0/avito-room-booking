import { TZDate } from '@date-fns/tz'
import {
  Box,
  Card,
  Container,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { addMinutes, format } from 'date-fns'
import { useState, type ReactNode } from 'react'
import { useOfficesQuery } from '../../entities/office/api/useOfficesQuery'
import { useRoomsQuery } from '../../entities/room/api/useRoomsQuery'
import { OfficeSelector } from './ui/OfficeSelector'
import { RoomCard } from './ui/RoomCard'
import { RoomsFilters, type RoomsFiltersValue } from './ui/RoomsFilters'
import { DataLoadingError } from '../../shared/ui/ErrorLoadingPage.tsx'
import { EmptyState } from '../../shared/ui/EmptyState'

function getBookingInterval(
  filters: RoomsFiltersValue,
  timezone: string | undefined,
) {
  if (!timezone) return undefined

  const [year, month, day] = filters.date.split('-').map(Number)
  const [hours, minutes] = filters.startTime.split(':').map(Number)
  const startsAt = new TZDate(year, month - 1, day, hours, minutes, 0, timezone)
  const endsAt = addMinutes(startsAt, filters.duration)

  return {
    from: startsAt.toISOString(),
    to: endsAt.toISOString(),
  }
}

export function RoomsPage() {
  const [selectedOfficeId, setSelectedOfficeId] = useState('')
  const [filters, setFilters] = useState<RoomsFiltersValue>({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '15:00',
    duration: 60,
    minCapacity: 4,
  })

  const officesQuery = useOfficesQuery()
  const offices = officesQuery.data?.items ?? []
  const effectiveOfficeId = selectedOfficeId
  const selectedOffice = offices.find(
    (office) => office.id === effectiveOfficeId,
  )
  const interval = getBookingInterval(filters, selectedOffice?.timezone)

  const roomsQuery = useRoomsQuery({
    officeId: effectiveOfficeId,
    minCapacity: filters.minCapacity,
    ...(interval ?? {}),
  })

  const isLoading =
    officesQuery.isPending ||
    (Boolean(effectiveOfficeId) && roomsQuery.isPending)
  const isError = officesQuery.isError || roomsQuery.isError
  const rooms = roomsQuery.data?.items ?? []

  function retryLoading() {
    void officesQuery.refetch()
    void roomsQuery.refetch()
  }

  function resetFilters() {
    setFilters({
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '15:00',
      duration: 60,
      minCapacity: 4,
    })
  }

  let content: ReactNode

  if (isError) {
    content = (
      <DataLoadingError
        title="Не удалось загрузить данные"
        description="Произошла ошибка при загрузке списка переговорных"
        onRetry={retryLoading}
      />
    )
  } else if (isLoading) {
    content = (
      <RoomsGrid>
        {Array.from({ length: 6 }).map((_, index) => (
          <RoomCardSkeleton key={index} />
        ))}
      </RoomsGrid>
    )
  } else if (!effectiveOfficeId) {
    content = <EmptyState variant="selectOffice" />
  } else if (rooms.length === 0) {
    content = <EmptyState variant="noRooms" onAction={resetFilters} />
  } else {
    content = (
      <RoomsGrid>
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </RoomsGrid>
    )
  }

  return (
    <Box
      component="main"
      sx={{ minHeight: '100vh', bgcolor: 'background.default' }}
    >
      <OfficeSelector
        value={effectiveOfficeId}
        onChange={setSelectedOfficeId}
        offices={offices}
        disabled={officesQuery.isPending}
      />
      <RoomsFilters
        value={filters}
        onChange={setFilters}
        disabled={!effectiveOfficeId}
      />

      <Container
        maxWidth={false}
        disableGutters
        sx={{ px: { xs: 2, md: 5 }, py: { xs: 3, md: 5 } }}
      >
        <Box
          component="section"
          aria-labelledby="rooms-title"
          aria-busy={isLoading}
        >
          {(isLoading || rooms.length > 0) && (
            <Typography
              id="rooms-title"
              component="h1"
              variant="h4"
              sx={{
                mb: 4,
                color: 'text.primary',
                fontSize: { xs: 26, md: 32 },
                fontWeight: 700,
                lineHeight: 1.25,
              }}
            >
              {isLoading
                ? 'Загрузка переговорных...'
                : 'Доступные переговорные в этом офисе'}
            </Typography>
          )}

          {content}
        </Box>
      </Container>
    </Box>
  )
}

function RoomsGrid({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'minmax(0, 1fr)',
          md: 'repeat(2, minmax(0, 437px))',
          xl: 'repeat(3, 437px)',
        },
        gap: 3,
        alignItems: 'start',
      }}
    >
      {children}
    </Box>
  )
}

function RoomCardSkeleton() {
  return (
    <Card
      variant="outlined"
      sx={{
        width: { xs: '100%', sm: 437 },
        height: 254,
        p: 2.5,
        bgcolor: 'background.paper',
        borderColor: '#dbe3ed',
        borderRadius: 2,
        boxShadow: 'none',
      }}
    >
      <Stack sx={{ height: '100%', justifyContent: 'space-between' }}>
        <Stack spacing={0.75}>
          <Skeleton variant="rounded" width={160} height={28} />
          <Skeleton variant="rounded" width={70} height={20} />
        </Stack>
        <Stack spacing={1}>
          <Skeleton variant="rounded" width={250} height={20} />
          <Skeleton variant="rounded" width={250} height={20} />
        </Stack>
        <Skeleton variant="rounded" width="100%" height={40} />
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rounded" width="50%" height={40} />
          <Skeleton variant="rounded" width="50%" height={40} />
        </Stack>
      </Stack>
    </Card>
  )
}
