import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ExpandMore, Spa, Star, Favorite } from '@mui/icons-material';
import servicesData from '../data/services.json';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Category {
  id: string;
  name: string;
  icon: 'Spa' | 'Star' | 'Favorite';
  description: string;
  services: Service[];
}

interface ServicesData {
  categories: Category[];
}

const iconMap = {
  Spa: <Spa />,
  Star: <Star />,
  Favorite: <Favorite />
};

const Services = () => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const services = servicesData as ServicesData;

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          textAlign: 'center',
          fontFamily: 'Playfair Display, serif',
          color: '#2c3e50',
          mb: 6,
          fontSize: { xs: '2.5rem', md: '3.5rem' }
        }}
      >
        Nos Services
      </Typography>

      <Grid container spacing={4}>
        {services.categories.map((category) => (
          <Grid item xs={12} key={category.id}>
            <Accordion
              expanded={expanded === category.id}
              onChange={handleChange(category.id)}
              sx={{
                backgroundColor: '#fff',
                '&:before': {
                  display: 'none',
                },
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: '15px !important',
                mb: 2,
                overflow: 'hidden'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  backgroundColor: expanded === category.id ? '#f8f9fa' : 'transparent',
                  '&:hover': {
                    backgroundColor: '#f8f9fa'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: '#e74c3c',
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    {iconMap[category.icon as keyof typeof iconMap]}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'Playfair Display, serif',
                        color: '#2c3e50'
                      }}
                    >
                      {category.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: { xs: 'none', md: 'block' }
                      }}
                    >
                      {category.description}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body1"
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    mb: 2
                  }}
                >
                  {category.description}
                </Typography>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell align="right">Durée</TableCell>
                        <TableCell align="right">Prix</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {category.services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell component="th" scope="row">
                            {service.name}
                          </TableCell>
                          <TableCell align="right">{service.duration} min</TableCell>
                          <TableCell align="right">{service.price} €</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Services; 