import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { Box, Button, Stack, Typography } from '@mui/material'

interface DataLoadingErrorProps {
  title: string
  description: string
  onRetry: () => void
}

export function DataLoadingError({
  title,
  description,
  onRetry,
}: DataLoadingErrorProps) {
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
      <Box
        aria-hidden="true"
        sx={{
          display: 'flex',
          width: 120,
          height: 120,
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fee2e2',
          borderRadius: '50%',
        }}
      >
        <WarningAmberOutlinedIcon
          sx={{
            width: 56,
            height: 56,
            color: '#ef4444',
          }}
        />
      </Box>

      <Typography
        component="h2"
        sx={{
          mt: 4,
          fontSize: 28,
          fontWeight: 700,
          lineHeight: 1.25,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          maxWidth: 500,
          mt: 2,
          color: 'text.secondary',
          fontSize: 16,
        }}
      >
        {description}
      </Typography>

      <Button
        type="button"
        variant="contained"
        onClick={onRetry}
        sx={{
          minWidth: 244,
          height: 56,
          mt: 4,
          borderRadius: 1.5,
          fontSize: 16,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
        }}
      >
        Попробовать снова
      </Button>
    </Stack>
  )
}
