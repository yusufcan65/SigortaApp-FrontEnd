
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {jwtDecode} from 'jwt-decode';

function EditUser() {
  const { userId } = useParams(); 
  console.log("userId",userId);
  
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

 
  useEffect(() => {
    fetch(`/users/id/${userId}`)
      .then(response => response.json()) 
      .then(data => {
        setUser(data);
       
        setForm({
          name: data.name,
          surname: data.surname,
          email: data.email
        });
      })
      .catch(error => {
        console.error('Error fetching customer data:', error);
        setError('Error fetching customer data');
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  const token = localStorage.getItem('authToken'); 
  if (!token) {
      setError('Authentication token is missing. Please log in.');
      return;
  }

  try {
      const response = await fetch(`/users/updateuser/${userId}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
      },
     
      body: JSON.stringify({ 
          name: form.name, 
          surname: form.surname, 
          email: form.email 
      }), 
      });

      if (response.ok) {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.roles; 
        
        if (userRole.includes('ADMIN')) {
          navigate('/AdminPage');
        } else if (userRole.includes('USER')) {
          navigate('/home');
        }
        setSuccess('User updated successfully');
      } else {
        const data = await response.json();
        setError(data.message || 'Update failed');
      }
  } catch (error) {
      setError('Network error. Please try again later.');
  }
};

  if (!user) return <div>Loading...</div>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 5,
          width: '100%',
          maxWidth: 600,
          p: 3,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRadius: 2,
          bgcolor: '#ffefe7',
          boxShadow: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'red' }}>Kullanıcı Düzenle</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              sx={{ '& .MuiInputBase-input': { padding: '10px' } }} 
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Surname"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              sx={{ '& .MuiInputBase-input': { padding: '10px' } }} 
            />
          </Grid>

       

          <Grid item xs={12} sm={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              sx={{ '& .MuiInputBase-input': { padding: '10px' } }} 
            />
          </Grid>

       
        </Grid>

        <Button 
          type="submit" 
          fullWidth 
          variant="contained" 
          sx={{ 
            mt: 3, 
            bgcolor: 'red', 
            color: 'white' 
          }}
        >
         
          Güncelle
        </Button>
      </Box>
    </LocalizationProvider>
  );
}

export default EditUser;
