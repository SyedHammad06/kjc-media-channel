import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image';
import KJC from '../public/images/clg.jpg';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Email from '@mui/icons-material/Email';
import InputAdornment from '@mui/material/InputAdornment';
import Password from '@mui/icons-material/Password';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'primary.main',
        '& > *': {
          flex: '50%',
          minHeight: '100vh',
        },
      }}
    >
      <Box
        sx={{
          paddingX: 10,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'secondary.main',
            padding: 2,
            width: '100%',
            boxShadow: 2,
            textAlign: 'center',
            borderRadius: '1rem',
            fontSize: '1.4rem',
          }}
        >
          <Typography
            variant='h1'
            component='h1'
            color='primary'
            sx={{
              textShadow: '2px 2px 2px rgba(0, 0, 0, 0.35)',
              marginBottom: 5,
            }}
          >
            Login
          </Typography>
          <FormControl sx={{ width: '90%' }}>
            <FormControl sx={{ marginBottom: 3 }}>
              <InputLabel
                htmlFor='email'
                sx={{ fontSize: '1.3rem', fontWeight: '500' }}
              >
                Enter Email
              </InputLabel>
              <OutlinedInput
                id='email'
                type='email'
                label='enter email'
                startAdornment={
                  <InputAdornment position='start'>
                    <Email color='primary' />
                  </InputAdornment>
                }
                sx={{ fontSize: '1.3rem' }}
                required
                fullWidth
              />
            </FormControl>
            <FormControl sx={{ marginBottom: 3 }}>
              <InputLabel
                htmlFor='Password'
                sx={{ fontSize: '1.3rem', fontWeight: '500' }}
              >
                Enter Password
              </InputLabel>
              <OutlinedInput
                id='Password'
                type={showPassword ? 'text' : 'password'}
                label='enter Password'
                startAdornment={
                  <InputAdornment position='start'>
                    <Password color='primary' />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowPassword(!showPassword)}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{ fontSize: '1.3rem', paddingRight: 2 }}
                required
                fullWidth
              />
            </FormControl>
            <Button
              variant='contained'
              type='submit'
              sx={{
                fontSize: '1.2rem',
                marginTop: 2,
                marginBottom: 1.5,
              }}
            >
              Login
            </Button>
          </FormControl>
          <Typography
            variant='h6'
            component='p'
            color='primary'
            sx={{ marginTop: 2, marginBottom: 1 }}
          >
            New User?{' '}
            <Link
              href='/signup'
              color='inherit'
              underline='none'
              sx={{
                fontWeight: 500,
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <Image src={KJC} layout='fill' alt='kjc image' objectFit='cover' />
      </Box>
    </Box>
  );
}
