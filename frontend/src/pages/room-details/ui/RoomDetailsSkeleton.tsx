import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, Card, Container, Skeleton, Stack } from '@mui/material'
import { ScheduleTimeline } from './ScheduleTimeline'

export function RoomDetailsSkeleton() {
  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{ px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 } }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        aria-hidden="true"
        sx={{ mb: 2.5, alignItems: 'center' }}
      >
        <Skeleton variant="rounded" width={132} height={20} />
        <ChevronRightIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
        <Skeleton variant="rounded" width={104} height={20} />
        <ChevronRightIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
        <Skeleton variant="rounded" width={158} height={20} />
      </Stack>

      <Box
        sx={{
          display: 'flex',
          gap: 5,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <RoomAboutSkeleton />
        <RoomScheduleSkeleton />
      </Box>
    </Container>
  )
}

function RoomAboutSkeleton() {
  return (
    <Card
      variant="outlined"
      aria-label="Загрузка информации о переговорной"
      sx={{
        width: '100%',
        maxWidth: 550,
        minHeight: 340,
        p: { xs: 2.5, sm: 4 },
        borderColor: 'divider',
        borderRadius: 2.5,
        boxShadow: 'none',
      }}
    >
      <Skeleton variant="rounded" width={210} height={34} />
      <Skeleton variant="rounded" width="65%" height={20} sx={{ mt: 1.5 }} />

      <Box sx={{ my: 3, borderTop: 1, borderColor: 'divider' }} />

      <Stack spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center' }}
          >
            <Skeleton variant="rounded" width={24} height={24} />
            <Skeleton variant="rounded" width="calc(100% - 40px)" height={20} />
          </Stack>
        ))}
      </Stack>
    </Card>
  )
}

function RoomScheduleSkeleton() {
  return (
    <Card
      variant="outlined"
      aria-label="Загрузка расписания переговорной"
      sx={{
        display: 'flex',
        width: '100%',
        minWidth: 0,
        minHeight: 1048,
        p: { xs: 2.5, sm: 4 },
        flexDirection: 'column',
        borderColor: 'divider',
        borderRadius: 2.5,
        boxShadow: 'none',
      }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
      >
        <Box>
          <Skeleton variant="rounded" width={262} height={34} />
          <Skeleton variant="rounded" width={184} height={20} sx={{ mt: 1 }} />
        </Box>

        <Skeleton variant="rounded" width={194} height={52} />
      </Stack>

      <ScheduleTimeline bookings={[]} currentUserId="" timezone="UTC" />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Skeleton variant="rounded" width={288} height={52} sx={{ mt: 3 }} />
      </Box>
    </Card>
  )
}
