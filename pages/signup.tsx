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
import { FormEvent, useEffect, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Phone from '@mui/icons-material/Phone';
import Numbers from '@mui/icons-material/Numbers';
import AccountCircle from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { NextPage } from 'next';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type departmentsType = {
  value: string;
  label: string;
};

const Signup: NextPage = () => {
  const router = useRouter();

  const { setUserId } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState('BA');
  const [error, setError] = useState('');
  const [departmentsArr, setDepartmentArr] = useState<departmentsType[]>([]);

  const usernameRef = useRef<HTMLInputElement>(null);
  const registerRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios
      .get('https://localhost:7168/api/Department')
      .then((res) => {
        setDepartmentArr(
          res.data.map((el: any) => {
            return {
              label: el.acronym,
              value: el.acronym,
            };
          })
        );
      })
      .catch((error) => setError('Bad Request'));
  }, []);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      usernameRef.current &&
      registerRef.current &&
      emailRef.current &&
      phoneRef.current &&
      passwordRef.current &&
      confirmPasswordRef.current &&
      passwordRef.current.value === confirmPasswordRef.current.value
    ) {
      const body = {
        regNo: registerRef.current.value,
        username: usernameRef.current.value,
        email: emailRef.current.value,
        phoneNo: Number(phoneRef.current.value),
        department: department,
        password: passwordRef.current.value,
      };
      try {
        const user = await axios.post('https://localhost:7168/api/User', body);
        if (user.data.id) {
          setUserId(user.data.id);
          router.push('/home');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          backgroundColor: 'primary.main',
          '& > *': {
            flex: '50%',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '140vh',
            position: 'relative',
          }}
        >
          <Image src={KJC} layout='fill' alt='kjc image' objectFit='cover' />
        </Box>
        <Box
          sx={{
            paddingX: 10,
            paddingY: 6,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'block',
              backgroundColor: 'secondary.main',
              padding: 2,
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
              Sign up
            </Typography>
            <form onSubmit={(e) => submitHandler(e)}>
              <FormControl sx={{ width: '90%' }}>
                <FormControl sx={{ marginBottom: 2 }}>
                  <InputLabel
                    htmlFor='username'
                    sx={{ fontSize: '1.3rem', fontWeight: '500' }}
                  >
                    Enter Username
                  </InputLabel>
                  <OutlinedInput
                    id='username'
                    type='text'
                    label='enter username'
                    startAdornment={
                      <InputAdornment position='start'>
                        <AccountCircle color='primary' />
                      </InputAdornment>
                    }
                    inputRef={usernameRef}
                    sx={{ fontSize: '1.3rem' }}
                    required
                    fullWidth
                  />
                </FormControl>
                <FormControl sx={{ marginBottom: 2 }}>
                  <InputLabel
                    htmlFor='regno'
                    sx={{ fontSize: '1.3rem', fontWeight: '500' }}
                  >
                    Enter Register Number
                  </InputLabel>
                  <OutlinedInput
                    id='regno'
                    type='text'
                    label='enter register number'
                    inputProps={{
                      minLength: 10,
                      maxLength: 10,
                    }}
                    startAdornment={
                      <InputAdornment position='start'>
                        <Numbers color='primary' />
                      </InputAdornment>
                    }
                    inputRef={registerRef}
                    sx={{ fontSize: '1.3rem' }}
                    required
                    fullWidth
                  />
                </FormControl>
                <FormControl sx={{ marginBottom: 2 }}>
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
                    inputRef={emailRef}
                    required
                    fullWidth
                  />
                </FormControl>
                <FormControl sx={{ marginBottom: 2 }}>
                  <InputLabel
                    htmlFor='phone'
                    sx={{ fontSize: '1.3rem', fontWeight: '500' }}
                  >
                    Enter Phone Number
                  </InputLabel>
                  <OutlinedInput
                    id='phone'
                    type='tel'
                    label='enter phone number'
                    startAdornment={
                      <InputAdornment position='start'>
                        <Phone color='primary' />
                      </InputAdornment>
                    }
                    inputProps={{
                      minLength: 10,
                    }}
                    inputRef={phoneRef}
                    sx={{ fontSize: '1.3rem' }}
                    required
                    fullWidth
                  />
                </FormControl>
                <FormControl sx={{ marginBottom: 2 }}>
                  <TextField
                    id='department'
                    select
                    label='Department'
                    value={department}
                    color='primary'
                    sx={{
                      textAlign: 'left',
                      '& > div': {
                        color: 'primary.main',
                        fontWeight: 500,
                      },
                    }}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {departmentsArr.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
                <FormControl sx={{ marginBottom: 2 }}>
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
                    inputRef={passwordRef}
                    inputProps={{
                      minLength: 8,
                    }}
                    sx={{ fontSize: '1.3rem', paddingRight: 2 }}
                    required
                    fullWidth
                  />
                </FormControl>
                <FormControl sx={{ marginBottom: 2 }}>
                  <InputLabel
                    htmlFor='ConfirmPassword'
                    sx={{ fontSize: '1.3rem', fontWeight: '500' }}
                  >
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id='ConfirmPassword'
                    type='text'
                    label='confirm Password'
                    startAdornment={
                      <InputAdornment position='start'>
                        <Password color='primary' />
                      </InputAdornment>
                    }
                    sx={{ fontSize: '1.3rem', paddingRight: 2 }}
                    inputProps={{
                      minLength: 8,
                    }}
                    inputRef={confirmPasswordRef}
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
                  Sign up
                </Button>
              </FormControl>
            </form>
            <Typography
              variant='h6'
              component='p'
              color='primary'
              sx={{ marginTop: 1, marginBottom: 1 }}
            >
              Already have an account?{' '}
              <Link
                href='/'
                color='inherit'
                underline='none'
                sx={{
                  fontWeight: 500,
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      {error ? (
        <Snackbar
          open={error ? true : false}
          autoHideDuration={4000}
          onClose={() => setError('')}
        >
          <Alert severity='error' variant='filled' onClose={() => setError('')}>
            {error}
          </Alert>
        </Snackbar>
      ) : null}
    </>
  );
};

export default Signup;
