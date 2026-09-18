export const ASSETS = {
  hero: './assets/hero-creative-stage.jpg',
  heroMobile: './assets/hero-creative-stage-mobile.jpg',
  triumphLogo: './assets/triumph-logo.svg',
  disciplines: {
    vocal: './assets/vocal-competition.jpg',
    folkVocal: './assets/folk-academic-vocal.jpg',
    choreography: './assets/dance-competition.jpg',
    theater: './assets/theatre-competition.jpg',
    instrumental: './assets/instrumental-competition.jpg',
    circus: './assets/circus-competition.jpg',
    art: './assets/art-competition.jpg',
  },
  jury: {
    'silvio-zanon': './assets/01-silvio-zanon.jpg',
    'kunito-nishitani': './assets/02-kunito-nishitani.jpg',
    'alexander-paley': './assets/03-alexander-paley.jpg',
    'dmitry-devdariani': './assets/04-dmitry-devdariani.jpg',
    'helene-berger': './assets/05-helene-berger.jpg',
    'yu-yamamoto': './assets/06-yu-yamamoto.jpg',
    'thomas-kreuzberger': './assets/07-thomas-kreuzberger.jpg',
  },
  partners: {
    'cap-ferret': './assets/logo-cap-ferret.png',
    ec: './assets/logo-ec.png',
    litres: './assets/logo-litres.png',
    sommerstudio: './assets/logo-sommerstudio.png',
    obraztsova: './assets/logo-obraztsova.jpg',
    artcompass: './assets/logo-artcompass.png',
    melos: './assets/logo-melos.png',
    teatro: './assets/logo-teatro.png',
    koekla: './assets/logo-koekla.png',
  },
} as const;

export const getDisciplineImage = (discipline: string) =>
  ASSETS.disciplines[discipline as keyof typeof ASSETS.disciplines] || ASSETS.disciplines.vocal;

export const getJuryImage = (id: string) =>
  ASSETS.jury[id as keyof typeof ASSETS.jury];
