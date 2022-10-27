import Logout from '@mui/icons-material/Logout';
import Edit from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, FormEvent } from 'react';

type User = {
  id: string;
  regNo?: string;
  username: string;
  email: string;
  designation?: string;
  phoneNo: number;
  password: string;
  department: string;
  makePost: boolean;
};

const Profile: NextPage = () => {
  const router = useRouter();

  const [user, setUser] = useState<User>();
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const regNoRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const departmentRef = useRef<HTMLInputElement>(null);
  const designationRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getUserDetails();
  }, []);

  const logout = () => {
    router.replace('/');
  };

  const editProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      regNoRef.current &&
      usernameRef.current &&
      emailRef.current &&
      phoneRef.current &&
      passwordRef.current &&
      departmentRef.current
    ) {
      try {
        const body = {
          regNo: regNoRef.current.value,
          username: usernameRef.current.value,
          email: emailRef.current.value,
          phoneNo: phoneRef.current.value,
          password: passwordRef.current.value,
          department: departmentRef.current.value,
        };
        const userRes = await axios
          .put(`https://localhost:7168/api/User/${router.query.id}`, body)
          .then((res) => res.data);
        if (userRes) {
          setShowDialog(false);
          getUserDetails();
        }
      } catch (error: any) {
        setError(error.message);
      }
    } else if (
      designationRef.current &&
      usernameRef.current &&
      emailRef.current &&
      phoneRef.current &&
      passwordRef.current &&
      departmentRef.current
    ) {
      try {
        const body = {
          designation: designationRef.current.value,
          username: usernameRef.current.value,
          email: emailRef.current.value,
          phoneNo: phoneRef.current.value,
          password: passwordRef.current.value,
          department: departmentRef.current.value,
        };
        const adminRes = await axios
          .put(`https://localhost:7168/api/Admin/${router.query.id}`, body)
          .then((res) => res.data);
        if (adminRes) {
          setShowDialog(false);
          getUserDetails();
        }
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const getUserDetails = async () => {
    try {
      const admin = await axios
        .get(`https://localhost:7168/api/Admin/${router.query.id}`)
        .then((res) => res.data);
      if (admin) {
        setAdmin(true);
        setUser(admin);
      }
    } catch (error) {
      try {
        const user = await axios
          .get(`https://localhost:7168/api/User/${router.query.id}`)
          .then((res) => res.data);
        if (user) setUser(user);
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  return (
    <>
      <Box>
        <Typography variant='h4' component='h2' sx={{ fontWeight: 600 }}>
          Profile
        </Typography>
        <Box
          sx={{
            width: '100%',
            minHeight: '80vh',
            textAlign: 'center',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Avatar
              sx={{
                backgroundColor: 'neutral.main',
                width: '10rem',
                height: '10rem',
                marginX: 'auto',
                marginBottom: 2,
              }}
            >
              <Typography variant='h1' component='h3'>
                {user ? user?.username.charAt(0) : ''}
              </Typography>
            </Avatar>
            <Typography
              color='primary'
              variant='h5'
              component='h3'
              sx={{ fontWeight: 500, marginTop: 4 }}
            >
              {user ? user?.username : ''}
            </Typography>
            <Typography
              color='primary'
              variant='h6'
              component='h3'
              sx={{ marginY: 1 }}
            >
              {user
                ? user.regNo
                  ? `Register number: ${user.regNo}`
                  : `Department: ${user.department}`
                : ''}
            </Typography>
            <Typography
              color='primary'
              variant='h6'
              component='h3'
              sx={{ marginY: 1 }}
            >
              {user
                ? user.regNo
                  ? null
                  : `Designation: ${user.designation}`
                : ''}
            </Typography>
            <Typography color='primary' variant='h6' component='h3'>
              {user ? user.email : ''}
            </Typography>
            <Box
              sx={{
                width: '60%',
                marginX: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 4,
                marginTop: 4,
              }}
            >
              <Button
                fullWidth
                variant='contained'
                startIcon={<Logout />}
                onClick={logout}
                sx={{ padding: 1.5, fontSize: '1rem' }}
              >
                Logout
              </Button>
              <Button
                fullWidth
                variant='contained'
                startIcon={<Edit />}
                onClick={() => setShowDialog(true)}
                sx={{ padding: 1.5, fontSize: '1rem' }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Dialog
        maxWidth='md'
        fullWidth
        open={showDialog}
        onClose={() => setShowDialog(false)}
      >
        <DialogTitle>
          <Typography
            color='primary'
            variant='h6'
            component='p'
            sx={{ fontWeight: 500 }}
          >
            Registration Details
          </Typography>
        </DialogTitle>
        <form onSubmit={(e) => editProfile(e)}>
          <DialogContent>
            {admin ? (
              <TextField
                autoFocus
                margin='dense'
                label='Designation'
                type='text'
                fullWidth
                variant='outlined'
                inputRef={designationRef}
                required
              />
            ) : (
              <TextField
                autoFocus
                margin='dense'
                label='Register Number'
                type='text'
                fullWidth
                variant='outlined'
                inputRef={regNoRef}
                required
              />
            )}
            <TextField
              margin='dense'
              label='Username'
              type='text'
              fullWidth
              variant='outlined'
              autoComplete='off'
              inputRef={usernameRef}
              required
            />
            <TextField
              margin='dense'
              label='Email Address'
              type='email'
              fullWidth
              variant='outlined'
              inputRef={emailRef}
              required
            />
            <TextField
              margin='dense'
              label='Phone Number'
              type='number'
              fullWidth
              variant='outlined'
              inputRef={phoneRef}
              required
            />
            <TextField
              margin='dense'
              label='Password'
              type='text'
              fullWidth
              variant='outlined'
              inputRef={passwordRef}
              required
            />
            <TextField
              margin='dense'
              label='Department'
              type='text'
              fullWidth
              variant='outlined'
              inputRef={departmentRef}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button variant='contained' color='primary' type='submit'>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {error ? <ErrorDisplay error={error} setError={setError} /> : null}
    </>
  );
};

export default Profile;
