import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../assets/logo.png';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: 'Accueil', path: '/' },
    { label: 'À propos', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Réserver', path: '/booking' },
    { label: 'Administration', path: '/admin' }
  ];

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
        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ 
                color: '#2c3e50',
                '&:hover': {
                  color: '#e74c3c',
                  backgroundColor: 'rgba(231, 76, 60, 0.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: '#fdf6f6',
                  minWidth: '200px'
                }
              }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={handleClose}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: '#2c3e50',
                    '&:hover': {
                      color: '#e74c3c',
                      backgroundColor: 'rgba(231, 76, 60, 0.1)'
                    }
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            gap: 3,
            '& .MuiButton-root': {
              borderRadius: '25px',
              padding: '12px 24px',
              transition: 'all 0.3s ease'
            }
          }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={RouterLink}
                to={item.path}
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
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 