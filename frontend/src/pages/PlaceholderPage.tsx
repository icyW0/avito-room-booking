import { Container, Paper, Stack, Typography } from '@mui/material'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Stack spacing={1}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography color="text.secondary">
            Каркас страницы готов к реализации.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  )
}
