import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import { Box, Button, Card, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import type { Room } from '../../../entities/room/model/types'

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  const isAvailable = room.available === true

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        width: { xs: '100%', sm: 437 },
        height: 254,
        p: 2.5,
        bgcolor: 'background.paper',
        borderColor: '#dbe3ed',
        borderRadius: 2,
        boxShadow: 'none',
      }}
    >
      <Stack sx={{ width: '100%', justifyContent: 'space-between' }}>
        <Box>
          <Typography component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
            {room.name}
          </Typography>
          <Typography sx={{ mt: 0.25, color: 'text.secondary', fontSize: 14 }}>
            {room.floor} этаж
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <PeopleOutlinedIcon sx={{ color: 'text.secondary', fontSize: 21 }} />
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            Вместимость: до {room.capacity} человек
          </Typography>
        </Stack>
        <Box
          sx={{
            display: 'flex',
            height: 40,
            px: 1.5,
            gap: 1,
            alignItems: 'center',
            color: isAvailable ? '#087f72' : 'text.secondary',
            bgcolor: isAvailable ? '#c8f7ef' : '#e9eef5',
            borderRadius: 1.25,
          }}
        >
          <Box
            aria-hidden="true"
            sx={{
              width: 7,
              height: 7,
              flexShrink: 0,
              bgcolor: isAvailable ? 'primary.main' : '#98a2b3',
              borderRadius: '50%',
            }}
          />
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
            {isAvailable ? 'Доступно на выбранное время' : 'Недоступно на выбранное время'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            component={Link}
            to={`/rooms/${room.id}`}
            variant="text"
            sx={{ width: '50%', textTransform: 'none' }}
          >
            Подробнее
          </Button>
          <Button
            variant="contained"
            disabled={!isAvailable}
            sx={{ width: '50%', boxShadow: 'none', textTransform: 'none' }}
          >
            Забронировать
          </Button>
        </Stack>
      </Stack>
    </Card>
  )
}
