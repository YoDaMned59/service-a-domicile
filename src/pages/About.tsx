import { Container, Typography, Box, Grid, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CheckCircle, Spa, Favorite, Star } from '@mui/icons-material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ 
        fontFamily: 'Playfair Display, serif',
        color: '#2c3e50',
        textAlign: 'center',
        mb: 6
      }}>
        À propos de nous
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#2c3e50'
            }}>
              Notre Histoire
            </Typography>
            <Typography paragraph>
              À Fleur de Peau est née d'une passion pour le bien-être et la beauté des mains et des pieds. 
              Notre expertise et notre attention aux détails font de nous votre partenaire de confiance 
              pour tous vos soins de manucure et pédicure.
            </Typography>
            <Typography paragraph>
              Nous nous déplaçons à votre domicile pour vous offrir une expérience de soin personnalisée 
              et relaxante, dans le confort de votre maison.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#2c3e50'
            }}>
              Nos Services
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Spa color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Épilation"
                  secondary="Épilation à la cire ou au fil pour un résultat durable et soyeux"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Favorite color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Ongles"
                  secondary="Pose de vernis, onglerie, soins des ongles naturels et pose de capsules"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Star color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Soins Visage"
                  secondary="Nettoyage, exfoliation, masque et soins adaptés à votre type de peau"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Favorite color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Soins Corps"
                  secondary="Gommage, enveloppement, massage et soins hydratants"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Star color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Maquillage"
                  secondary="Maquillage de jour, de soirée et maquillage pour événements spéciaux"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Favorite color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Réhaussement de Cils"
                  secondary="Pose de cils, réhaussement et soins des cils"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Star color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Beauté des Mains et Pieds"
                  secondary="Manucure, pédicure, soins des cuticules et massage"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontFamily: 'Playfair Display, serif',
              color: '#2c3e50'
            }}>
              Pourquoi Nous Choisir ?
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircle color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>Service à Domicile</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nous nous déplaçons chez vous pour votre confort
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircle color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>Matériel Professionnel</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Utilisation de produits de haute qualité
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircle color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>Expertise</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Des années d'expérience à votre service
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckCircle color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom>Flexibilité</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Horaires adaptés à vos besoins
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About; 