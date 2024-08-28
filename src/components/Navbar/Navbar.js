
import { Button } from '@mui/material';
import { ExitToApp, Home, ListAlt, PersonAdd, Add } from '@mui/icons-material'; 
import {React,useState} from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';
import { Edit,AccountCircle  } from '@mui/icons-material';

function Navbar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const location = useLocation(); 

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Token'ı temizle
    navigate('/'); // Giriş sayfasına yönlendir
  };
  const [showButtons, setShowButtons] = useState(false);

  const handleProfileClick = () => {
    setShowButtons(!showButtons);
  };
  const handleEditUser = () =>{

    navigate(`/user/edit/${userId}`);

  }

  const showHomeButton = location.pathname === '/customer/customerList' || location.pathname === '/policy';
  return (
    <nav style={{
      padding: '10px 20px',
      backgroundColor: '#344952',
      color: '#ecf0f1',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)', 
      borderBottom: '2px solid #2c3e50' 
    }}>
      <h1 style={{ margin: 0 }}>Can Sigortacılık</h1>
      <div>


      {showHomeButton && (
          <Button
            variant="contained"
            style={{
              marginRight: '10px',
              textTransform: 'none',
              backgroundColor: '#1abc9c', 
              color: '#fff',
              borderRadius: '25px', 
              transition: 'background-color 0.3s, transform 0.3s',
            }}
            onClick={() => navigate('/home')} 
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#16a085';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1abc9c'; 
              e.currentTarget.style.transform = 'scale(1)'; 
            }}
            startIcon={<Home />} 
          >
            Anasayfa
          </Button>
        )}

        <Button
          variant="contained"
          style={{
            marginRight: '10px',
            textTransform: 'none',
            backgroundColor: '#1abc9c', 
            color: '#fff',
            borderRadius: '25px',
            transition: 'background-color 0.3s, transform 0.3s',
          }}
          onClick={() => navigate('/addpolicy')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#16a085'; 
            e.currentTarget.style.transform = 'scale(1.05)'; 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1abc9c'; 
            e.currentTarget.style.transform = 'scale(1)'; 
          }}
          startIcon={<Add />}
        >
          Yeni Poliçe
        </Button>
        <Button
          variant="contained"
          style={{
            marginRight: '10px',
            textTransform: 'none',
            backgroundColor: '#1abc9c', 
            color: '#fff',
            borderRadius: '25px', 
            transition: 'background-color 0.3s, transform 0.3s',
          }}
          onClick={() => navigate('/customer/addcustomer')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#16a085'; 
            e.currentTarget.style.transform = 'scale(1.05)'; 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1abc9c'; 
            e.currentTarget.style.transform = 'scale(1)'; 
          }}
          startIcon={<PersonAdd />} 
        >
          Müşteri Ekle
        </Button>
        <Button
          variant="contained"
          style={{
            marginRight: '10px',
            textTransform: 'none',
            backgroundColor: '#1abc9c', 
            color: '#fff',
            borderRadius: '25px', 
            transition: 'background-color 0.3s, transform 0.3s',
          }}
          onClick={() => navigate('/policy')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#16a085'; 
            e.currentTarget.style.transform = 'scale(1.05)'; 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1abc9c'; 
            e.currentTarget.style.transform = 'scale(1)'; 
          }}
          startIcon={<ListAlt />} 

        >
          Poliçeleri Listele
        </Button>
        <Button
          variant="contained"
          style={{
            marginRight: '10px',
            textTransform: 'none',
            backgroundColor: '#1abc9c', 
            color: '#fff',
            borderRadius: '25px',
            transition: 'background-color 0.3s, transform 0.3s',
          }}
          onClick={() => navigate('/customer/customerList')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#16a085'; 
            e.currentTarget.style.transform = 'scale(1.05)'; 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1abc9c'; 
            e.currentTarget.style.transform = 'scale(1)'; 
          }}
          startIcon={<ListAlt />} 
        >
          Müşterileri Listele
        </Button>
      
        <Button
          variant="contained"
          style={{
            backgroundColor: '#3498db',
            color: '#fff',
            borderRadius: '25px',
            transition: 'background-color 0.3s, transform 0.3s',
          }}
          onClick={handleProfileClick}
          startIcon={<AccountCircle  />}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2980b9';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3498db';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
        Profilim
      </Button>

      {showButtons && (
 
     <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end', 
      position: 'relative', 
      right: '10px', 
      top: '10px', 
    }}
  >
    <Button
      variant="contained"
      size="small"
      style={{
        backgroundColor: '#e74c3c',
        color: '#fff',
        borderRadius: '25px',
        transition: 'background-color 0.3s, transform 0.3s',
        marginTop: '10px',
      }}
      onClick={handleLogout}
      startIcon={<ExitToApp />}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#c0392b';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#e74c3c';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      Çıkış Yap
    </Button>

    <Button
      variant="contained"
      size="small"
      style={{
        backgroundColor: '#2ecc71',
        color: '#fff',
        borderRadius: '25px',
        transition: 'background-color 0.3s, transform 0.3s',
        marginTop: '10px',
      }}
      onClick={handleEditUser}
      startIcon={<Edit />}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#27ae60';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#2ecc71';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      Düzenle
    </Button>
  </div>
)}

      </div>
    </nav>
  );
}

export default Navbar;
