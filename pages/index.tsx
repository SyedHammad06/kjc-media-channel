import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image';
import KJC from '../public/images/clg.jpg';

export default function Home() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        gap: '2rem',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'primary.main',
        '& > *': {
          flex: '100%',
          minHeight: '100vh',
        },
      }}
    >
      <Container maxWidth='lg' sx={{ paddingY: 2, width: '100%' }}>
        <Box
          sx={{ backgroundColor: 'secondary.main', padding: 2, width: '100%' }}
        >
          <Typography
            variant='h1'
            component='h1'
            color='primary'
            sx={{ textShadow: '2px 2px 4px grey' }}
          >
            Login
          </Typography>
        </Box>
      </Container>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          backgroundColor: 'blue',
        }}
      >
        <Image src={KJC} layout='fill' alt='kjc image' objectFit='cover' />
      </Box>
    </Box>
  );
}
