import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, FormEvent } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { ErrorDisplay } from '../../components/ErrorDisplay';

export type EventType = {
  id: string;
  userId: string;
  description: string;
  title: string;
  department: string;
  maxSlots: number;
  currentSlots: number;
  imageLocation: string;
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

const EventsPage: NextPage = () => {
  const router = useRouter();
  const { userId } = useAuth();

  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [department, setDepartment] = useState('');
  const [events, setEvents] = useState<EventType[]>([]);

  const descriptionRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const maxSlotsRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const admin = await axios.get(
          `https://localhost:7168/api/Admin/${userId}`
        );
        if (admin.data) {
          setAdmin(true);
          setDepartment(admin.data.department);
        }
      } catch (error) {
        const user = await axios.get(
          `https://localhost:7168/api/User/${userId}`
        );
        if (user.data) {
          setDepartment(user.data.department);
        }
      }
      getEvents();
    })();
  }, []);

  const getEvents = async () => {
    try {
      const eventRes = await axios
        .get('https://localhost:7168/api/Event')
        .then((res) => res.data);
      if (eventRes) setEvents(eventRes);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const deleteRes = await axios
        .delete(`https://localhost:7168/api/Event/${id}`)
        .then((res) => res.data);
      getEvents();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const addEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (
        titleRef.current &&
        descriptionRef.current &&
        maxSlotsRef.current &&
        imageRef.current
      ) {
        const body = {
          userId: userId,
          description: descriptionRef.current.value,
          title: titleRef.current.value,
          department: department,
          maxSlots: maxSlotsRef.current.value,
          imageLocation: imageRef.current.value,
        };
        const eventRes = await axios
          .post('https://localhost:7168/api/Event', body)
          .then((res) => res.data);

        if (eventRes) getEvents();
        setDialogOpen(false);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <Box
        sx={{
          w: '100%',
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
          Events:
        </Typography>
        {admin ? (
          <Button
            variant='contained'
            sx={{ borderRadius: '1rem' }}
            onClick={() => setDialogOpen(true)}
          >
            Add Event
          </Button>
        ) : null}
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {events.map((el: EventType) => (
          <Grid item xs={6} key={el.id}>
            <CustomCard onClick={() => router.push(`events/${el.id}`)}>
              <CardMedia
                component='img'
                height='160'
                image={el.imageLocation}
                alt='event image'
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant='h5'
                  component='h3'
                  sx={{ fontWeight: 500 }}
                >
                  {el.title}
                </Typography>
                <Typography
                  variant='body2'
                  component='div'
                  sx={{
                    color: '#fff',
                    width: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '3.5rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {el.description}
                  </Box>
                </Typography>
              </CardContent>
              {admin ? (
                <CardActions
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton
                    aria-label='delete'
                    onClick={() => deleteEvent(el.id)}
                  >
                    <Delete color='secondary' />
                  </IconButton>
                </CardActions>
              ) : null}
            </CustomCard>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>
          <Typography
            variant='h5'
            component='p'
            sx={{ color: 'primary.main', fontWeight: 600 }}
          >
            Add Post
          </Typography>
        </DialogTitle>
        <form onSubmit={(e) => addEvent(e)}>
          <DialogContent>
            <TextField
              margin='dense'
              label='Title'
              type='text'
              fullWidth
              variant='outlined'
              inputRef={titleRef}
              required
            />
            <TextField
              margin='dense'
              label='Description'
              type='text'
              fullWidth
              variant='outlined'
              multiline
              rows={5}
              autoComplete='off'
              inputRef={descriptionRef}
              required
            />
            <TextField
              margin='dense'
              label='Max Slots'
              type='number'
              fullWidth
              variant='outlined'
              autoComplete='off'
              inputRef={maxSlotsRef}
              required
            />
            <TextField
              margin='dense'
              label='Image URL'
              type='text'
              fullWidth
              variant='outlined'
              inputRef={imageRef}
              required
            />
          </DialogContent>
          <DialogActions sx={{ marginTop: 2 }}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setDialogOpen(false)}
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

export default EventsPage;
