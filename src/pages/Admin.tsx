import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  TextField,
  MenuItem
} from '@mui/material';
import { format, isBefore, parseISO, addMinutes } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import servicesData from '../data/services.json';

interface Reservation {
  id: string;
  service: string;
  date: string;
  time: string;
  clientName: string;
  address: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  distance: number;
  email: string;
  phone: string;
  clientLocation?: { lat: number; lng: number };
}

interface AdminCredentials {
  email: string;
  password: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  categoryName: string;
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

// Initialiser les identifiants par défaut si non existants
const initializeAdminCredentials = () => {
  const savedCredentials = localStorage.getItem('adminCredentials');
  if (!savedCredentials) {
    const defaultCredentials: AdminCredentials = {
      email: 'sduviviertech@outlook.fr',
      password: 'password123'
    };
    localStorage.setItem('adminCredentials', JSON.stringify(defaultCredentials));
    console.log('Identifiants par défaut initialisés:', defaultCredentials);
  }
};

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newCredentials, setNewCredentials] = useState({ email: '', password: '', confirmPassword: '' });
  const [credentialsError, setCredentialsError] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    service: 'all',
    date: '',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Reservation;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [lastPositionAddress, setLastPositionAddress] = useState('');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Initialiser les identifiants au chargement
  useEffect(() => {
    initializeAdminCredentials();
  }, []);

  // Récupérer tous les services
  const allServices = (servicesData as ServicesData).categories.flatMap((category: Category) => 
    category.services.map((service: Service) => ({
      ...service,
      categoryName: category.name
    }))
  );

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const savedCredentials = JSON.parse(localStorage.getItem('adminCredentials') || '{}') as AdminCredentials;
    console.log('Identifiants sauvés:', savedCredentials);
    console.log('Identifiants saisis:', loginData);
    
    if (loginData.email === savedCredentials.email && loginData.password === savedCredentials.password) {
      setIsAuthenticated(true);
      setAuthError('');
      sessionStorage.setItem('adminAuthenticated', 'true');
    } else {
      setAuthError('Email ou mot de passe incorrect');
    }
  };

  const handleChangeCredentials = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCredentialsError('');

    if (newCredentials.password !== newCredentials.confirmPassword) {
      setCredentialsError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newCredentials.password.length < 8) {
      setCredentialsError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    const updatedCredentials: AdminCredentials = {
      email: newCredentials.email,
      password: newCredentials.password
    };

    localStorage.setItem('adminCredentials', JSON.stringify(updatedCredentials));
    setShowChangePassword(false);
    setSnackbar({
      open: true,
      message: 'Identifiants mis à jour avec succès',
      severity: 'success'
    });
  };

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const isAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  // Charger et nettoyer les réservations
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadAndCleanReservations = () => {
      const savedReservations = localStorage.getItem('reservations');
      if (savedReservations) {
        let allReservations = JSON.parse(savedReservations) as Reservation[];
        const now = new Date();

        // Filtrer les réservations
        const updatedReservations = allReservations.filter(reservation => {
          // Supprimer les réservations annulées
          if (reservation.status === 'cancelled') {
            return false;
          }

          // Pour les réservations confirmées, vérifier si elles sont passées
          if (reservation.status === 'confirmed') {
            const reservationDate = parseISO(`${reservation.date}T${reservation.time}`);
            const reservationEndTime = addMinutes(reservationDate, 120);
            return !isBefore(reservationEndTime, now);
          }

          return true;
        });

        if (updatedReservations.length !== allReservations.length) {
          localStorage.setItem('reservations', JSON.stringify(updatedReservations));
          setSnackbar({
            open: true,
            message: 'Les réservations obsolètes ont été nettoyées',
            severity: 'info'
          });
        }

        setReservations(updatedReservations);
      }
    };

    loadAndCleanReservations();
    const interval = setInterval(loadAndCleanReservations, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Ajouter la fonction de filtrage et de tri
  useEffect(() => {
    let filtered = [...reservations];

    // Appliquer les filtres
    if (filters.status !== 'all') {
      filtered = filtered.filter(res => res.status === filters.status);
    }
    if (filters.service !== 'all') {
      filtered = filtered.filter(res => res.service === filters.service);
    }
    if (filters.date) {
      filtered = filtered.filter(res => res.date === filters.date);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(res => 
        res.clientName.toLowerCase().includes(searchLower) ||
        res.email.toLowerCase().includes(searchLower) ||
        res.phone.includes(searchLower)
      );
    }

    // Appliquer le tri
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredReservations(filtered);
  }, [reservations, filters, sortConfig]);

  const handleSort = (key: keyof Reservation) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
    navigate('/');
  };

  const handleStatusChange = (id: string, newStatus: 'confirmed' | 'cancelled') => {
    const updatedReservations = reservations.filter(res => {
      if (res.id === id) {
        // Si la réservation est annulée, elle sera filtrée
        return newStatus !== 'cancelled';
      }
      return true;
    }).map(res => {
      if (res.id === id) {
        return { ...res, status: newStatus };
      }
      return res;
    });

    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    
    setSnackbar({
      open: true,
      message: newStatus === 'cancelled' 
        ? 'Réservation annulée et supprimée'
        : 'Réservation confirmée avec succès',
      severity: 'success'
    });
  };

  const formatDateTime = (date: string, time: string) => {
    const dateTime = parseISO(`${date}T${time}`);
    return format(dateTime, 'dd/MM/yyyy à HH:mm');
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setOpenDialog(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

  // Fonction pour géocoder une adresse
  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` + 
        `format=json&` +
        `q=${encodeURIComponent(address)}&` +
        `addressdetails=1&` +
        `limit=1&` +
        `countrycodes=fr`,
        {
          headers: {
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'User-Agent': 'À Fleur de Peau Booking System'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erreur de géocodage');
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
      console.error('Erreur de géocodage:', error);
      throw error;
    }
  };

  // Fonction pour mettre à jour la dernière position
  const handleUpdateLastPosition = async () => {
    try {
      const position = await geocodeAddress(lastPositionAddress);
      setLastPosition(position);
      setSnackbar({
        open: true,
        message: 'Dernière position mise à jour avec succès',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la mise à jour de la position',
        severity: 'error'
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontFamily: 'Playfair Display, serif',
            color: '#2c3e50',
            textAlign: 'center'
          }}>
            Administration
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Mot de passe"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              margin="normal"
              required
              error={!!authError}
              helperText={authError}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Se connecter
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontFamily: 'Playfair Display, serif',
          color: '#2c3e50'
        }}>
          Administration des Réservations
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowChangePassword(true)}
          >
            Modifier les identifiants
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </Box>
      </Box>

      <Dialog open={showChangePassword} onClose={() => setShowChangePassword(false)}>
        <DialogTitle>Modifier les identifiants</DialogTitle>
        <form onSubmit={handleChangeCredentials}>
          <DialogContent>
            <TextField
              fullWidth
              type="email"
              label="Nouvel email"
              value={newCredentials.email}
              onChange={(e) => setNewCredentials({ ...newCredentials, email: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Nouveau mot de passe"
              value={newCredentials.password}
              onChange={(e) => setNewCredentials({ ...newCredentials, password: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="password"
              label="Confirmer le mot de passe"
              value={newCredentials.confirmPassword}
              onChange={(e) => setNewCredentials({ ...newCredentials, confirmPassword: e.target.value })}
              margin="normal"
              required
              error={!!credentialsError}
              helperText={credentialsError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowChangePassword(false)}>Annuler</Button>
            <Button type="submit" variant="contained" color="primary">
              Enregistrer
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Rechercher"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          size="small"
          sx={{ minWidth: 200 }}
        />
        <TextField
          select
          label="Statut"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">Tous</MenuItem>
          <MenuItem value="pending">En attente</MenuItem>
          <MenuItem value="confirmed">Confirmé</MenuItem>
          <MenuItem value="cancelled">Annulé</MenuItem>
        </TextField>
        <TextField
          select
          label="Service"
          value={filters.service}
          onChange={(e) => setFilters({ ...filters, service: e.target.value })}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">Tous</MenuItem>
          {allServices.map((service: Service) => (
            <MenuItem key={service.id} value={service.id}>
              {service.name} ({service.categoryName})
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="date"
          label="Date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          size="small"
          sx={{ minWidth: 150 }}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Votre dernière position"
          value={lastPositionAddress}
          onChange={(e) => setLastPositionAddress(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          placeholder="Ex: 6 rue neuve, 59270 Meteren, France"
        />
        <Button
          variant="contained"
          onClick={handleUpdateLastPosition}
          size="small"
        >
          Mettre à jour
        </Button>
      </Box>

      {filteredReservations.length === 0 ? (
        <Alert severity="info">Aucune réservation ne correspond à vos critères</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort('date')} sx={{ cursor: 'pointer' }}>
                  Date et Heure {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell onClick={() => handleSort('service')} sx={{ cursor: 'pointer' }}>
                  Service {sortConfig?.key === 'service' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell onClick={() => handleSort('clientName')} sx={{ cursor: 'pointer' }}>
                  Client {sortConfig?.key === 'clientName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell onClick={() => handleSort('distance')} sx={{ cursor: 'pointer' }}>
                  Distance {sortConfig?.key === 'distance' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell onClick={() => handleSort('status')} sx={{ cursor: 'pointer' }}>
                  Statut {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>{formatDateTime(reservation.date, reservation.time)}</TableCell>
                  <TableCell>{reservation.service}</TableCell>
                  <TableCell>{reservation.clientName}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        Depuis le salon : {reservation.distance.toFixed(1)} km
                      </Typography>
                      {lastPosition?.lat && lastPosition?.lng && reservation.clientLocation?.lat && reservation.clientLocation?.lng && (
                        <Typography variant="body2" color="text.secondary">
                          Depuis votre position : {calculateDistance(
                            lastPosition.lat,
                            lastPosition.lng,
                            reservation.clientLocation.lat,
                            reservation.clientLocation.lng
                          ).toFixed(1)} km
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={
                        reservation.status === 'confirmed'
                          ? 'success.main'
                          : reservation.status === 'cancelled'
                          ? 'error.main'
                          : 'warning.main'
                      }
                    >
                      {reservation.status === 'confirmed'
                        ? 'Confirmé'
                        : reservation.status === 'cancelled'
                        ? 'Annulé'
                        : 'En attente'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewDetails(reservation)}
                      >
                        Détails
                      </Button>
                      {reservation.status === 'pending' && (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                          >
                            Confirmer
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                          >
                            Annuler
                          </Button>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Détails de la Réservation</DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <Box component="span" sx={{ fontWeight: 'bold' }}>Date et Heure:</Box>{' '}
                {formatDateTime(selectedReservation.date, selectedReservation.time)}
              </Typography>
              <Typography variant="body1">
                <Box component="span" sx={{ fontWeight: 'bold' }}>Service:</Box> {selectedReservation.service}
              </Typography>
              <Typography variant="body1">
                <Box component="span" sx={{ fontWeight: 'bold' }}>Client:</Box> {selectedReservation.clientName}
              </Typography>
              <Typography variant="body1">
                <Box component="span" sx={{ fontWeight: 'bold' }}>Email:</Box> {selectedReservation.email}
              </Typography>
              <Typography variant="body1">
                <Box component="span" sx={{ fontWeight: 'bold' }}>Téléphone:</Box> {selectedReservation.phone}
              </Typography>
              <Typography variant="body1">
                <Box component="span" sx={{ fontWeight: 'bold' }}>Adresse:</Box> {selectedReservation.address}
              </Typography>
              <Typography variant="body1">
                <Box component="span" sx={{ fontWeight: 'bold' }}>Distance:</Box> {selectedReservation.distance.toFixed(1)} km
              </Typography>
              <Typography variant="body1">
                <Box component="span" sx={{ fontWeight: 'bold' }}>Statut:</Box>{' '}
                <Box component="span" color={
                  selectedReservation.status === 'confirmed' ? 'success.main' :
                  selectedReservation.status === 'cancelled' ? 'error.main' :
                  'warning.main'
                }>
                  {selectedReservation.status === 'confirmed' ? 'Confirmé' :
                   selectedReservation.status === 'cancelled' ? 'Annulé' :
                   'En attente'}
                </Box>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin; 