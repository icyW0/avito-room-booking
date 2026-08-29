import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material'

interface BookingConflictDialogProps {
  open: boolean
  onChooseAnotherTime: () => void
}

export function BookingConflictDialog({
  open,
  onChooseAnotherTime,
}: BookingConflictDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onChooseAnotherTime}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: {
            width: 'min(632px, calc(100% - 32px))',
            m: 2,
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogContent
        sx={{
          display: 'flex',
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            display: 'flex',
            width: 84,
            height: 84,
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#fee2e2',
            borderRadius: '50%',
          }}
        >
          <WarningAmberOutlinedIcon
            sx={{ width: 42, height: 42, color: '#ef4444' }}
          />
        </Box>

        <Typography
          component="h2"
          sx={{ mt: 2.5, fontSize: 28, fontWeight: 700 }}
        >
          Время уже занято
        </Typography>

        <Typography
          sx={{
            maxWidth: 480,
            mt: 2.5,
            color: 'text.secondary',
            fontSize: 17,
            lineHeight: 1.5,
          }}
        >
          Выбранный интервал был забронирован другим сотрудником. Расписание
          обновлено.
        </Typography>

        <Button
          type="button"
          variant="contained"
          fullWidth
          onClick={onChooseAnotherTime}
          sx={{
            height: 56,
            mt: 3.5,
            fontSize: 16,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',
          }}
        >
          Выбрать другое время
        </Button>
      </DialogContent>
    </Dialog>
  )
}
