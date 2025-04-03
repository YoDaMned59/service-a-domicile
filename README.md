# Service à Domicile - Application de Réservation

Cette application permet aux clients de réserver des services à domicile, de payer un acompte et de gérer leurs réservations.

## Fonctionnalités

- Réservation de services
- Paiement d'acompte via Stripe
- Gestion des annulations
- Calcul de distance entre le prestataire et le client
- Interface administrateur pour le prestataire

## Installation

1. Cloner le repository
2. Installer les dépendances :
```bash
npm install
```
3. Créer un fichier `.env` à la racine du projet avec les variables suivantes :
```
REACT_APP_GOOGLE_MAPS_API_KEY=votre_clé_api_google_maps
REACT_APP_STRIPE_PUBLIC_KEY=votre_clé_publique_stripe
```

4. Lancer l'application :
```bash
npm start
```

## Technologies utilisées

- React
- TypeScript
- Material-UI
- Google Maps API
- Stripe
- React Router 