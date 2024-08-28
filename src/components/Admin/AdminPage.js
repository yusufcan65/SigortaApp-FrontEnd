import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import PolicyIcon from '@mui/icons-material/Policy';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

import { ExitToApp} from '@mui/icons-material'; 

const AdminPage = () => {
  const navigate = useNavigate();
  const [ptRatio, setPtRatio] = useState(null); 

  const token = localStorage.getItem('authToken');

  const getUserNameFromToken = () => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.username || decodedToken.sub || 'Kullanıcı';
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
    return 'Kullanıcı';
  };

  const userName = getUserNameFromToken(); // JWT'den kullanıcı adını al

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/'); // Giriş sayfasına yönlendir
  };

  const handleButtonClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    axios.get('/policy/ratio', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    .then(response => {
      setPtRatio(response.data);
    })
    .catch(error => {
      console.error('Failed to fetch PT ratio:', error);
    });
  }, []);

  return (
    <div>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Sayfası
          </Typography>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            CAN SİGORTACILIK A.Ş.
          </Typography>
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {userName}
          </Typography>
          <Button
          variant="contained"
          style={{
            backgroundColor: '#e74c3c',
            color: '#fff',
            borderRadius: '25px',
            transition: 'background-color 0.3s, transform 0.3s',
          }}
          onClick={handleLogout}
          startIcon={<ExitToApp />} 
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#c0392b'; 
            e.currentTarget.style.transform = 'scale(1.05)'; 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e74c3c'; 
            e.currentTarget.style.transform = 'scale(1)'; 
          }}
          
        >
          Çıkış Yap
        </Button>
        </Toolbar>
      </AppBar>

      {/* Poliçe/teklif oranı göstergesi */}
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100vh - 64px)', 
            mt: 2
          }}
        >
          {ptRatio !== null && (
            <Box
              sx={{
                mb: 4,
                padding: 4,
                backgroundColor: '#ffffff', 
                borderRadius: '8px', 
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', 
                textAlign: 'center',
                width: '80%', 
                maxWidth: '600px', 
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                Poliçe Oluşturulma Oranı
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {ptRatio.toFixed(2)}
              </Typography>
            </Box>
          )}

          {/* Butonlar */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              mb: 2
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ width: 200, height: 60, fontSize: '16px' }}
              startIcon={<PersonIcon />}
              onClick={() => handleButtonClick('/AdminListUsers')}
            >
              Ortaklarımız
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: 200, height: 60, fontSize: '16px' }}
              startIcon={<PeopleIcon />}
              onClick={() => handleButtonClick('/AdminListCustomers')}
            >
              Müşterilerimiz
            </Button>
            <Button
              variant="contained"
              color="success"
              sx={{ width: 200, height: 60, fontSize: '16px' }}
              startIcon={<PolicyIcon />}
              onClick={() => handleButtonClick('/AdminListPolicies')}
            >
              Poliçeler
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AdminPage;
