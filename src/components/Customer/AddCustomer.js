import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function AddCustomer() {


  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

const handleDateChange = (date) => {
  const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : null;
  setForm((prevForm) => ({
    ...prevForm,
    birth_date: formattedDate,
  }));
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');
    

  
    if (!userId) {
      setError('Invalid User ID. Please log in.');
      return;
    }
  
    if (!token) {
      setError('Authentication token is missing. Please log in.');
      return;
    }
  
    const requestBody = {
      ...form,
      userId: userId, 
    };
  
    try {
      const response = await fetch('/customer/addCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Add customer failed');
        return;
      }
  
     
      const data = await response.json();
      setSuccess(data.message);
      navigate('/customer/customerList');
    } catch (err) {
      
      setError('An error occurred. Please try again.');
      console.error('Fetch Error:', err);
    }
  };

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
          bgcolor:'#ffefe7',
          boxShadow: 3,
          textAlign:'center'
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'red' }}>Müşteri Ekle</Typography>
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
              label="T.C Kimlik Numarası"
              name="id_number"
              value={form.id_number}
              onChange={handleChange}
              inputProps={{ 
                maxLength: 11,
                minLength: 11,
                pattern: "[0-9]*"
              }} 
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
                  required
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
              inputProps={{ 
                maxLength: 11,
                minLength: 11,
                pattern: "[0-9]*"
              }} 
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
          Oluştur
        </Button>
      </Box>
    </LocalizationProvider>
  );
}

export default AddCustomer;
