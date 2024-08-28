                   
import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PolicyForm = () => {
  const [selectedPolicyType, setSelectedPolicyType] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const navigate = useNavigate();
  const [prim, setPrim] = useState(undefined);
  const [policyId, setPolicyId] = useState(null);
  

  const [trafficFormData, setTrafficFormData] = useState({
    brand: '',
    model: '',
    model_year: '',
    plateCityCode: '',
    plateCode: '',
    engineNumber: '',
    frameNumber: '',
  });

  const [healthFormData, setHealthFormData] = useState({
    smokeStatus: '',
    sporStatus: '',
    operationStatus: '',
    chronicDiseaseStatus: '',
  });

  const [daskFormData, setDaskFormData] = useState({
    squareMeter: '',
    buildingAge: '',
    floorNumber: '',
    addressCode: '',
    damageState: '',
    numberBuildFloor: '',
  });

  // Data states
  const [customers, setCustomers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [modelYears, setModelYears] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [car, setCar] = useState({});
  const [error, setError] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(true); 
  const [isPrimVisible, setPrimVisible] = useState(false);
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');
  

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!userId) {
        console.error('User ID localStorage\'da bulunamadı.');
        return;
      }

      try {
        const response = await fetch(`/customer/getByUserId/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Müşteriler getirilemedi');
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Müşteriler getirilirken hata oluştu:', error);
      }
    };

    fetchCustomers();
  }, [userId, token]);

  useEffect(() => {
    if (selectedPolicyType === 'traffic' || selectedPolicyType === 'kasko') {
      const fetchBrands = async () => {
        try {
          const response = await fetch(`/${selectedPolicyType}/brands`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Markalar getirilemedi');
          const data = await response.json();
          setBrands(data);
        } catch (error) {
          console.error(`Markalar getirilirken hata oluştu (${selectedPolicyType}):`, error);
        }
      };

      fetchBrands();
    }
  }, [selectedPolicyType, token]);


  const handlePolicyTypeChange = (event) => {
    setSelectedPolicyType(event.target.value);
    
    setTrafficFormData({
      brand: '',
      model: '',
      model_year: '',
      plateCityCode: '',
      plateCode: '',
      engineNumber: '',
      frameNumber: '',
    });
    setSelectedBrand('');
    setSelectedModel('');
    setModelYears([]);
    setCar({});
    setHealthFormData({
      smokeStatus: '',
      sporStatus: '',
      operationStatus: '',
      chronicDiseaseStatus: '',
    });
    setDaskFormData({
      squareMeter: '',
      buildingAge: '',
      floorNumber: '',
      addressCode: '',
      damageState: '',
      numberBuildFloor: '',
    });
  };

  const handleCustomerChange = (event) => {
    const value = event.target.value;
    setSelectedCustomerId(value);
    setError(value === ''); // Müşteri seçilmezse hata durumu etkinleştirir
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (selectedPolicyType === 'traffic' || selectedPolicyType === 'kasko') {
      setTrafficFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      if (name === 'model_year') {
        fetchCar(trafficFormData.brand, trafficFormData.model, value);
      }
    } else if (selectedPolicyType === 'health') {
      setHealthFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (selectedPolicyType === 'dask') {
      setDaskFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleBrandChange = async (event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    setSelectedModel('');
    setModelYears([]);
    handleChange({ target: { name: 'brand', value: brand } });

    if (selectedPolicyType === 'traffic' || selectedPolicyType === 'kasko') {
      try {
        const response = await fetch(`/${selectedPolicyType}/models/${brand}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Modeller getirilemedi');
        const data = await response.json();
        setModels(data);
      } catch (error) {
        console.error('Modeller getirilirken hata oluştu:', error);
      }
    }
  };
  const handleModelChange = async (event) => {
    const model = event.target.value;
    setSelectedModel(model);
    handleChange({ target: { name: 'model', value: model } });

    if (selectedPolicyType === 'traffic' || selectedPolicyType === 'kasko') {
      try {
        const response = await fetch(`/${selectedPolicyType}/modelYears/${selectedBrand}/${model}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Model yılları getirilemedi');
        const data = await response.json();
        setModelYears(data);
        fetchCar(selectedBrand, model, trafficFormData.model_year);
      } catch (error) {
        console.error('Model yılları getirilirken hata oluştu:', error);
      }
    }
  };

  const fetchCar = async (brand, model, modelYear) => {
    if (!brand || !model || !modelYear) return;

    if (selectedPolicyType === 'traffic' || selectedPolicyType === 'kasko') {
      try {
        const carResponse = await fetch(`/${selectedPolicyType}/car/${brand}/${model}/${modelYear}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        // Yanıtın durumunu kontrol et
        if (!carResponse.ok) {
          const errorText = await carResponse.text();
          console.error('Araç bilgileri getirilemedi:', carResponse.status, errorText);
          return;
        }
  
        const carData = await carResponse.json();
        setCar(carData);
  
      } catch (error) {
        console.error('Araç bilgileri getirilirken hata oluştu:', error);
      }
    }
  };



  const handleSubmit = async () => {
    try {
      let policyData;

      if (selectedPolicyType === 'traffic' || selectedPolicyType === 'kasko') {
        policyData = {
          car: {
            ...car,
          },
          customerId: selectedCustomerId,
          userId: userId,
          plateCityCode: trafficFormData.plateCityCode,
          plateCode: trafficFormData.plateCode,
          engineNumber: trafficFormData.engineNumber,
          frameNumber: trafficFormData.frameNumber,
        };
      } else if (selectedPolicyType === 'health') {
        policyData = {
          ...healthFormData,
          customerId: selectedCustomerId,
          userId: userId,
        };
      } else if (selectedPolicyType === 'dask') {
        policyData = {
          ...daskFormData,
          customerId: selectedCustomerId,
          userId: userId,
        };
      }

      const response = await fetch(`/${selectedPolicyType}/calculate_offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(policyData),
      });
        const data = await response.json();
        //
      if (response.ok) {
        console.log('API Response:', data);
        setPolicyId(data.id);
        console.log('id', data.id);
        if (data.prim !== undefined) {
          setPrim(data.prim);
          console.log('prim:', data.prim);
        } else {
          console.error('Prim value is undefined');
        }
        setPrimVisible(true);
        
        setButtonsVisible(false); 

       
      }else{
        setError(data.message || 'Policy creation failed');
        return;
      }

    } catch (error) {
      console.error('Error creating policy:', error);
    }
  };

const handleSaveOffer = () => {
  navigate('/home');
};

const handlePayment = () => {
  navigate('/payment', {
    state: {
      policyId,
      totalAmount : prim
    }
  });
};

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: 'auto', boxShadow: 4, borderRadius: 4, backgroundColor: '#f0ece2' }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 1,mt:1 }}>
        Poliçe Oluştur
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '10px' }}>
      
        <TextField
          select
          label="Poliçe Tipi"
          value={selectedPolicyType}
          onChange={handlePolicyTypeChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="traffic">Trafik</MenuItem>
          <MenuItem value="kasko">Kasko</MenuItem>
          <MenuItem value="dask">DASK</MenuItem>
          <MenuItem value="health">Sağlık</MenuItem>
        </TextField>

        <TextField
          select
          label="Müşteri"
          value={selectedCustomerId}
          onChange={handleCustomerChange}
          fullWidth
          margin="normal"
          required
          error={error}
          helperText={error ? 'Lütfen bir Müşteri seçiniz' : ''}
        >
         {customers.length === 0 ? (
            <MenuItem disabled>
              Henüz kayıtlı bir müşteri yok
            </MenuItem>
          ) : (
            customers.map(customer => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name} {customer.surname}
              </MenuItem>
            ))
          )}
        </TextField>
      </Box>

      {selectedPolicyType === 'traffic' || selectedPolicyType === 'kasko' ? (
        <Box>
          <TextField
            select
            label="Marka"
            value={trafficFormData.brand}
            onChange={handleBrandChange}
            fullWidth
            margin="normal"
          >
            {brands.map(brand => (
              <MenuItem key={brand} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Model"
            value={trafficFormData.model}
            onChange={handleModelChange}
            fullWidth
            margin="normal"
            disabled={!trafficFormData.brand}
          >
            {models.map(model => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Model Yılı"
            value={trafficFormData.model_year}
            onChange={handleChange}
            name="model_year"
            fullWidth
            margin="normal"
            disabled={!trafficFormData.model}
          >
            {modelYears.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Plaka İl Kodu"
            value={trafficFormData.plateCityCode}
            onChange={handleChange}
            name="plateCityCode"
            fullWidth
            margin="normal"
          />

          <TextField
            label="Plaka Kodu"
            value={trafficFormData.plateCode}
            onChange={handleChange}
            name="plateCode"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Motor Numarası"
            value={trafficFormData.engineNumber}
            onChange={handleChange}
            name="engineNumber"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Şasi Numarası"
            value={trafficFormData.frameNumber}
            onChange={handleChange}
            name="frameNumber"
            fullWidth
            margin="normal"
          />
        </Box>
      ) : selectedPolicyType === 'health' ? (
        <Box>
        <TextField
          select
          label="Sigara Kullanıyor Musunuz?"
          name="smokeStatus"
          value={healthFormData.smokeStatus}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Evet">Evet</MenuItem>
          <MenuItem value="Hayır">Hayır</MenuItem>
        </TextField>

        <TextField
          select
          label="Spor Yapıyor Musunuz?"
          name="sporStatus"
          value={healthFormData.sporStatus}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Evet">Evet</MenuItem>
          <MenuItem value="Hayır">Hayır</MenuItem>
        </TextField>

        <TextField
          select
          label="Daha Önce Ameliyat Oldunuz Mu?"
          name="operationStatus"
          value={healthFormData.operationStatus}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Evet">Evet</MenuItem>
          <MenuItem value="Hayır">Hayır</MenuItem>
        </TextField>

        <TextField
          select
          label="Kronik Hastalığınız Var mı?"
          name="chronicDiseaseStatus"
          value={healthFormData.chronicDiseaseStatus}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Evet">Evet</MenuItem>
          <MenuItem value="Hayır">Hayır</MenuItem>
        </TextField>
      </Box>
      ) : selectedPolicyType === 'dask' ? (
        <Box>
          <TextField
            label="Metrekare"
            value={daskFormData.squareMeter}
            onChange={handleChange}
            name="squareMeter"
            fullWidth
            margin="normal"
          />

          <TextField
            label="Bina Yaşı"
            value={daskFormData.buildingAge}
            onChange={handleChange}
            name="buildingAge"
            fullWidth
            margin="normal"
          />

          <TextField
            label="Kat Numarası"
            value={daskFormData.floorNumber}
            onChange={handleChange}
            name="floorNumber"
            fullWidth
            margin="normal"
          />

          <TextField
            label="Adres Kodu"
            value={daskFormData.addressCode}
            onChange={handleChange}
            name="addressCode"
            fullWidth
            margin="normal"
          />

          <TextField
            label="Kat Sayısı"
            value={daskFormData.numberBuildFloor}
            onChange={handleChange}
            name="numberBuildFloor"
            fullWidth
            margin="normal"
          />

          <TextField
            select
            label="Hasar Durumu"
            value={daskFormData.damageState}
            onChange={handleChange}
            name="damageState"
            fullWidth
            margin="normal"
          >
            <MenuItem value="hasarsız">Hasarsız</MenuItem>
            <MenuItem value="az hasarlı">Az Hasarlı</MenuItem>
            <MenuItem value="orta hasarlı">Orta Hasarlı</MenuItem>
            <MenuItem value="ağır hasarlı">Ağır Hasarlı</MenuItem>

          </TextField>
        </Box>
      ) : null}
          
             {buttonsVisible && (
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                sx={{ marginTop: '20px' }}
            >
                Hesapla
            </Button>
             )}

               {isPrimVisible && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                  <p>Prim: {prim !== null ? prim.toFixed(2) : '-'}</p> {/**/}
                </div>
              )}
            {isPrimVisible && (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveOffer}
                        fullWidth
                        sx={{ marginTop: '20px' }}
                    >
                        Teklifi Kaydet
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePayment}
                        fullWidth
                        sx={{ marginTop: '20px' }}
                    >
                        Ödeme Yap
                    </Button>
                   
                </>
            )}
       
    </Box>
  );
};

export default PolicyForm;


