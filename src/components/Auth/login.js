import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token && data.id) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userId', data.id);

          try {
            // JWT token'ını decode ederek rol bilgisini kontrol
            const decodedToken = jwtDecode(data.token);
            const roles = decodedToken.roles;

            if (roles.includes('ADMIN')) {
              navigate('/AdminPage'); // Admin için yönlendirme
            } else if (roles.includes('USER')) {
              navigate('/home'); // Normal kullanıcı için yönlendirme
            } else {
              setError('Bilinmeyen rol: ' + roles); // Bilinmeyen bir rol varsa hata mesajı göster
            }
          } catch (decodeError) {
            console.error('Token decode hatası:', decodeError);
            setError('Token çözme hatası.');
          }

          setSuccess('Giriş başarılı!');
        } else {
          setError('Giriş başarılı, ancak token veya kullanıcı ID\'si eksik.');
        }
      } else {
        setError('Geçersiz bilgiler veya sunucu hatası.');
      }
    } catch (fetchError) {
      console.error('İstek sırasında hata oluştu:', fetchError);
      setError('İstek işlenirken bir hata oluştu.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 5,
        width: 300,
        height: 400,
        borderRadius: 2,
        bgcolor: '#ffefe7',
        p: 3,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'red' }}>
        Giriş Yap
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        label="Kullanıcı Adı"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Şifre"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2, width: '50%', bgcolor: 'red', color: 'white' }}
      >
        Giriş Yap
      </Button>
      <Button
        type="button"
        variant="contained"
        sx={{ mt: 2, mb: 2, width: '50%', bgcolor: 'red', color: 'white' }}
        onClick={handleRegisterRedirect}
      >
        Kayıt Ol
      </Button>
    </Box>
  );
}

export default Login;
