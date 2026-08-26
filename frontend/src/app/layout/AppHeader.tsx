import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

export function AppHeader() {
  const { pathname } = useLocation()

  const activeTab = pathname.startsWith('/bookings') ? '/bookings' : '/rooms'

  return (
    <AppBar
      component="header"
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: {
            xs: 2,
            md: 5,
          },
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: {
              xs: 64,
              md: 76,
            },
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              minWidth: {
                xs: 'auto',
                md: 240,
              },
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                width: {
                  xs: 40,
                  md: 48,
                },
                height: {
                  xs: 40,
                  md: 48,
                },
                flexShrink: 0,
                placeItems: 'center',
                color: 'common.white',
                bgcolor: 'primary.main',
                borderRadius: 1.5,
              }}
            >
              <CalendarMonthOutlinedIcon />
            </Box>

            <Typography
              variant="h5"
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                },
                color: 'text.primary',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              BookRoom
            </Typography>
          </Stack>

          <Box
            component="nav"
            aria-label="Основная навигация"
            sx={{
              display: 'flex',
              minWidth: 0,
              flexGrow: 1,
              alignSelf: 'stretch',
              justifyContent: 'center',
            }}
          >
            <Tabs
              value={activeTab}
              centered
              sx={{
                minHeight: '100%',

                '& .MuiTabs-list': {
                  height: '100%',
                },

                '& .MuiTab-root': {
                  minHeight: '100%',
                  px: {
                    xs: 1,
                    sm: 2.5,
                  },
                  color: 'text.secondary',
                  fontSize: {
                    xs: 12,
                    sm: 16,
                  },
                  fontWeight: 500,
                  textTransform: 'none',
                },

                '& .Mui-selected': {
                  color: 'primary.main',
                },

                '& .MuiTabs-indicator': {
                  height: 2,
                },
              }}
            >
              <Tab
                component={Link}
                to="/rooms"
                label="Переговорные"
                value="/rooms"
              />

              <Tab
                component={Link}
                to="/bookings"
                label="Мои бронирования"
                value="/bookings"
              />
            </Tabs>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              minWidth: {
                xs: 'auto',
                md: 240,
              },
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Typography
              sx={{
                display: {
                  xs: 'none',
                  md: 'block',
                },
                color: 'text.primary',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Константин К.
            </Typography>

            <Avatar
              sx={{
                width: {
                  xs: 40,
                  md: 48,
                },
                height: {
                  xs: 40,
                  md: 48,
                },
                bgcolor: '#4f73d9',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              КК
            </Avatar>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
