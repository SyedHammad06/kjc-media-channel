import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { EventType } from '.';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import BarChart from '@mui/icons-material/BarChart';
import Tooltip from '@mui/material/Tooltip';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TableCell from '@mui/material/TableCell';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getTouchRippleUtilityClass, TableBody } from '@mui/material';

type RegistrationType = {
  id: string;
  eventId: string;
  registrationTime: string;
  regno: string;
  username: string;
  department: string;
};

const CustomCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '1rem',
  color: theme.palette.secondary.main,
  userSelect: 'none',
  '&:hover': {
    cursor: 'pointer',
  },
}));

const EventDetails: NextPage = () => {
  const router = useRouter();
  const { userId } = useAuth();

  const [event, setEvent] = useState<EventType>();
  const [username, setUsername] = useState('');
  const [admin, setAdmin] = useState(false);
  const [registrations, setRegistrations] = useState<RegistrationType[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [department, setDepartment] = useState('');
  const [registered, setRegistered] = useState(false);
  const [regno, setRegno] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const adminRes = await axios
          .get(`https://localhost:7168/api/Admin/${userId}`)
          .then((res) => res.data);
        if (adminRes) {
          setAdmin(true);
          setUsername(adminRes.username);
          setDepartment(adminRes.department);
        }
      } catch (error) {
        const userRes = await axios
          .get(`https://localhost:7168/api/User/${userId}`)
          .then((res) => res.data);
        if (userRes) {
          setUsername(userRes.username);
          setRegno(userRes.regNo);
          setDepartment(userRes.department);
        }
      }
      getEvents();
    })();
  }, []);

  const getEvents = async () => {
    try {
      const eventRes = await axios
        .get(`https://localhost:7168/api/Event/${router.query.id}`)
        .then((res) => res.data);
      if (eventRes) setEvent(eventRes);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const registration = async (id: string) => {
    try {
      const registrationR = await axios.get(
        `https://localhost:7168/api/Registration/${id}/${username}`
      );
      if (registrationR.data === 'Not Found') {
        const body = {
          eventId: id,
          regno: regno,
          username: username,
          department: department,
        };
        console.log(body);
        const registrationRes = await axios.post(
          'https://localhost:7168/api/Registration',
          body
        );
        if (registrationRes) {
          setRegistered(true);
          const updateSlots = await axios.put(
            `https://localhost:7168/api/Event/slots/${id}/true`
          );
          getEvents();
        }
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const getRegistrations = async (id: string) => {
    try {
      const registrationsRes = await axios
        .get(`https://localhost:7168/api/Registration/${id}`)
        .then((res) => res.data);
      setRegistrations(registrationsRes);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Typography
            variant='h4'
            color='primary'
            component='h2'
            sx={{ fontWeight: 600 }}
          >
            Event Details
          </Typography>
          {admin ? (
            <Tooltip title='Registration Details' placement='top'>
              <IconButton
                aria-label='registration details'
                size='large'
                onClick={() => {
                  setShowDialog(true);
                  getRegistrations(event ? event.id : '');
                }}
              >
                <BarChart color='primary' fontSize='inherit' />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>
        {event ? (
          <CustomCard sx={{ width: '100%', marginTop: 3 }}>
            <CardMedia
              component='img'
              height='240'
              image={event.imageLocation}
              alt='event image'
            />
            <CardContent>
              <Typography
                gutterBottom
                color='secondary'
                variant='h5'
                component='h3'
                sx={{ fontWeight: 600 }}
              >
                {event.title}
              </Typography>
              <Typography
                variant='subtitle2'
                component='p'
                sx={{ marginBottom: 2 }}
              >
                Hosted by: {event.department} Department
              </Typography>
              <Typography variant='body1' component='p' sx={{ color: '#fff' }}>
                {event.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ paddingX: 2, paddingBottom: 2 }}>
              <Button
                fullWidth
                disableRipple
                disableFocusRipple
                color='secondary'
                variant='contained'
                sx={{
                  borderRadius: '0.6rem',
                  marginRight: 0.5,
                  '&:hover': {
                    cursor: 'default',
                    backgroundColor: 'secondary.main',
                  },
                }}
              >
                Slots Available: {event.maxSlots - event.currentSlots}
              </Button>
              <Button
                fullWidth
                color='secondary'
                variant='contained'
                onClick={() => registration(event.id)}
                sx={{ borderRadius: '0.6rem', marginLeft: 0.5 }}
              >
                {registered ? 'Registered Successfully!' : 'Register'}
              </Button>
            </CardActions>
          </CustomCard>
        ) : null}
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
        <DialogContent>
          <TableContainer>
            <Table aria-label='registration details'>
              <TableHead>
                <TableRow>
                  <TableCell>Regno</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Registration Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrations.map((el: RegistrationType) => (
                  <TableRow key={el.id}>
                    <TableCell>{el.regno}</TableCell>
                    <TableCell>{el.username}</TableCell>
                    <TableCell>{el.department}</TableCell>
                    <TableCell>
                      {new Date(el.registrationTime).toLocaleString('en-UK', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour12: true,
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
      {error ? <ErrorDisplay error={error} setError={setError} /> : null}
    </>
  );
};

export default EventDetails;
