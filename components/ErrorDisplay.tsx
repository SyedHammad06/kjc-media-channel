import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { NextPage } from 'next';
import { SetStateAction } from 'react';

type Props = {
  error: string;
  setError: (value: SetStateAction<string>) => void;
};

export const ErrorDisplay: NextPage<Props> = ({ error, setError }) => {
  return (
    <Snackbar
      open={error ? true : false}
      autoHideDuration={6000}
      onClose={() => setError('')}
    >
      <Alert severity='error' variant='filled' onClose={() => setError('')}>
        {error}
      </Alert>
    </Snackbar>
  );
};
