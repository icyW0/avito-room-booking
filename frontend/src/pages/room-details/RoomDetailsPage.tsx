import { Box, Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useRoomQuery } from '../../entities/room/api/useRoomQuery'
import { DataLoadingError } from '../../shared/ui/ErrorLoadingPage'
import RoomAbout from './ui/RoomAbout.tsx'
import { RoomSchedule } from './ui/RoomSchedule.tsx'
import { RoomDetailsSkeleton } from './ui/RoomDetailsSkeleton'

export function RoomDetailsPage() {
  const { roomId = '' } = useParams()
  const roomQuery = useRoomQuery(roomId)

  if (roomQuery.isPending) {
    return <RoomDetailsSkeleton />
  }

  if (roomQuery.isError) {
    return (
      <DataLoadingError
        title="Не удалось загрузить переговорную"
        description="Произошла ошибка при загрузке информации о переговорной"
        onRetry={() => void roomQuery.refetch()}
      />
    )
  }

  const room = roomQuery.data

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        px: { xs: 2, md: 5 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 5,
          alignItems: 'start',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <RoomAbout room={room} />

        <RoomSchedule room={room} />
      </Box>
    </Container>
  )
}
