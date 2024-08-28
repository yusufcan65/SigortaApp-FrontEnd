import React from 'react';
import { Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <footer style={{
      padding: '20px 0',
      backgroundColor: '#e0e0e0', 
      color: '#333333', 
      textAlign: 'center',
      borderTop: '1px solid #cccccc' 
    }}>
      <Container>
        <Typography variant="body2" color="inherit">
          &copy; {new Date().getFullYear()} Can Sigortacılık. Tüm Hakları Saklıdır.
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
