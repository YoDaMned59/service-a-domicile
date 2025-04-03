import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ 
      backgroundColor: '#fff',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      borderBottom: '1px solid #eee'
    }}>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center',
        minHeight: '180px',
        padding: '20px 32px',
        backgroundColor: '#fdf6f6'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexGrow: 1,
          gap: '32px'
        }}>
          <Box sx={{
            width: '160px',
            height: '160px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#fdf6f6'
          }}>
            <img 
              src={logo}
              alt="À Fleur de Peau" 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transform: 'scale(1.1)'
              }}
            />
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              alignItems: 'center',
              fontFamily: 'Playfair Display, serif',
              color: '#2c3e50',
              fontSize: '2.5rem',
              fontWeight: 600,
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Home Beautician
          </Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 3,
          '& .MuiButton-root': {
            borderRadius: '25px',
            padding: '12px 24px',
            transition: 'all 0.3s ease'
          }
        }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ 
              color: '#2c3e50',
              fontSize: '1.2rem',
              fontWeight: 500,
              '&:hover': {
                color: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)'
              }
            }}
          >
            Accueil
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/about"
            sx={{ 
              color: '#2c3e50',
              fontSize: '1.2rem',
              fontWeight: 500,
              '&:hover': {
                color: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)'
              }
            }}
          >
            À propos
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/services"
            sx={{ 
              color: '#2c3e50',
              fontSize: '1.2rem',
              fontWeight: 500,
              '&:hover': {
                color: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)'
              }
            }}
          >
            Services
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/booking"
            sx={{ 
              color: '#2c3e50',
              fontSize: '1.2rem',
              fontWeight: 500,
              '&:hover': {
                color: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)'
              }
            }}
          >
            Réserver
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/admin"
            sx={{ 
              color: '#2c3e50',
              fontSize: '1.2rem',
              fontWeight: 500,
              '&:hover': {
                color: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)'
              }
            }}
          >
            Administration
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 