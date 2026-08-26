import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Box,
  Container,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { useState } from 'react'

const offices = [
  {
    id: 'office-moscow',
    name: 'Офис Москва',
    address: 'ул. Лесная 7',
    localTime: '14:35 MSK',
  },
  {
    id: 'office-saint-petersburg',
    name: 'Офис Санкт-Петербург',
    address: 'наб. реки Карповки, 5',
    localTime: '14:35 MSK',
  },
]

export function OfficeSelector() {
  const [selectedOfficeId, setSelectedOfficeId] = useState('office-moscow')

  const selectedOffice =
    offices.find((office) => office.id === selectedOfficeId) ?? offices[0]

  return (
    <Container
      component="section"
      maxWidth={false}
      disableGutters
      sx={{
        display: 'flex',
        height: 95,
        px: {
          xs: 2,
          md: 5,
        },
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Stack spacing={0.75}>
        <Select
          value={selectedOfficeId}
          onChange={(event) => {
            setSelectedOfficeId(event.target.value)
          }}
          variant="standard"
          disableUnderline
          IconComponent={ExpandMoreIcon}
          inputProps={{
            'aria-label': 'Выберите офис',
          }}
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
              list: {
                sx: {
                  p: 1,
                },
              },
            },
          }}
          sx={{
            width: 'fit-content',
            minWidth: 180,
            color: 'text.primary',
            fontSize: {
              xs: 18,
              md: 22,
            },
            fontWeight: 700,
            lineHeight: 1.2,

            '& .MuiSelect-select': {
              minHeight: 'unset',
              py: 0,
              pr: '30px !important',
              pl: 0,
            },

            '& .MuiSelect-icon': {
              right: 0,
              color: 'text.primary',
              fontSize: 24,
            },
          }}
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

                '&.Mui-selected:hover': {
                  bgcolor: 'rgba(0, 156, 140, 0.12)',
                },
              }}
            >
              {office.name}
            </MenuItem>
          ))}
        </Select>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
            color: 'text.secondary',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: {
                xs: 12,
                md: 14,
              },
            }}
          >
            {selectedOffice.address}
          </Typography>

          <Box
            component="span"
            aria-hidden="true"
            sx={{
              width: 4,
              height: 4,
              flexShrink: 0,
              bgcolor: '#98a2b3',
              borderRadius: '50%',
            }}
          />

          <Typography
            variant="body2"
            sx={{
              fontSize: {
                xs: 12,
                md: 14,
              },
            }}
          >
            Местное время: {selectedOffice.localTime}
          </Typography>
        </Stack>
      </Stack>
    </Container>
  )
}
