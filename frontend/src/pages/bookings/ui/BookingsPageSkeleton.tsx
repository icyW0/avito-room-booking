import { Box, Card, Container, Skeleton, Stack } from '@mui/material'

export function BookingsPageSkeleton() {
  return (
    <Box
      component="main"
      aria-label="Загрузка бронирований"
      sx={{
        minHeight: 'calc(100vh - 72px)',
        bgcolor: 'background.default',
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          px: { xs: 2, md: 5 },
          py: { xs: 3, md: 5 },
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Skeleton
            variant="rounded"
            width={394}
            height={48}
            sx={{ maxWidth: '100%' }}
          />

          <Stack direction="row" spacing={2}>
            <Skeleton variant="rounded" width={168} height={52} />
            <Skeleton variant="rounded" width={188} height={52} />
          </Stack>
        </Stack>

        <Stack
          direction="row"
          spacing={4}
          sx={{
            mt: 4,
            minHeight: 56,
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Skeleton variant="rounded" width={210} height={26} />
          <Skeleton variant="rounded" width={158} height={26} />
        </Stack>

        <Stack spacing={2.5} sx={{ mt: 4 }}>
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </Stack>
      </Container>
    </Box>
  )
}

function BookingCardSkeleton() {
  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        minHeight: 168,
        p: { xs: 2, md: 3 },
        gap: { xs: 2, md: 3 },
        alignItems: 'center',
        borderColor: 'divider',
        borderRadius: 2.5,
        boxShadow: 'none',
      }}
    >
      <Skeleton
        variant="rounded"
        width={104}
        height={104}
        sx={{ flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Skeleton
          variant="rounded"
          width={524}
          height={26}
          sx={{ maxWidth: '80%' }}
        />

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Skeleton variant="rounded" width={132} height={20} />
          <Skeleton variant="rounded" width={92} height={20} />
          <Skeleton variant="rounded" width={210} height={20} />
        </Stack>
      </Box>

      <Skeleton
        variant="rounded"
        width={132}
        height={52}
        sx={{ flexShrink: 0 }}
      />
    </Card>
  )
}
