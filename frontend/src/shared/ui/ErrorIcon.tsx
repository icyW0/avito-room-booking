import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { Box } from '@mui/material'

export function ErrorIcon() {
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
        bgcolor: '#FEE2E2',
        borderRadius: '50%',
      }}
    >
      <WarningAmberOutlinedIcon
        sx={{
          width: 56,
          height: 56,
          color: '#EF4444',
        }}
      />
    </Box>
  )
}
