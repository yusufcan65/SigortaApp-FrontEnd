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
import DeleteIcon from '@mui/icons-material/Delete';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box } from '@mui/material';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [policy, setPolicy] = useState([]);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token || !userId) {
      console.error('JWT token veya Kullanıcı ID eksik. Lütfen giriş yapın.');
      return;
    }

    fetch(`/customer/getByUserId/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Müşteri verileri alınamadı');
        }
        return response.json();
      })
      .then(data => {
        setCustomers(data);
      })
      .catch(error => console.error('Müşteri verilerini alırken bir hata oluştu:', error));
  }, [token, userId]);

  const handleDelete = (customerId) => {
    if (!token) {
      console.error('JWT token eksik. Lütfen giriş yapın.');
      return;
    }

    fetch(`/customer/delete/${customerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Müşteri silinemedi');
        }
        setCustomers(prevCustomers => 
          prevCustomers.filter(customer => customer.id !== customerId)
        );
      })
      .catch(error => console.error('Müşteri silinirken bir hata oluştu:', error));
  };

  const handleListOffers = (customerId) => {
    if (!token) {
      console.error('JWT token eksik. Lütfen giriş yapın.');
      return;
    }

    setSelectedCustomerId(customerId);
    fetch(`/policy/listById/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        setPolicy(data);
        setOpen(true);
      })
      .catch(error => console.error('Teklifler alınırken bir hata oluştu:', error));
  };

  const handleClose = () => {
    setOpen(false);
    setPolicy([]);
  };

  const handleEdit = (customerId) => {
    navigate(`/customer/edit/${customerId}`);
  };

  const handlePolicySelect = (policyId, policyPrim) => {
    navigate('/payment', {
      state: { policyId, totalAmount: policyPrim }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', px: 2 }}>
          <div>
            <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
              Müşteri Listesi
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 600, width: 900, overflow: 'auto', mt: 2, ml: 5 }}>
              <Table stickyHeader sx={{ borderCollapse: 'collapse' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#ff4207', height: '50px' }}>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>#</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Müşteri No</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Ad</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Soyad</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>E-posta</TableCell>                    
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>TC Kimlik Numarası</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Aksiyon</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer, index) => (
                    <TableRow key={customer.id} sx={{ '& td, & th': { padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' } }}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{customer.customerNumber}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.surname}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.id_number}</TableCell>
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
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<EditSharpIcon />}
                          onClick={() => handleEdit(customer.id)}
                          sx={{ mr: 1 }}
                        >
                          Düzenle
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(customer.id)}
                          sx={{ mr: 1 }}
                        >
                          Sil
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
              <DialogTitle>Teklifler</DialogTitle>
              <DialogContent>
                {policy.length === 0 ? (
                  <Typography variant="body1">Henüz Teklifiniz bulunmamaktadır.</Typography>
                ) : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Poliçe No</TableCell>
                        <TableCell>Başlangıç Tarihi</TableCell>
                        <TableCell>Bitiş Tarihi</TableCell>
                        <TableCell>Prim</TableCell>
                        <TableCell>Aksiyon</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                  {policy.map((policy, index) => (
                    <TableRow key={policy.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{policy.policyNumber}</TableCell>
                      <TableCell>{policy.start_date}</TableCell>
                      <TableCell>{policy.finish_date}</TableCell>
                      <TableCell>{policy.prim}</TableCell>
                      <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handlePolicySelect(policy.id, policy.prim)}
                            >
                              Öde
                            </Button>
                          </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                  </Table>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Kapat</Button>
              </DialogActions>
            </Dialog>
          </div>
        </Box>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerList;
