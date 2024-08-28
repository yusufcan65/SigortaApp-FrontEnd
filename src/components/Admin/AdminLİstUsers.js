import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditSharpIcon from '@mui/icons-material/EditSharp';


function AdminListUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken'); 

    fetch('/users/userList', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched users:', data); 
      setUsers(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      setUsers([]);
    });
  }, []);

  const handleBackClick = () => {
    navigate('/adminPage'); // AdminPage yönlendirmesi
  };
  const handleEdit = (userId) => {
    
    console.log('gönderilen userId: ',userId);
    navigate(`/user/edit/${userId}`);
  };
 

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        height: '100vh', 
        px: 2 
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
        >
          Geri
        </Button>
      </Box>
      
      <Typography variant="h5" sx={{ mb: 2 }}>
        Ortaklarımız
      </Typography>
    
      <TableContainer 
        component={Paper} 
        sx={{ 
          maxHeight: 700, 
          width: '100%', 
          maxWidth: 1200, 
          mt: 2, 
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
          borderRadius: '8px',
          overflow: 'auto' 
        }}
      >
        <Table stickyHeader sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow 
              sx={{ 
                backgroundColor:'#FFCDD2', 
                height: '50px', 
                borderBottom: '2px solid #FFABAB'
              }}
            >
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '12px', textAlign: 'center', borderBottom: 'none' }}>#</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '12px', textAlign: 'center', borderBottom: 'none' }}>Kullanıcı Adı</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '12px', textAlign: 'center', borderBottom: 'none' }}>Kullanıcı Soyadı</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '12px', textAlign: 'center', borderBottom: 'none' }}>Kullanıcı Email adresi</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '12px', textAlign: 'center', borderBottom: 'none' }}>Aksiyon</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <TableRow 
                  key={user.id}
                  sx={{ 
                    '& td': { 
                      padding: '12px', 
                      borderBottom: '1px solid rgba(224, 224, 224, 1)', 
                      textAlign: 'center',
                      backgroundColor: '#fff'
                    },
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.surname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<EditSharpIcon />}
                        onClick={() => handleEdit(user.id)}
                        sx={{ mr: 1 }}
                      >
                        Düzenle
                      </Button>
                    </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', padding: '20px' }}>
                  Veri bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminListUsers;
