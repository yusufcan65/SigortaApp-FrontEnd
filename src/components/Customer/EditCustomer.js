import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function EditCustomer() {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone_number: '',
    id_number: '',
    birth_date: null,
    city: '',
    district: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  
  useEffect(() => {
    fetch(`/customer/id/${customerId}`)
      .then(response => response.json())
      .then(data => {
        setCustomer(data);
        
        setForm({
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone_number: data.phone_number,
          id_number: data.id_number,
          birth_date: data.birth_date ? dayjs(data.birth_date).format('YYYY-MM-DD') : '',
          city: data.city,
          district: data.district,
        });
      })
      .catch(error => {
        console.error('Error fetching customer data:', error);
        setError('Error fetching customer data');
      });
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };



const handleDateChange = (date) => {
  setForm(prevForm => ({
    ...prevForm,
    birth_date: date ? date.format('YYYY-MM-DD') : '' // YYYY-MM-DD formatına dönüştür
  }));
};
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  const token = localStorage.getItem('authToken'); // JWT token'ı localStorage'dan al

  if (!token) {
    setError('Authentication token is missing. Please log in.');
    return;
  }

  try {
    const response = await fetch(`/customer/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify({ ...form, id: customerId }), 
    });

    if (response.ok) {
      setSuccess('Customer updated successfully');
      navigate('/home');
    } else {
      const data = await response.json();
      setError(data.message || 'Update failed');
    }
  } catch (error) {
    setError('Network error. Please try again later.');
  }
};

  if (!customer) return <div>Loading...</div>;

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
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'red' }}>Müşteri Düzenle</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="TCKİMLİK NO"
              name="id_number"
              value={form.id_number}
              onChange={handleChange}
              sx={{ '& .MuiInputBase-input': { padding: '10px' } }} 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Doğum Günü"
              value={form.birth_date  ? dayjs(form.birth_date) : null}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  sx={{ '& .MuiInputBase-input': { padding: '10px' } }} 
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="İl"
              name="city"
              value={form.city}
              onChange={handleChange}
              sx={{ '& .MuiInputBase-input': { padding: '10px' } }} 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="İlçe"
              name="district"
              value={form.district}
              onChange={handleChange}
              sx={{ '& .MuiInputBase-input': { padding: '10px' } }} 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Telefon Numarası"
              name="phone_number"
              value={form.phone_number}
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

export default EditCustomer;
