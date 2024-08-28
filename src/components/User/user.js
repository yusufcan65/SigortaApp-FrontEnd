import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


function User() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
    <Table sx={{ borderCollapse: 'collapse' }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#4CAF50', height: '50px' }}>
          <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '8px', borderBottom: 'none' }}>Name</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '8px', borderBottom: 'none' }}>Surname</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '8px', borderBottom: 'none' }}>Username</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold', padding: '8px', borderBottom: 'none' }}>Email</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} sx={{ '& td, & th': { padding: '8px', borderBottom: '1px solid rgba(224, 224, 224, 1)' } }}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.surname}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  );
}

export default User;