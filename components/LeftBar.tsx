import { NextPage } from 'next';
import { Logo } from '../public/logo';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import Stack from '@mui/material/Stack';
import Box from '@mui/system/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Notes from '@mui/icons-material/Notes';
import Event from '@mui/icons-material/Event';
import Business from '@mui/icons-material/Business';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Link from 'next/link';

type listItem = {
  icon: JSX.Element;
  text: string;
  link: string;
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.secondary.main,
  padding: `${theme.spacing(2)} 0 ${theme.spacing(2)} 0`,
  border: 'none',
  boxShadow: 'none',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing(3),
  '&:hover': {
    cursor: 'pointer',
  },
}));

export const LeftBar: NextPage = () => {
  const { userId } = useAuth();

  const listItems: listItem[] = [
    {
      icon: <Notes fontSize='large' />,
      text: 'Posts',
      link: `${userId}`,
    },
    {
      icon: <Event fontSize='large' />,
      text: 'Events',
      link: `events/${userId}`,
    },
    {
      icon: <Business fontSize='large' />,
      text: 'Departments',
      link: `departments`,
    },
    {
      icon: <AccountCircle fontSize='large' />,
      text: 'Profile',
      link: `profile/${userId}`,
    },
  ];

  return (
    <Box
      sx={{
        width: '24%',
        minHeight: '100vh',
        display: 'inline-block',
        backgroundColor: 'primary.main',
      }}
    >
      <Box sx={{ marginTop: 3, marginLeft: 3 }}>
        <Logo />
      </Box>
      <Stack
        spacing={1}
        sx={{
          padding: 3,
        }}
      >
        {listItems.map((el) => (
          <Link href={`/${el.link}`} key={el.text}>
            <Item>
              {el.icon}
              <Typography variant='h5' component='p'>
                {el.text}
              </Typography>
            </Item>
          </Link>
        ))}
      </Stack>
    </Box>
  );
};
