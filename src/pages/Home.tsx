import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import homeData from '../data/home.json';
import { images } from '../utils/imageImports';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${images[homeData.hero.image as keyof typeof images]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontFamily: 'Playfair Display, serif',
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 2
            }}
          >
            {homeData.hero.title}
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontFamily: 'Playfair Display, serif',
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              mb: 3
            }}
          >
            {homeData.hero.subtitle}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, fontSize: { xs: '1rem', md: '1.2rem' } }}>
            {homeData.hero.description}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/booking')}
            sx={{
              backgroundColor: '#e74c3c',
              '&:hover': {
                backgroundColor: '#c0392b'
              }
            }}
          >
            Réserver un service
          </Button>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          sx={{
            textAlign: 'center',
            fontFamily: 'Playfair Display, serif',
            color: '#2c3e50',
            mb: 6,
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          {homeData.services.title}
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            textAlign: 'center',
            color: '#7f8c8d',
            mb: 6,
            fontSize: { xs: '1.2rem', md: '1.5rem' }
          }}
        >
          {homeData.services.description}
        </Typography>
        <Grid container spacing={4}>
          {homeData.services.items.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={images[service.image as keyof typeof images]}
                  alt={service.title}
                  sx={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '200px'
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    sx={{
                      fontFamily: 'Playfair Display, serif',
                      color: '#2c3e50'
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ backgroundColor: '#f8f9fa', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              fontFamily: 'Playfair Display, serif',
              color: '#2c3e50',
              mb: 6,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            {homeData.testimonials.title}
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              textAlign: 'center',
              color: '#7f8c8d',
              mb: 6,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            {homeData.testimonials.description}
          </Typography>
          <Grid container spacing={4}>
            {homeData.testimonials.items.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3
                  }}
                >
                  <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                  <Typography
                    variant="body1"
                    sx={{ mb: 2, fontStyle: 'italic' }}
                  >
                    "{testimonial.text}"
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', mt: 'auto' }}
                  >
                    {testimonial.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          sx={{
            textAlign: 'center',
            fontFamily: 'Playfair Display, serif',
            color: '#2c3e50',
            mb: 6,
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          {homeData.contact.title}
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            textAlign: 'center',
            color: '#7f8c8d',
            mb: 6,
            fontSize: { xs: '1.2rem', md: '1.5rem' }
          }}
        >
          {homeData.contact.description}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Téléphone
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {homeData.contact.phone}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {homeData.contact.email}
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Adresse
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {homeData.contact.address}
              </Typography>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/booking')}
            sx={{
              backgroundColor: '#e74c3c',
              '&:hover': {
                backgroundColor: '#c0392b'
              }
            }}
          >
            Réserver un service
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 