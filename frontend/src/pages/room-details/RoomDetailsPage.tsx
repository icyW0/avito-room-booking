import { Container, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useRoomQuery } from '../../entities/room/api/useRoomQuery'
import { DataLoadingError } from '../../shared/ui/ErrorLoadingPage'
import RoomAbout from './ui/RoomAbout.tsx'
import ScheduleRoom from './ui/ScheduleRoom.tsx'

export function RoomDetailsPage() {
  const { roomId = '' } = useParams()
  const roomQuery = useRoomQuery(roomId)

  if (roomQuery.isPending) {
    return <Typography>Загрузка переговорной...</Typography>
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
      sx={{ display: 'flex', gap: 4, px: { xs: 2, md: 5 }, py: { xs: 3, md: 5 } }}
    >
      <RoomAbout room={room} />
      <ScheduleRoom/>
    </Container>
  )
}
