import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { NextPage } from 'next';
import { useState, useEffect, useRef, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import Delete from '@mui/icons-material/Delete';

type DepartmentType = {
  id: string;
  name: string;
  acronym: string;
};

const Departments: NextPage = () => {
  const { userId } = useAuth();

  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [error, setError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [admin, setAdmin] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const acronymRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const adminRes = await axios
          .get(`https://localhost:7168/api/Admin/${userId}`)
          .then((res) => res.data);
        if (adminRes) {
          setAdmin(true);
        }
      } catch (error: any) {
        setError(error.message);
      }
    })();
    getDepartments();
  }, []);

  const getDepartments = async () => {
    try {
      const departmentsRes = await axios
        .get('https://localhost:7168/api/Department')
        .then((res) => res.data);
      if (departmentsRes) setDepartments(departmentsRes);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const addDepartment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (nameRef.current && acronymRef.current) {
        const body = {
          name: nameRef.current.value,
          acronym: acronymRef.current.value,
        };
        const departmentRes = await axios
          .post('https://localhost:7168/api/Department', body)
          .then((res) => res.data);
        if (departmentRes) {
          setShowDialog(false);
          getDepartments();
        }
      }
    } catch (error: any) {}
  };

  const deleteDepartment = async (id: string) => {
    try {
      const departmentRes = await axios.delete(
        `https://localhost:7168/api/Department/${id}`
      );
      if (departmentRes) getDepartments();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          color='primary'
          variant='h4'
          component='h2'
          sx={{ fontWeight: 600 }}
        >
          Departments
        </Typography>
        {admin ? (
          <Button
            variant='contained'
            color='primary'
            onClick={() => setShowDialog(true)}
            sx={{ borderRadius: '1rem' }}
          >
            Add Departments
          </Button>
        ) : null}
      </Box>
      <Box sx={{ marginTop: 3 }}>
        <TableContainer>
          <Table
            aria-label='registration details'
            sx={{
              backgroundColor: 'neutral.main',
              border: '2px solid #2C3E50',
            }}
          >
            <TableHead
              sx={{
                backgroundColor: 'primary.main',
              }}
            >
              <TableRow>
                <TableCell sx={{ color: 'secondary.main' }}>Name</TableCell>
                <TableCell sx={{ color: 'secondary.main' }}>Acronym</TableCell>
                {admin ? (
                  <TableCell sx={{ color: 'secondary.main' }}>Delete</TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((el: DepartmentType) => (
                <TableRow key={el.id}>
                  <TableCell sx={{ color: '#fff' }}>{el.name}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{el.acronym}</TableCell>
                  {admin ? (
                    <TableCell sx={{ color: '#fff' }}>
                      <IconButton
                        aria-label='delete'
                        onClick={() => deleteDepartment(el.id)}
                      >
                        <Delete color='secondary' />
                      </IconButton>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
        <form onSubmit={(e) => addDepartment(e)}>
          <DialogContent>
            <TextField
              margin='dense'
              label='Name'
              type='text'
              fullWidth
              variant='outlined'
              autoComplete='off'
              inputRef={nameRef}
              required
            />
            <TextField
              margin='dense'
              label='Acronym'
              type='text'
              fullWidth
              variant='outlined'
              inputRef={acronymRef}
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

export default Departments;
