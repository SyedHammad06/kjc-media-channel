import { NextPage } from 'next';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useState, useEffect, useRef, FormEvent } from 'react';
import Comment from '@mui/icons-material/Comment';
import CommentOutlined from '@mui/icons-material/CommentOutlined';
import Send from '@mui/icons-material/Send';
import ThumbDown from '@mui/icons-material/ThumbDown';
import ThumbUp from '@mui/icons-material/ThumbUp';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Delete from '@mui/icons-material/Delete';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ErrorDisplay } from '../components/ErrorDisplay';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useRouter } from 'next/router';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

type CommentType = {
  id: string;
  postId: string;
  description: string;
  username: string;
};

type PostType = {
  id: string;
  userId: string;
  description: string;
  department: string;
  likes: number;
  dislikes: number;
  createdDate: Date;
  imageLocation: string;
  liked: boolean;
  disliked: boolean;
  expanded: boolean;
  comments: CommentType[];
};

const TextFieldCustomized = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    paddingLeft: 2,
    borderRadius: '1rem',

    '& fieldset': {
      borderColor: theme.palette.secondary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.secondary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.secondary.main,
    },
  },
}));

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const HomePage: NextPage = () => {
  const { userId } = useAuth();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('');
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const commentRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

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
          setDepartment(userRes.department);
        }
      }
      getPosts();
    })();
  }, []);

  const handleExpandClick = (id: string) => {
    let post = posts.find((el) => el.id === id);
    if (post) {
      post.expanded ? (post.expanded = false) : (post.expanded = true);
      setPosts(
        posts.filter((el) => {
          if (el.id === id) return post;
          return el;
        })
      );
    }
  };

  const getPosts = async () => {
    try {
      const postRes = await axios
        .get('https://localhost:7168/api/Post')
        .then((res) => res.data);

      const tempPosts: PostType[] = await Promise.all(
        postRes.map(async (el: PostType, i: number) => {
          const commentRes = await axios
            .get(`https://localhost:7168/api/Comment/${el.id}`)
            .then((res) => res.data);

          try {
            const userRes = await axios
              .get(`https://localhost:7168/api/User/${el.userId}`)
              .then((res) => res.data);

            const postBody: PostType = {
              id: el.id,
              userId: await userRes.username,
              description: el.description,
              department: el.department,
              likes: Number(el.likes),
              dislikes: Number(el.dislikes),
              imageLocation: el.imageLocation,
              createdDate: el.createdDate,
              comments: commentRes,
              liked: false,
              disliked: false,
              expanded: false,
            };

            return postBody;
          } catch (error) {
            const userRes = await axios
              .get(`https://localhost:7168/api/Admin/${el.userId}`)
              .then((res) => res.data);

            const postBody: PostType = {
              id: el.id,
              userId: await userRes.username,
              description: el.description,
              department: el.department,
              likes: Number(el.likes),
              dislikes: Number(el.dislikes),
              imageLocation: el.imageLocation,
              createdDate: el.createdDate,
              comments: commentRes,
              liked: false,
              disliked: false,
              expanded: false,
            };

            return postBody;
          }
        })
      );
      setPosts(tempPosts);
    } catch (error) {}
  };

  const updateLikes = async (id: string) => {
    try {
      const post = posts.find((el) => el.id === id);
      if (!post?.disliked) {
        if (post) {
          post.liked ? (post.liked = false) : (post.liked = true);
          post.liked ? post.likes++ : post.likes--;
        }
        const likesRes = await axios.put(
          `https://localhost:7168/api/Post/likes/${id}/${!post?.liked}`
        );
        setPosts(
          posts.filter((el) => {
            if (el.id === id) return post;
            return el;
          })
        );
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const updateDislikes = async (id: string) => {
    try {
      const post = posts.find((el) => el.id === id);
      if (!post?.liked) {
        if (post) {
          post.disliked ? (post.disliked = false) : (post.disliked = true);
          post.disliked ? post.dislikes++ : post.dislikes--;
        }
        const dislikesRes = await axios.put(
          `https://localhost:7168/api/Post/dislikes/${id}/${!post?.disliked}`
        );
        setPosts(
          posts.filter((el) => {
            if (el.id === id) return post;
            return el;
          })
        );
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const addComment = async (id: string) => {
    try {
      if (commentRef.current) {
        const body = {
          postId: id,
          description: commentRef.current.value,
          username,
        };
        const commentRes = await axios
          .post(`https://localhost:7168/api/Comment`, body)
          .then((res) => res.data);
        const post = posts.find((el) => el.id === id);
        if (post) {
          post.comments.push(commentRes);
          setPosts(
            posts.filter((ele) => {
              if (ele.id === id) return post;
              return ele;
            })
          );
        }
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const addPost = async (e: FormEvent) => {
    e.preventDefault();
    if (descriptionRef.current) {
      const body = {
        userId: userId,
        description: descriptionRef.current.value,
        department,
        likes: 0,
        dislikes: 0,
        imageLocation: '',
      };
      try {
        const postRes = await axios.post(
          'https://localhost:7168/api/Post',
          body
        );
        setDialogOpen(false);
        getPosts();
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  const deletePost = async (id: string) => {
    try {
      const deleteRes = await axios.delete(
        `https://localhost:7168/api/Post/${id}`
      );
      getPosts();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
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
          component='h2'
          color='primary'
          sx={{ marginBottom: 3, fontWeight: 600 }}
        >
          Posts:
        </Typography>
        {admin ? (
          <Button
            variant='contained'
            sx={{ borderRadius: '1rem' }}
            onClick={() => setDialogOpen(true)}
          >
            Add Post
          </Button>
        ) : null}
      </Box>
      {posts.map((el) => (
        <Card
          key={el.id}
          sx={{
            width: '100%',
            paddingX: 2,
            paddingTop: 1,
            marginBottom: 3,
            borderRadius: '1rem',
            color: 'secondary.main',
            backgroundColor: 'primary.main',
          }}
          color='primary'
        >
          <CardHeader
            title={el.userId}
            subheader={el.department}
            avatar={
              <Avatar
                sx={{ backgroundColor: 'neutral.main' }}
                aria-label='recipe'
              >
                {el.userId.charAt(0)}
              </Avatar>
            }
            action={
              admin ? (
                <IconButton aria-label='delete'>
                  <Delete color='secondary' onClick={() => deletePost(el.id)} />
                </IconButton>
              ) : null
            }
            sx={{
              color: '#fff',
              borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
              '& span': {
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                '&:last-of-type(span)': {
                  fontSize: '0.6rem',
                },
              },
            }}
          />
          <CardContent>
            <Typography variant='body2' sx={{ textIndent: 20 }}>
              {el.description}
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255, 255, 255, 0.5)',
            }}
          >
            <IconButton aria-label='like' onClick={() => updateLikes(el.id)}>
              {el.liked ? (
                <ThumbUp color='secondary' />
              ) : (
                <ThumbUpOutlinedIcon color='secondary' />
              )}
              <Typography
                variant='body1'
                component='span'
                color='secondary'
                sx={{ fontWeight: 600, marginLeft: 1 }}
              >
                {el.likes}
              </Typography>
            </IconButton>
            <IconButton
              aria-label='dislike'
              onClick={() => updateDislikes(el.id)}
            >
              {el.disliked ? (
                <ThumbDown color='secondary' />
              ) : (
                <ThumbDownOutlinedIcon color='secondary' />
              )}
              <Typography
                variant='body1'
                component='span'
                color='secondary'
                sx={{ fontWeight: 600, marginLeft: 1 }}
              >
                {el.dislikes}
              </Typography>
            </IconButton>
            <ExpandMore
              expand={el.expanded}
              onClick={() => handleExpandClick(el.id)}
              aria-expanded={el.expanded}
              aria-label='show more'
            >
              {el.expanded ? (
                <>
                  <Comment color='secondary' />
                  <Typography
                    variant='body1'
                    component='span'
                    color='secondary'
                    sx={{ fontWeight: 600, marginLeft: 1 }}
                  >
                    {el.comments.length}
                  </Typography>
                </>
              ) : (
                <>
                  <CommentOutlined color='secondary' />
                  <Typography
                    variant='body1'
                    component='span'
                    color='secondary'
                    sx={{ fontWeight: 600, marginLeft: 1 }}
                  >
                    {el.comments.length}
                  </Typography>
                </>
              )}
            </ExpandMore>
          </CardActions>
          <Collapse in={el.expanded} timeout='auto' unmountOnExit>
            <CardContent
              sx={{
                borderTop: '1px solid rgba(255, 255, 255, 0.5)',
                color: '#fff',
              }}
            >
              <Typography variant='body1'>Comments:</Typography>
              {el.comments.map((ele) => (
                <Typography
                  key={ele.id}
                  variant='body2'
                  sx={{ marginY: 1, marginLeft: 2 }}
                >
                  <b>{ele.username}:</b> {ele.description}
                </Typography>
              ))}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  gap: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 2,
                }}
              >
                <TextFieldCustomized
                  fullWidth
                  variant='outlined'
                  placeholder='Enter your comment below'
                  inputRef={commentRef}
                  inputProps={{
                    style: {
                      padding: 10,
                    },
                  }}
                />
                <IconButton
                  aria-label='Submit'
                  size='large'
                  onClick={() => addComment(el.id)}
                >
                  <Send color='secondary' fontSize='inherit' />
                </IconButton>
              </Box>
            </CardContent>
          </Collapse>
        </Card>
      ))}
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
        <form onSubmit={addPost}>
          <DialogContent>
            <TextField
              margin='dense'
              id='name'
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

export default HomePage;
