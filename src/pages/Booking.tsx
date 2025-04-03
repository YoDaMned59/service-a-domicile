import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Box,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { config } from '../config';
import { format, addMinutes, parse, isWithinInterval } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import servicesData from '../data/services.json';

// Correction des icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Coordonnées du salon (Meteren)
const BUSINESS_LOCATION: [number, number] = [50.7859, 2.6743];

// Centre de la zone de travail (Bavinchove)
const WORK_ZONE_CENTER: [number, number] = [50.7897, 2.5947];
const MAX_WORK_DISTANCE = 20; // km

// Composant pour mettre à jour la vue de la carte
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface FormData {
  service: string;
  date: string;
  time: string;
  clientName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface Reservation extends FormData {
  id: string;
  status: 'pending' | 'confirmed';
  distance: number;
  clientLocation: {
    lat: number;
    lng: number;
  };
}

interface MapMarkers {
  client: { lat: number; lng: number } | null;
}

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

// Fonction pour calculer la distance entre deux points
const calculateDistanceBetweenPoints = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R: number = 6371; // Rayon de la Terre en km
  const lat1Rad: number = lat1 * Math.PI / 180;
  const lat2Rad: number = lat2 * Math.PI / 180;
  const deltaLat: number = (lat2 - lat1) * Math.PI / 180;
  const deltaLon: number = (lon2 - lon1) * Math.PI / 180;

  const a: number = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Fonction pour géocoder une adresse
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  try {
    const response = await fetch(
      `${config.geocoding.apiUrl}${config.geocoding.searchEndpoint}?` +
      `format=${config.geocoding.format}&` +
      `q=${encodeURIComponent(address)}&` +
      `addressdetails=${config.geocoding.addressDetails}&` +
      `limit=${config.geocoding.limit}&` +
      `countrycodes=${config.geocoding.countryCodes}`,
      {
        headers: {
          'Accept-Language': config.geocoding.language,
          'User-Agent': config.geocoding.userAgent
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur de géocodage: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('Adresse non trouvée');
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error('Erreur lors du géocodage:', error);
    throw error;
  }
};

// Fonction pour calculer la distance entre deux points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const deltaLat = (lat2 - lat1) * Math.PI / 180;
  const deltaLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Fonction pour vérifier la disponibilité d'un créneau
const checkAvailability = async (
  date: string,
  time: string,
  duration: string,
  allServices: Array<Service & { categoryId: string; categoryName: string }>
): Promise<boolean> => {
  try {
    // Récupérer les réservations existantes
    const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]') as Reservation[];
    const dateReservations = savedReservations.filter(
      res => res.date === date && 
      (res.status === 'confirmed' || res.status === 'pending')
    );

    // Convertir la durée en minutes
    const durationMinutes = parseInt(duration);
    const requestedStart = parse(time, 'HH:mm', new Date());
    const requestedEnd = addMinutes(requestedStart, durationMinutes);

    // Vérifier les chevauchements
    for (const reservation of dateReservations) {
      const resStart = parse(reservation.time, 'HH:mm', new Date());
      const resService = allServices.find((s: Service & { categoryId: string; categoryName: string }) => s.id === reservation.service);
      if (!resService) continue;
      
      const resEnd = addMinutes(resStart, resService.duration);
      
      if (
        (requestedStart >= resStart && requestedStart < resEnd) ||
        (requestedEnd > resStart && requestedEnd <= resEnd) ||
        (requestedStart <= resStart && requestedEnd >= resEnd)
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification des disponibilités:', error);
    throw error;
  }
};

const Booking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    service: '',
    date: '',
    time: '',
    clientName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
  });

  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markers, setMarkers] = useState<MapMarkers>({ client: null });

  const services = (servicesData as ServicesData).categories.flatMap(category => 
    category.services.map(service => ({
      ...service,
      categoryId: category.id,
      categoryName: category.name
    }))
  );

  // Fonction pour générer les créneaux horaires disponibles
  const generateTimeSlots = useCallback((selectedDate: string, selectedService: string) => {
    if (!selectedDate || !selectedService) return [];

    const service = services.find(s => s.id === selectedService);
    if (!service) return [];
    
    const serviceDuration = service.duration;
    
    const slots: TimeSlot[] = [];
    const workStart = parse(config.workingHours.start, 'HH:mm', new Date());
    const workEnd = parse(config.workingHours.end, 'HH:mm', new Date());
    const breakStart = parse(config.workingHours.breakStart, 'HH:mm', new Date());
    const breakEnd = parse(config.workingHours.breakEnd, 'HH:mm', new Date());

    // Récupérer les réservations existantes
    const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]') as Reservation[];
    const dateReservations = savedReservations.filter(
      res => res.date === selectedDate && 
      res.status === 'pending'
    ).sort((a, b) => a.time.localeCompare(b.time));

    let currentTime = workStart;

    while (currentTime < workEnd) {
      const slotEnd = addMinutes(currentTime, serviceDuration);
      const slotStart = format(currentTime, 'HH:mm');
      const slotEndStr = format(slotEnd, 'HH:mm');
      
      // Vérifie si le créneau ne chevauche pas la pause déjeuner
      const isInBreak = isWithinInterval(currentTime, { start: breakStart, end: breakEnd }) ||
                       isWithinInterval(slotEnd, { start: breakStart, end: breakEnd });

      // Vérifie si le créneau est déjà réservé
      const isSlotBooked = dateReservations.some(reservation => {
        const resStart = parse(reservation.time, 'HH:mm', new Date());
        const resService = services.find(s => s.id === reservation.service);
        if (!resService) return false;
        
        const resEnd = addMinutes(resStart, resService.duration);
        return (
          (currentTime >= resStart && currentTime < resEnd) ||
          (slotEnd > resStart && slotEnd <= resEnd) ||
          (currentTime <= resStart && slotEnd >= resEnd)
        );
      });

      if (!isInBreak && slotEnd <= workEnd) {
        slots.push({
          start: slotStart,
          end: slotEndStr,
          available: !isSlotBooked
        });
      }

      currentTime = addMinutes(currentTime, 30);
    }

    return slots.filter(slot => slot.available);
  }, [services]);

  // Met à jour les créneaux disponibles quand le service ou la date change
  useEffect(() => {
    if (formData.service && formData.date) {
      const slots = generateTimeSlots(formData.date, formData.service);
      setAvailableTimeSlots(slots);
    }
  }, [formData.service, formData.date, generateTimeSlots]);

  // Calcul de la distance quand l'adresse change
  useEffect(() => {
    if (!formData.address || !formData.postalCode || !formData.city || !formData.service) return;

    const calculateClientDistance = async () => {
      try {
        const fullAddress = `${formData.address}, ${formData.postalCode} ${formData.city}`;
        console.log('Calcul de la distance pour:', fullAddress);
        console.log('Centre de la zone de travail (Bavinchove):', WORK_ZONE_CENTER);

        // Utiliser l'API adresse.data.gouv.fr pour le géocodage de l'adresse complète
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/search/?` +
          `q=${encodeURIComponent(fullAddress)}&` +
          `limit=1`
        );
        
        if (!response.ok) {
          throw new Error(`Erreur de géocodage: ${response.status}`);
        }

        let data = await response.json();
        console.log('Réponse API adresse:', data);
        
        if (!data.features || data.features.length === 0) {
          throw new Error('Adresse non trouvée. Veuillez vérifier votre adresse.');
        }

        const clientLocation = {
          lat: data.features[0].geometry.coordinates[1],
          lng: data.features[0].geometry.coordinates[0]
        };
        console.log('Position client:', clientLocation);

        // Vérifier si l'adresse est dans le rayon de 20km par rapport à Bavinchove
        const distanceToCenter = calculateDistanceBetweenPoints(
          WORK_ZONE_CENTER[0],
          WORK_ZONE_CENTER[1],
          clientLocation.lat,
          clientLocation.lng
        );

        console.log('Distance depuis Bavinchove:', distanceToCenter, 'km');
        console.log('Distance maximale autorisée:', MAX_WORK_DISTANCE, 'km');

        if (distanceToCenter > MAX_WORK_DISTANCE) {
          throw new Error(`Désolé, nous ne desservons que les secteurs dans un rayon de ${MAX_WORK_DISTANCE}km autour de Bavinchove.`);
        }

        // Récupérer les réservations existantes pour la date sélectionnée
        const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]') as Reservation[];
        const dateReservations = savedReservations.filter(
          res => res.date === formData.date && 
          (res.status === 'confirmed' || res.status === 'pending')
        ).sort((a, b) => a.time.localeCompare(b.time));
        
        let distanceToTravel = 0;
        
        if (dateReservations.length === 0) {
          // Si c'est le premier client de la journée, la distance est calculée depuis le salon
          distanceToTravel = calculateDistanceBetweenPoints(
            BUSINESS_LOCATION[0],
            BUSINESS_LOCATION[1],
            clientLocation.lat,
            clientLocation.lng
          );
        } else {
          // Sinon, on utilise la position de la ville du dernier client
          const lastReservation = dateReservations[dateReservations.length - 1];
          if (lastReservation.clientLocation) {
            distanceToTravel = calculateDistanceBetweenPoints(
              lastReservation.clientLocation.lat,
              lastReservation.clientLocation.lng,
              clientLocation.lat,
              clientLocation.lng
            );
          } else {
            // Si le dernier client n'a pas de coordonnées, on utilise la distance depuis le salon
            distanceToTravel = calculateDistanceBetweenPoints(
              BUSINESS_LOCATION[0],
              BUSINESS_LOCATION[1],
              clientLocation.lat,
              clientLocation.lng
            );
          }
        }
        
        console.log('Distance à parcourir:', distanceToTravel, 'km');
        
        setDistance(distanceToTravel);
        setMarkers({ client: clientLocation });
        setError(null);
      } catch (error) {
        console.error('Erreur lors du calcul de la distance:', error);
        setError(error instanceof Error ? error.message : 'Impossible de calculer la distance. Veuillez vérifier votre adresse.');
        setDistance(null);
      }
    };

    calculateClientDistance();
  }, [formData.address, formData.postalCode, formData.city, formData.service, formData.date]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as keyof FormData]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    console.log('Sélection changée:', name, value);
    
    setFormData(prev => ({
      ...prev,
      [name as keyof FormData]: value,
      ...(name === 'service' ? { time: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Soumission du formulaire:', formData);

    // Vérifier si l'adresse est dans la zone de travail
    try {
      const clientLocation = await geocodeAddress(formData.address);
      const distance = calculateDistance(
        WORK_ZONE_CENTER[0],
        WORK_ZONE_CENTER[1],
        clientLocation.lat,
        clientLocation.lng
      );

      if (distance > MAX_WORK_DISTANCE) {
        setError('L\'adresse est en dehors de notre zone de travail');
        return;
      }

      // Vérifier les disponibilités
      const isAvailable = await checkAvailability(
        formData.date,
        formData.time,
        getServiceDuration(formData.service),
        services
      );

      if (!isAvailable) {
        setError('Ce créneau n\'est plus disponible');
        return;
      }

      // Créer la réservation
      const reservation: Reservation = {
        id: Date.now().toString(),
        service: formData.service,
        date: formData.date,
        time: formData.time,
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        status: 'pending',
        distance: distance,
        clientLocation: clientLocation
      };

      // Sauvegarder la réservation
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      localStorage.setItem('reservations', JSON.stringify([...existingReservations, reservation]));

      // Rediriger vers la page de confirmation
      navigate('/confirmation', { state: { reservation } });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setError('Une erreur est survenue lors de la réservation');
    }
  };

  const getServiceDuration = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? `${service.duration} minutes` : '';
  };

  const calculateTotalPrice = () => {
    if (!formData.service) return 0;
    const service = services.find(s => s.id === formData.service);
    return service ? service.price : 0;
  };

  // Fonction pour récupérer les villes par code postal
  const fetchCitiesByPostalCode = async (postalCode: string) => {
    try {
      console.log('Recherche des villes pour le code postal:', postalCode);
      
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?` +
        `q=${postalCode}&` +
        `type=municipality&` +
        `limit=50`
      );

      if (!response.ok) {
        throw new Error(`Erreur de géocodage: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse API adresse:', data);

      if (!data.features || data.features.length === 0) {
        console.log('Aucune ville trouvée pour ce code postal');
        setAvailableCities([]);
        return [];
      }

      // Extraire les noms de villes uniques
      const cities = data.features
        .map((feature: any) => {
          console.log('Ville trouvée:', feature.properties.city);
          return feature.properties.city;
        })
        .filter(Boolean)
        .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
        .sort((a: string, b: string) => a.localeCompare(b));
      
      console.log('Liste finale des villes:', cities);
      
      setAvailableCities(cities);
      return cities;
    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
      setAvailableCities([]);
      return [];
    }
  };

  // Modifier le gestionnaire de changement de code postal
  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Code postal saisi:', value);
    
    setFormData(prev => ({
      ...prev,
      postalCode: value,
      city: '' // Réinitialiser la ville quand le code postal change
    }));

    if (value.length === 5) {
      console.log('Recherche des villes pour le code postal:', value);
      await fetchCitiesByPostalCode(value);
    } else {
      setAvailableCities([]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        fontFamily: 'Playfair Display, serif',
        color: '#2c3e50'
      }}>
        Réserver un Service
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Service</InputLabel>
                <Select
                  name="service"
                  value={formData.service}
                  onChange={handleSelectChange}
                  required
                >
                  {services.map((service) => (
                    <MenuItem key={service.id} value={service.id}>
                      <Box>
                        <Typography>{service.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {service.categoryName} - {service.duration} min - {service.price}€
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="date"
                label="Date"
                name="date"
                value={formData.date}
                onChange={handleTextChange}
                margin="normal"
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: format(new Date(), 'yyyy-MM-dd')
                }}
              />

              {formData.service && formData.date && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Heure</InputLabel>
                  <Select
                    name="time"
                    value={formData.time}
                    onChange={handleSelectChange}
                    required
                  >
                    {availableTimeSlots.map((slot) => (
                      <MenuItem key={slot.start} value={slot.start} disabled={!slot.available}>
                        {slot.start} - {slot.end}
                      </MenuItem>
                    ))}
                  </Select>
                  {formData.service && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Durée du service : {getServiceDuration(formData.service)}
                    </Typography>
                  )}
                </FormControl>
              )}

              <TextField
                fullWidth
                label="Adresse"
                name="address"
                value={formData.address}
                onChange={handleTextChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Code Postal"
                name="postalCode"
                value={formData.postalCode}
                onChange={handlePostalCodeChange}
                margin="normal"
                required
                inputProps={{
                  maxLength: 5,
                  pattern: '[0-9]*'
                }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Ville</InputLabel>
                <Select
                  name="city"
                  value={formData.city}
                  onChange={handleSelectChange}
                  required
                  disabled={!formData.postalCode || availableCities.length === 0}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                  </MenuItem>
                  {availableCities.map((city: string) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Nom et Prénom"
                name="clientName"
                value={formData.clientName}
                onChange={handleTextChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleTextChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Téléphone"
                name="phone"
                value={formData.phone}
                onChange={handleTextChange}
                margin="normal"
                required
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={isSubmitting}
                  sx={{ 
                    backgroundColor: '#e74c3c',
                    '&:hover': {
                      backgroundColor: '#c0392b'
                    }
                  }}
                >
                  {isSubmitting ? "Traitement en cours..." : "Réserver et Payer l'Acompte"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#2c3e50'
            }}>
              Distance et Localisation
            </Typography>
            <Box sx={{ height: 400, mb: 2 }}>
              <MapContainer
                center={WORK_ZONE_CENTER}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={WORK_ZONE_CENTER} />
                {markers.client && (
                  <Marker position={[markers.client.lat, markers.client.lng]} />
                )}
                <ChangeView 
                  center={markers.client ? [markers.client.lat, markers.client.lng] : WORK_ZONE_CENTER}
                  zoom={13}
                />
              </MapContainer>
            </Box>
            {distance !== null && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Distance à parcourir : {distance.toFixed(1)} km
                </Typography>
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Booking; 