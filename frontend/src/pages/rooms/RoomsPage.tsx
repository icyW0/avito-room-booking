import { Card, Container, Skeleton, Stack, Typography, Box } from '@mui/material'
import { OfficeSelector } from './ui/OfficeSelector.tsx'

export function RoomsPage(){


  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <OfficeSelector />

      <Container
        maxWidth={false}
        disableGutters
        sx={{
          px: {
            xs: 2,
            md: 5,
          },
          py: {
            xs: 3,
            md: 5,
          },
        }}
      >
        <Box
          component="section"
          aria-labelledby="rooms-loading-title"
          aria-busy="true"
        >
          <Typography
            id="rooms-loading-title"
            component="h1"
            variant="h4"
            sx={{
              mb: 4,
              color: 'text.primary',
              fontSize: {
                xs: 26,
                md: 32,
              },
              fontWeight: 700,
              lineHeight: 1.25,
            }}
          >
            Загрузка переговорных...
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                md: 'repeat(2, minmax(0, 437px))',
                xl: 'repeat(3, 437px)',
              },
              gap: 3,
              alignItems: 'start',
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <RoomCardSkeleton key={index} />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

function RoomCardSkeleton(){
  return (
    <Card
      variant="outlined"
      sx={{
        width: {
          xs: '100%',
          sm: 437,
        },
        height: 254,
        p: 2.5,
        bgcolor: 'background.paper',
        borderColor: '#dbe3ed',
        borderRadius: 2,
        boxShadow: 'none',
      }}
    >
      <Stack sx={{ height: '100%', justifyContent: 'space-between' }}>
        <Stack spacing={0.75}>
          <Skeleton variant="rounded" width={160} height={28} />
          <Skeleton variant="rounded" width={70} height={20} />
        </Stack>

        <Stack spacing={1}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="rounded" width={250} height={20} />
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="rounded" width={250} height={20} />
          </Stack>
        </Stack>

        <Skeleton variant="rounded" width="100%" height={40} />

        <Stack direction="row" spacing={2}>
          <Skeleton variant="rounded" width="50%" height={40} />
          <Skeleton variant="rounded" width="50%" height={40} />
        </Stack>
      </Stack>
    </Card>
  )
}
