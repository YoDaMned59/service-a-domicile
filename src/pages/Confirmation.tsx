import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import servicesData from '../data/services.json';

interface Reservation {
  id: string;
  service: string;
  date: string;
  time: string;
  clientName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  distance: number;
  clientLocation?: { lat: number; lng: number };
}

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reservation = location.state?.reservation as Reservation;

  if (!reservation) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Aucune réservation trouvée. Veuillez retourner à la page de réservation.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/booking')}
          sx={{ mt: 2 }}
        >
          Retour à la réservation
        </Button>
      </Container>
    );
  }

  // Trouver le service correspondant
  const service = servicesData.categories
    .flatMap(category => category.services)
    .find(s => s.id === reservation.service);

  if (!service) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Service non trouvé. Veuillez retourner à la page de réservation.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/booking')}
          sx={{ mt: 2 }}
        >
          Retour à la réservation
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontFamily: 'Playfair Display, serif',
          color: '#2c3e50',
          textAlign: 'center'
        }}>
          Confirmation de Réservation
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Détails de la Réservation
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Service"
                secondary={service.name}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Date et Heure"
                secondary={format(new Date(`${reservation.date}T${reservation.time}`), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Durée"
                secondary={`${service.duration} minutes`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Prix"
                secondary={`${service.price}€`}
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Informations Client
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Nom"
                secondary={reservation.clientName}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={reservation.email}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Téléphone"
                secondary={reservation.phone}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Adresse"
                secondary={`${reservation.address}, ${reservation.postalCode} ${reservation.city}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Distance"
                secondary={`${reservation.distance.toFixed(1)} km`}
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Votre réservation a bien été enregistrée. Vous recevrez un email de confirmation dans quelques instants.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Retour à l'accueil
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Confirmation; 