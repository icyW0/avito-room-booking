import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { Box, Button, Container, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <Container
      component="main"
      maxWidth={false}
      disableGutters
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: 'calc(100vh - 94px)',
        px: 2,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          sx={{
            color: 'primary.main',
            fontWeight: 800,
            fontSize: { xs: 88, sm: 120 },
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography
          component="h2"
          sx={{
            fontWeight: 800,
            fontSize: 28,
          }}
        >
          Страница не найдена
        </Typography>
        <Typography
          component="p"
          sx={{
            maxWidth: 480,
            fontWeight: 400,
            fontSize: 16,
            textAlign: 'center',
          }}
        >
          Запрашиваемая страница не существует, была удалена или перенесена на
          другой адрес.
        </Typography>
      </Box>

      <Button
        component={Link}
        to="/rooms"
        variant="contained"
        startIcon={<HomeOutlinedIcon />}
        sx={{
          width: { xs: '100%', sm: 376 },
          maxWidth: 376,
          height: 64,
          mt: 5,
          borderRadius: 1,
          fontSize: 18,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',

          '& .MuiButton-startIcon': {
            mr: 1.5,
          },

          '& .MuiSvgIcon-root': {
            width: 24,
            height: 24,
          },
        }}
      >
        Вернуться к переговорным
      </Button>
    </Container>
  )
}
