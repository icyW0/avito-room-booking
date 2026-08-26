import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined'
import EventSeatOutlinedIcon from '@mui/icons-material/EventSeatOutlined'
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

type EmptyStateVariant = 'noRooms' | 'selectOffice' | 'noBookings'

interface EmptyStateProps {
  variant: EmptyStateVariant
  onAction?: () => void
}

const contentByVariant = {
  noRooms: {
    title: 'Нет доступных переговорных',
    description:
      'Попробуйте изменить параметры фильтрации или выбрать другой офис',
    actionLabel: 'Сбросить фильтры',
  },
  selectOffice: {
    title: 'Выберите офис',
    description:
      'Для просмотра доступных переговорных сначала выберите офис из списка выше',
    actionLabel: null,
  },
  noBookings: {
    title: 'Нет бронирований',
    description:
      'У вас пока нет предстоящих бронирований. Перейдите в раздел переговорных, чтобы забронировать комнату.',
    actionLabel: 'Перейти к переговорным',
  },
} as const

function EmptyStateIcon({ variant }: { variant: EmptyStateVariant }) {
  const iconSx = { width: 56, height: 56 }

  return (
    <Box
      aria-hidden="true"
      sx={{
        display: 'flex',
        width: 120,
        height: 120,
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'center',
        color: variant === 'noRooms' ? '#94a3b8' : 'primary.main',
        bgcolor: variant === 'noRooms' ? '#e2e8f0' : '#ccfbf1',
        borderRadius: '50%',
      }}
    >
      {variant === 'noRooms' && <SearchOffOutlinedIcon sx={iconSx} />}
      {variant === 'selectOffice' && <ApartmentOutlinedIcon sx={iconSx} />}
      {variant === 'noBookings' && <EventSeatOutlinedIcon sx={iconSx} />}
    </Box>
  )
}

export function EmptyState({ variant, onAction }: EmptyStateProps) {
  const content = contentByVariant[variant]

  return (
    <Stack
      sx={{
        width: '100%',
        minHeight: 500,
        px: 2,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <EmptyStateIcon variant={variant} />

      <Typography
        component="h2"
        sx={{ mt: 4, fontSize: { xs: 24, sm: 28 }, fontWeight: 700 }}
      >
        {content.title}
      </Typography>

      <Typography
        sx={{ maxWidth: 680, mt: 2, color: 'text.secondary', fontSize: 16 }}
      >
        {content.description}
      </Typography>

      {variant === 'noRooms' && (
        <Button
          type="button"
          variant="contained"
          onClick={onAction}
          sx={actionButtonSx}
        >
          {content.actionLabel}
        </Button>
      )}

      {variant === 'noBookings' && (
        <Button
          component={Link}
          to="/rooms"
          variant="contained"
          sx={actionButtonSx}
        >
          {content.actionLabel}
        </Button>
      )}
    </Stack>
  )
}

const actionButtonSx = {
  minWidth: 244,
  height: 56,
  mt: 4,
  borderRadius: 1.5,
  fontSize: 16,
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
}
