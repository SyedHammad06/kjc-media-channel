import { NextPage } from 'next';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import Box from '@mui/system/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Newspaper from '@mui/icons-material/Newspaper';
import axios from 'axios';
import Link from 'next/link';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ErrorDisplay } from './ErrorDisplay';

type newsType = {
  id: string;
  title: string;
  description: string;
  imageLocation: string;
};

export const RightBar: NextPage = () => {
  const { userId } = useAuth();

  const [news, setNews] = useState<newsType[]>([]);
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const newsRes = await axios
        .get('https://localhost:7168/api/News')
        .then((res) => res.data);
      setNews(newsRes);
      try {
        const adminRes = await axios
          .get(`https://localhost:7168/api/Admin/${userId}`)
          .then((res) => res.data);
        if (adminRes) {
          setAdmin(true);
        }
      } catch (error) {}
    })();
  }, []);

  const addNews = async () => {
    console.log('this runs');
    if (titleRef.current && descriptionRef.current && imageRef.current) {
      const body = {
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        imageLocation: imageRef.current.value,
      };
      console.log(body);
      try {
        const newsRes = await axios
          .post('https://localhost:7168/api/News', body)
          .then((res) => res.data);
        if (newsRes) {
          setNews([newsRes, ...news]);
        }
        setDialogOpen(false);
      } catch (error: any) {
        setError(error.message);
        setDialogOpen(false);
      }
    }
  };

  const deleteNews = async (id: string) => {
    try {
      const newsRes = await axios
        .delete(`https://localhost:7168/api/News/${id}`)
        .then((res) => res.data);
      setNews(news.filter((el) => el.id !== newsRes.id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '24%',
          backgroundColor: 'primary.main',
          color: 'secondary.main',
        }}
      >
        <Box
          sx={{
            color: 'inherit',
            padding: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Newspaper fontSize='large' />
            <Typography variant='h5' component='p'>
              News Highlights
            </Typography>
          </Box>
          <Box sx={{ marginTop: 3 }}>
            {news.map((el) => (
              <Paper
                key={el.id}
                sx={{
                  marginY: 2,
                  padding: 1.5,
                  color: '#fff',
                  borderRadius: '1rem',
                  backgroundColor: 'neutral.main',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '.5rem',
                }}
              >
                <Link href={`/news/${el.id}`}>
                  <Typography
                    variant='body1'
                    component='p'
                    sx={{
                      userSelect: 'none',
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    {el.title}
                  </Typography>
                </Link>
                {admin ? (
                  <Box
                    onClick={() => deleteNews(el.id)}
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <Delete color='secondary' />
                  </Box>
                ) : null}
              </Paper>
            ))}
          </Box>
          {admin ? (
            <Box sx={{ width: '100%', textAlign: 'center', marginTop: 2 }}>
              <Fab
                aria-label='add news'
                onClick={() => setDialogOpen(true)}
                sx={{
                  backgroundColor: 'neutral.main',
                  color: '#fff',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <AddIcon />
              </Fab>
            </Box>
          ) : null}
        </Box>
      </Box>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          <Typography
            variant='h5'
            component='p'
            sx={{ color: 'primary.main', fontWeight: 600 }}
          >
            Add News
          </Typography>
        </DialogTitle>
        <form onSubmit={addNews}>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='Title'
              type='text'
              fullWidth
              variant='outlined'
              inputRef={titleRef}
              required
            />
            <TextField
              margin='dense'
              id='name'
              label='Description'
              type='text'
              fullWidth
              variant='outlined'
              multiline
              rows={4}
              autoComplete='off'
              inputRef={descriptionRef}
              required
            />
            <TextField
              margin='dense'
              id='name'
              label='Image URL'
              type='url'
              fullWidth
              variant='outlined'
              inputRef={imageRef}
              required
            />
          </DialogContent>
          <DialogActions>
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
