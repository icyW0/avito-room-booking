import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Container, MenuItem, Select, Stack, Typography } from '@mui/material'
import type { Office } from '../../../entities/office/model/types'

interface OfficeSelectorProps {
  value: string
  onChange: (officeId: string) => void
  offices: Office[]
  disabled?: boolean
}

function getOfficeLocalTime(office: Office) {
  const time = new Intl.DateTimeFormat('ru-RU', {
    timeZone: office.timezone,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())
  const zoneLabel = office.timezone === 'Europe/Moscow' ? 'MSK' : office.timezone

  return `${time} ${zoneLabel}`
}

export function OfficeSelector({
  value,
  onChange,
  offices,
  disabled = false,
}: OfficeSelectorProps) {
  const selectedOffice = offices.find((office) => office.id === value)

  return (
    <Container
      component="section"
      maxWidth={false}
      disableGutters
      sx={{
        display: 'flex',
        width: '100%',
        height: 95,
        px: { xs: 2, md: 5 },
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Stack spacing={0.75}>
        <Select
          value={value}
          displayEmpty
          disabled={disabled || offices.length === 0}
          onChange={(event) => onChange(event.target.value)}
          variant="standard"
          disableUnderline
          IconComponent={ExpandMoreIcon}
          inputProps={{ 'aria-label': 'Выберите офис' }}
          MenuProps={{
            slotProps: {
              paper: {
                sx: {
                  minWidth: 260,
                  mt: 1,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(16, 24, 40, 0.12)',
                },
              },
              list: { sx: { p: 1 } },
            },
          }}
          sx={{
            width: 'fit-content',
            minWidth: 180,
            color: 'text.primary',
            fontSize: { xs: 18, md: 22 },
            fontWeight: 700,
            lineHeight: 1.2,
            '& .MuiSelect-select': { minHeight: 'unset', py: 0, pr: '30px !important', pl: 0 },
            '& .MuiSelect-icon': { right: 0, color: 'text.primary', fontSize: 24 },
          }}
          renderValue={(officeId) =>
            offices.find((office) => office.id === officeId)?.name ??
            'Выберите офис'
          }
        >
          {offices.map((office) => (
            <MenuItem
              key={office.id}
              value={office.id}
              sx={{
                minHeight: 44,
                px: 2,
                borderRadius: 1,
                fontSize: 16,
                '&.Mui-selected': {
                  color: 'primary.main',
                  bgcolor: 'rgba(0, 156, 140, 0.08)',
                  fontWeight: 600,
                },
                '&.Mui-selected:hover': { bgcolor: 'rgba(0, 156, 140, 0.12)' },
              }}
            >
              {office.name}
            </MenuItem>
          ))}
        </Select>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
          <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 14 } }}>
            {selectedOffice?.address ?? 'Адрес не выбран'}
          </Typography>
          <Box
            component="span"
            aria-hidden="true"
            sx={{ width: 4, height: 4, flexShrink: 0, bgcolor: '#98a2b3', borderRadius: '50%' }}
          />
          <Typography variant="body2" sx={{ fontSize: { xs: 12, md: 14 } }}>
            {selectedOffice
              ? `Местное время: ${getOfficeLocalTime(selectedOffice)}`
              : 'Местное время: --'}
          </Typography>
        </Stack>
      </Stack>
    </Container>
  )
}
