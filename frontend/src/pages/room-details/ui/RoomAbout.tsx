import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import TvOutlinedIcon from '@mui/icons-material/TvOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import { Box, Card, Divider, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { Room, RoomFeature } from '../../../entities/room/model/types'

interface RoomAboutProps {
  room: Room
}

const featureIcons: Record<string, ReactNode> = {
  display: <TvOutlinedIcon />,
  whiteboard: <BorderColorOutlinedIcon />,
  video: <VideocamOutlinedIcon />,
}

function FeatureRow({ feature }: { feature: RoomFeature }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Box
        aria-hidden="true"
        sx={{
          display: 'flex',
          width: 24,
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',

          '& .MuiSvgIcon-root': {
            fontSize: 24,
          },
        }}
      >
        {featureIcons[feature.code] ?? <TvOutlinedIcon />}
      </Box>

      <Typography sx={{ fontSize: 16, lineHeight: 1.4 }}>
        {feature.name}
      </Typography>
    </Stack>
  )
}

export default function RoomAbout({ room }: RoomAboutProps) {
  return (
    <Card
      component="section"
      aria-labelledby="room-about-title"
      variant="outlined"
      sx={{
        width: '100%',
        maxWidth: 550,
        minHeight: 260,
        p: { xs: 2.5, sm: 4 },
        bgcolor: 'background.paper',
        borderColor: 'divider',
        borderRadius: 2.5,
        boxShadow: 'none',
      }}
    >
      <Typography
        id="room-about-title"
        component="h1"
        sx={{
          fontSize: { xs: 26, sm: 32 },
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {room.name}
      </Typography>

      <Typography
        component="p"
        sx={{ mt: 1, color: 'text.secondary', fontSize: 16 }}
      >
        {room.office.name} · {room.office.address}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <PeopleOutlinedIcon
            aria-hidden="true"
            sx={{ flexShrink: 0, color: 'primary.main', fontSize: 24 }}
          />
          <Typography sx={{ fontSize: 16, lineHeight: 1.4 }}>
            Вместимость: до {room.capacity} человек
          </Typography>
        </Stack>

        {room.features.map((feature) => (
          <FeatureRow key={feature.code} feature={feature} />
        ))}
      </Stack>
    </Card>
  )
}
