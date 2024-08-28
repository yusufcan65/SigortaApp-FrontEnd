import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

function LastPolicies() {
  const [policy, setPolicy] = useState([]);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');
  const theme = useTheme();

  useEffect(() => {
    if (userId && token) {
      fetch(`/policy/lastPolicies/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPolicy(data);
      })
      .catch(error => console.error('Error fetching data:', error));
    }
  }, [userId, token]);


  return (
    <div style={{ padding: theme.spacing(2), backgroundColor: '#f5f5f5' }}>
      <Typography 
        variant="h5" 
        sx={{ mb: 2, textAlign: 'center', color: theme.palette.primary.main }}
      >
        Son Poliçeler
      </Typography>
      <TableContainer 
        component={Paper} 
        sx={{ maxHeight: 600, width: '100%', margin: '0 auto', borderRadius: 3, boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[200] }}>
              <TableCell sx={{ fontWeight: 'bold', padding: '8px', borderBottom: '2px solid',textAlign:'center', borderColor: theme.palette.grey[400] }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: '8px', borderBottom: '2px solid', textAlign:'center',borderColor: theme.palette.grey[400] }}>Poliçe No</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: '8px', borderBottom: '2px solid', textAlign:'center',borderColor: theme.palette.grey[400] }}>Müşteri No</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: '8px', borderBottom: '2px solid',textAlign:'center', borderColor: theme.palette.grey[400] }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: '8px', borderBottom: '2px solid',textAlign:'center', borderColor: theme.palette.grey[400] }}>Branş Kodu</TableCell>
              <TableCell sx={{ fontWeight: 'bold', padding: '8px', borderBottom: '2px solid',textAlign:'center', borderColor: theme.palette.grey[400] }}>Prim</TableCell>
              <TableCell 
                sx={{ 
                  textAlign:'center',
                  fontWeight: 'bold', 
                  padding: '8px', 
                  borderBottom: '2px solid', 
                  borderColor: theme.palette.grey[400], 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  fontSize: '0.875rem' 
                }}
              >
                Başlangıç Tarihi
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policy.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Henüz Kayıt Edilen Bir Poliçe Mevcut Değil</TableCell>
              </TableRow>
            ) : (
              policy.map((policy, index) => (
                <TableRow key={policy.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fafafa' } }}>
                  <TableCell sx={{ padding: '8px', textAlign: 'center' }}>{index + 1}</TableCell>
                  <TableCell sx={{ padding: '8px', textAlign: 'center' }}>{policy.policyNumber}</TableCell>
                  <TableCell sx={{ padding: '8px', textAlign: 'center' }}>{policy.customerNumber}</TableCell>
                  <TableCell sx={{ padding: '8px', textAlign: 'center' }}>{policy.status}</TableCell>
                  <TableCell sx={{ padding: '8px', textAlign: 'center' }}>{policy.branch_code}</TableCell>
                  <TableCell sx={{ padding: '8px', textAlign: 'center' }}>{policy.prim.toFixed(2)}</TableCell>
                  <TableCell 
                    sx={{ 
                      padding: '4px', 
                      textAlign: 'center', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontSize: '0.875rem' 
                    }}
                  >
                    {policy.start_date}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default LastPolicies;
