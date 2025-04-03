import businessData from './data/business.json';
import geocodingData from './data/geocoding.json';
import geonamesData from './data/geonames.json';
import paymentData from './data/payment.json';
import mapsData from './data/maps.json';

export const config = {
  googleMapsApiKey: mapsData.apiKey,
  stripePublicKey: paymentData.stripe.publicKey,
  services: {
    visage: {
      label: 'Soins du Visage',
      duration: 120, // durée en minutes
      price: 45,
      description: 'Soins hydratants, anti-âge, peaux sensibles, peaux matures'
    },
    corps: {
      label: 'Soins du Corps',
      duration: 120, // durée en minutes
      price: 60,
      description: 'Massages relaxants, soins amincissants, modelage'
    },
    epilation: {
      label: 'Épilation',
      duration: 60, // durée en minutes
      price: 25,
      description: 'Épilation à la cire chaude, soins des sourcils'
    },
    manucure: {
      label: 'Manucure & Pédicure',
      duration: 90, // durée en minutes
      price: 35,
      description: 'Soins des mains et des pieds, pose de vernis'
    }
  },
  workingHours: {
    start: '09:00',
    end: '19:00',
    breakStart: '12:00',
    breakEnd: '13:00'
  },
  business: businessData,
  geocoding: geocodingData,
  geonames: geonamesData
} as const; 