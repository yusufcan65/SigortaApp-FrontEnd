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
import { Box, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AlarmIcon from '@mui/icons-material/Alarm';
import Tooltip from '@mui/material/Tooltip';

function AdminListPolicies() {
  const [policy, setPolicy] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('policyNumber'); 
  const navigate = useNavigate();



  useEffect(() => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      console.error('JWT token bulunamadı. Lütfen giriş yapın.');
      return;
    }
  
    fetch(`/policy`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // JWT token burada ekleniyor
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Veri alınırken hata oluştu');
        }
        return response.json();
      })
      .then(data => {
        console.log('Veri alındı:', data);
        setPolicy(data);
      })
      .catch(error => console.error('Veri alınırken hata:', error));
  }, []);
  const handlePolicySelect = (policyId, policyPrim) => {
    console.log('Ödeme sayfasına yönlendirme:', policyId, 've toplam tutar:', policyPrim);
    navigate('/payment', {
      state: { policyId, totalAmount: policyPrim }
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  // Arama kriterine göre filtreleme
  const filteredPolicies = policy.filter(p => {
    const value = String(p[searchCriteria] || '').trim().toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    console.log('Arama Kriteri:', searchCriteria); // Arama kriterini kontrol et
    console.log('Arama Sorgusu:', query); // Arama sorgusunu kontrol et
    console.log('Filtreleme Değeri:', value); // Filtreleme değerini kontrol et
    return value.includes(query);
  });

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
      <Typography variant="h5" sx={{ mb: 2 }}>
        Poliçe Listesi
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <FormControl sx={{ mr: 2, minWidth: 150 }}>
          <InputLabel>Arama Kriteri</InputLabel>
          <Select
            value={searchCriteria}
            onChange={handleCriteriaChange}
            label="Arama Kriteri"
          >
            <MenuItem value="policyNumber">Poliçe Numarası</MenuItem>
            <MenuItem value="customerNumber">Müşteri Numarası</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label="Arama"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ maxHeight: 500, width: 1200, mt: 2 }}
      >
        <Table stickyHeader sx={{ borderCollapse: 'collapse' }}>
          <TableHead>
            <TableRow style={{ backgroundColor:'#FFCDD2', height: '50px'}}>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>#</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Poliçe Numarası</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Müşteri numarası</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Status</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Branş Kodu</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Prim</TableCell>              
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Tanzim Tarihi</TableCell>   
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Kalan Süre</TableCell>               
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Başlangıç Tarihi</TableCell>              
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Bitiş Tarihi</TableCell>    
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '8px', textAlign: 'center', borderBottom: 'none' }}>Aksiyon</TableCell>    
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPolicies.length > 0 ? (
              filteredPolicies.map((policy, index) => (
                <TableRow key={policy.id} sx={{ '& td, & th': { padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)', textAlign: 'center' } }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{policy.policyNumber}</TableCell>
                  <TableCell>{policy.customerNumber}</TableCell>
                  <TableCell>{policy.status}</TableCell>
                  <TableCell>{policy.branch_code}</TableCell>
                  <TableCell>{policy.prim.toFixed(2)}</TableCell>
                  <TableCell>{policy.tanzim_date}</TableCell>  
                  <TableCell style={{ position: 'relative' }}>
                    <span>{policy.remainderTime}</span>
                    {(policy.remainderTime > 0 && policy.remainderTime <= 5) && (
                      <Tooltip title="Teklifiniz 5 gün içinde silinecek" placement="top">
                        <AlarmIcon style={{ color: 'red', position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)' }} />
                      </Tooltip>
                    )}
                  </TableCell>               
                  <TableCell>{policy.start_date}</TableCell>                
                  <TableCell>{policy.finish_date}</TableCell>
                  <TableCell>
                    {policy.status === 'T' && (
                      <Button 
                        variant="contained" 
                        color="secondary"
                        size='small'
                        onClick={() => handlePolicySelect(policy.id, policy.prim)}
                      >
                        Ödeme Yap
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} sx={{ textAlign: 'center' }}>Arama sonucunda herhangi bir veri bulunamadı.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AdminListPolicies;