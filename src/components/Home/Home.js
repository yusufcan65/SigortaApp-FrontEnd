import React from 'react';
import Navbar from '../Navbar/Navbar';
import LastPolicies from '../policy/LastPolicies';
import { Grid } from '@mui/material';
import LastOffers from '../policy/LastOffers';
import Footer from '../Footer/Footer';  

function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden', 
    }}>
      <Navbar />
      <main style={{
        flex: 1,
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        overflow: 'hidden', 
      }}>
        <Grid container spacing={2} style={{ height: '100%' }}>
          <Grid item xs={12} sm={6} style={{ height: '100%' }}>
            <LastPolicies />
          </Grid>
          <Grid item xs={12} sm={6} style={{ height: '100%' }}>
            <LastOffers />
          </Grid>
        </Grid>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
