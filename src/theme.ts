import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',
    },
    secondary: {
      main: '#D5F4FF',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 400,
    },
    h5: {
      fontSize: '1.6rem',
      fontWeight: 400,
    },
    h6: {
      fontSize: '1.2rem',
      fontWeight: 400,
    },
  },
});

export default theme;
