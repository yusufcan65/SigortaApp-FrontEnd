import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AdminListCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchOption, setSearchOption] = useState('nameSurname'); // Default search option
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [policy, setPolicy] = useState([]);
  

  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      console.error('JWT token bulunamadı. Lütfen giriş yapın.');
      return;
    }

    fetch(`/customer`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Veri alınırken hata oluştu');
        }
        return response.json();
      })
      .then((data) => {
        setCustomers(data);
        setFilteredCustomers(data);
      })
      .catch((error) => console.error('Veri alınırken hata:', error));
  }, [token]);

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const handleSearchTermChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

   
    const filtered = customers.filter((customer) => {
      const customerNumber = String(customer.customerNumber).toLowerCase();
      if (searchOption === 'nameSurname') {
        return (
          customer.name.toLowerCase().includes(term.toLowerCase()) ||
          customer.surname.toLowerCase().includes(term.toLowerCase())
        );
      } else if (searchOption === 'customerNumber') {
        return customerNumber.includes(term.toLowerCase());
      }
      return false;
    });

    setFilteredCustomers(filtered);
  };

  const handleClose = () => {
    setOpen(false);
    setPolicy([]);
  };

  const handleListOffers = (customerId) => {
    setSelectedCustomerId(customerId);
    fetch(`/policy/listById/${customerId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Teklifler alınırken hata oluştu');
        }
        return response.json();
      })
      .then((data) => {
        setPolicy(data);
        setOpen(true);
      })
      .catch((error) => console.error('Teklifler alınırken hata:', error));
  };

  const handleBackClick = () => {
    navigate('/adminPage'); // AdminPage yönlendirmesi
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        px: 2,
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
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
        Müşteri Listesi
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <FormControl sx={{mr:2, minWidth: 150 }}>
          <InputLabel>Arama Kriteri</InputLabel>
          <Select 
            value={searchOption} 
            onChange={handleSearchOptionChange}
             label="Arama Kriteri"
          >
            <MenuItem value="nameSurname">Ad/Soyad</MenuItem>
            <MenuItem value="customerNumber">Müşteri Numarası</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label="Arama"
          value={searchTerm}
          onChange={handleSearchTermChange}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 600, width: 800, overflow: 'auto', mt: 2 }}>
        <Table stickyHeader sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#ff4207 !important', height: '50px' }}>
              <TableCell
                sx={{
                  color: 'black',
                  fontWeight: 'bold',
                  padding: '8px',
                  textAlign: 'center',
                  borderBottom: 'none',
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{
                  color: 'black',
                  fontWeight: 'bold',
                  padding: '8px',
                  textAlign: 'center',
                  borderBottom: 'none',
                }}
              >
                Müşteri No
              </TableCell>
              <TableCell
                sx={{
                  color: 'black',
                  fontWeight: 'bold',
                  padding: '8px',
                  textAlign: 'center',
                  borderBottom: 'none',
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  color: 'black',
                  fontWeight: 'bold',
                  padding: '8px',
                  textAlign: 'center',
                  borderBottom: 'none',
                }}
              >
                Surname
              </TableCell>
              <TableCell
                sx={{
                  color: 'black',
                  fontWeight: 'bold',
                  padding: '8px',
                  textAlign: 'center',
                  borderBottom: 'none',
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  color: 'black',
                  fontWeight: 'bold',
                  padding: '8px',
                  textAlign: 'center',
                  borderBottom: 'none',
                }}
              >
                Aksiyon
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <TableRow
                  key={customer.id}
                  sx={{
                    '& td, & th': {
                      padding: '8px',
                      borderBottom: '1px solid rgba(224, 224, 224, 1)',
                      textAlign: 'center',
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{customer.customerNumber}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.surname}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      startIcon={<MenuBookRoundedIcon />}
                      onClick={() => handleListOffers(customer.id)}
                      sx={{ mr: 1 }}
                    >
                      Teklifler
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                  Arama sonucunda herhangi bir veri bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
  Teklifler
</DialogTitle>
<DialogContent>
  {policy.length === 0 ? (
    <Typography variant="body1">Henüz Teklifiniz bulunmamaktadır.</Typography>
  ) : (
    <TableContainer 
      sx={{ 
        maxHeight: 500, 
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Gölgelendirme
        borderRadius: 2, // Köşeleri yuvarlama
        backgroundColor: '#f9f9f9' // Genel arka plan rengi
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow >
            <TableCell sx={{ fontWeight: 'bold', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>#</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'}}>Poliçe No</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center',  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>Başlangıç Tarihi</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center',  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>Bitiş Tarihi</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center',  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>Prim</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>Durum</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {policy.map((policy, index) => (
            <TableRow key={policy.id}>
              <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{policy.policyNumber}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{policy.start_date}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{policy.finish_date}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{policy.prim}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{policy.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )}
</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminListCustomers;
