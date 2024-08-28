import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    surname: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Register successful');
        console.log('Register successful', data);
        navigate('/'); // Başarılı kayıt işleminden sonra login sayfasına yönlendir
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Register failed');
      }
    } catch (error) {
      setError('Network error');
    }
  };
  const handleLoginRedirect = () => {
    navigate('/'); // Login sayfasına yönlendir
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        mt: 5, 
        width: 300, 
        height: 550, 
        borderRadius: 2,
        bgcolor:'#ffefe7',
        p: 3,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'red' }}>Kayıt Ol</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        sx={{ mb: 1 }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        label="Surname"
        name="surname"
        value={form.surname}
        onChange={handleChange}
        sx={{ mb: 1 }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        sx={{ mb: 1 }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        sx={{ mb: 1 }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        sx={{ mb: 1 }}
      />
     
      
      
      <Button 
      type="submit" 
      fullWidth variant="contained" 
      sx={{
         mt: 3, 
         bgcolor: 'red', 
         color: 'white' }}>
        Kayıt Ol
      </Button>
    
      <Button 
        type="button" 
        fullWidth variant="contained" 
        sx={{ mt: 2, bgcolor: 'red', color: 'white' }}
        onClick={handleLoginRedirect} 
      >
        Giriş Yap
      </Button>
    </Box>
  );
}

export default Register;
