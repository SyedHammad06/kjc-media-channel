import { NextPage } from 'next';
import Box from '@mui/system/Box';
import { LeftBar } from './LeftBar';
import { RightBar } from './RightBar';

type Props = {
  children: JSX.Element;
};

export const Layout: NextPage<Props> = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      <LeftBar />
      <Box
        sx={{
          width: '52%',
          overflow: 'auto',
          padding: 3,
        }}
      >
        {children}
      </Box>
      <RightBar />
    </Box>
  );
};
