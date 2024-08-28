import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert, MenuItem, FormControl, Select, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const { state } = useLocation();
  const [form, setForm] = useState({
    card_number: '',
    card_owner: '',
    cvv: '',
    expiry_month: '', 
    expiry_year: '',  
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [policyId, setPolicyId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const navigate = useNavigate();
  
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (state) {
      const { policyId, totalAmount } = state;
      if (policyId) {
        setPolicyId(policyId);
        setTotalAmount(totalAmount);
      } else {
        setError('No policy selected.');
      }
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setForm((prevForm) => ({ ...prevForm, card_number: value }));
  };

  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 3);
    setForm((prevForm) => ({ ...prevForm, cvv: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

   

    if (!policyId) {
        setError('No policy selected.');
        return;
    }

    setOpenConfirmDialog(true);
  };

  const handleConfirmClose = (confirm) => {
    setOpenConfirmDialog(false);

    if (confirm) {
      
      makePayment();
    }
  };

  const makePayment = async () => {
    try {
       // "MM/YYYY" formatında expiry_date string oluşturma
    const expiry_date = `${form.expiry_month}/${form.expiry_year}`;
      const response = await fetch(`/payment/${policyId}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${token}`, 
          },
          body: JSON.stringify({ 
              card_number: form.card_number.replace(/\s+/g, ''), 
              card_owner: form.card_owner,
              expiry_date, 
              cvv: form.cvv
          }),
      });
  
      if (response.ok) {
          setDialogMessage('Ödeme başarıyla gerçekleştirildi.');
          setSuccess('Payment successfully processed');
          console.log('Payment successfully processed');
          setOpenInfoDialog(true); 
      } else {
          const errorData = await response.json();
          setError(errorData.message || 'Payment failed');
      }
      
    } catch (error) {
        setError('Network error. Please try again later.');
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        mt: 5, 
        width: '100%',
        maxWidth: 600,
        p: 3,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderRadius: 2,
        bgcolor:'#ffefe7',
        boxShadow: 3,
        textAlign:'center'
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'red' }}>Kart Bilgileri</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <TextField
        margin="normal"
        required
        fullWidth
        label="Kart Sahibi"
        name="card_owner"
        value={form.card_owner}
        onChange={handleChange}
        sx={{ '& .MuiInputBase-input': { padding: '10px' } }} 
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Kart Numarası"
        name="card_number"
        value={form.card_number}
        onChange={handleCardNumberChange}
        sx={{ '& .MuiInputBase-input': { padding: '10px' } }} 
      />
     
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FormControl fullWidth required>
            <Select
              displayEmpty
              name="expiry_month"
              value={form.expiry_month}
              onChange={handleChange}
              sx={{ '& .MuiInputBase-input': { padding: '10px' }, fontSize: '1rem' }}
            >
              <MenuItem value="" disabled>
                Ay
              </MenuItem>
              {Array.from(new Array(12), (_, index) => dayjs().month(index).format('MM')).map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth required>
            <Select
              displayEmpty
              name="expiry_year"
              value={form.expiry_year}
              onChange={handleChange}
              sx={{ '& .MuiInputBase-input': { padding: '10px' }, fontSize: '1rem' }}
            >
              <MenuItem value="" disabled>
                Yıl
              </MenuItem>
              {Array.from(new Array(15), (_, index) => dayjs().year() + index).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            required
            fullWidth
            label="CVV"
            name="cvv"
            value={form.cvv}
            onChange={handleCVVChange}
            sx={{ '& .MuiInputBase-input': { padding: '10px' } }} 
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, mt:8, fontWeight: 'bold' }}>
        Poliçe Tutarı : ₺ {totalAmount}
      </Typography>

      <Button 
        type="submit" 
        fullWidth 
        variant="contained" 
        sx={{ 
          mt: 3, 
          bgcolor: 'red', 
          color: 'white' 
        }}
      >
        Ödeme Yap
      </Button>

      {/* Onay Penceresi */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Onay</DialogTitle>
        <DialogContent>
          <Typography>Ödeme işlemini gerçekleştirmek istediğinizden emin misiniz?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmClose(false)}>Hayır</Button>
          <Button onClick={() => handleConfirmClose(true)} autoFocus>Evet</Button>
        </DialogActions>
      </Dialog>

      {/* Bilgi Penceresi */}
      <Dialog
        open={openInfoDialog}
        onClose={() => setOpenInfoDialog(false)}
      >
        <DialogTitle>Bilgi</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
          <Typography>Ödenecek Tutar: ₺{totalAmount.toFixed(2)}</Typography>
          <Typography>Poliçe ID: {policyId}</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenInfoDialog(false);
              navigate('/home'); 
            }}
            color="primary"
          >
            Tamam
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payment;
