import { Box, Container, Typography } from '@mui/material'

export default function ScheduleRoom(){
  return (
    <Container
      component="section"
      variant="outlined"
      sx={{
        width: '100%',
        maxWidth: 420,
        minHeight: 260,
        p: { xs: 2.5, sm: 4 },
        bgcolor: 'background.paper',
        borderColor: 'divider',
        borderRadius: 2.5,
        boxShadow: 'none',
      }}
    >
      <Box>
        <Typography
          component={'h1'}
          sx={{
            fontWeight: 800,
            fontSize: 20,

          }}
        >
          Расписание на день
        </Typography>
      </Box>
    </Container>
  )
}