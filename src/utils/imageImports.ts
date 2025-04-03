// Images pour la section hero
const miniatureImage = require('../assets/images/miniature_image.jpg');
const pedicure = require('../assets/images/pedicure.jpg');
const rehaussmentCils = require('../assets/images/rehaussment cils.webp');
const soinsVisage = require('../assets/images/soins-visage.jpeg');
const vernisFemme = require('../assets/images/vernis femme.avif');

export const images = {
  'images/miniature_image.jpg': miniatureImage,
  'images/pedicure.jpg': pedicure,
  'images/rehaussment cils.webp': rehaussmentCils,
  'images/soins-visage.jpeg': soinsVisage,
  'images/vernis femme.avif': vernisFemme,
} as const;

export type ImageKey = keyof typeof images; 