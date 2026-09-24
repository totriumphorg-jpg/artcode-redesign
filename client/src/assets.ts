// Base URL aware asset helper: works identically on local dev, WebDev space, and GitHub Pages subpath
const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '') + '/';

export const ASSETS = {
  hero: `${base}images/hero-creative-stage.jpg`,
  heroMobile: `${base}images/hero-creative-stage-mobile.jpg`,
  triumphLogo: `${base}images/triumph-logo.svg`,
  disciplines: {
    vocal: `${base}images/vocal-competition.jpg`,
    folkVocal: `${base}images/folk-academic-vocal-headsafe.jpg`,
    choreography: `${base}images/dance-competition.jpg`,
    theater: `${base}images/theatre-competition.jpg`,
    instrumental: `${base}images/instrumental-competition.jpg`,
    circus: `${base}images/circus-competition.jpg`,
    art: `${base}images/art-competition.jpg`,
  },
  jury: {
    'silvio-zanon': `${base}images/01-silvio-zanon.jpg`,
    'kunito-nishitani': `${base}images/02-kunito-nishitani.jpg`,
    'alexander-paley': `${base}images/03-alexander-paley.jpg`,
    'dmitry-devdariani': `${base}images/04-dmitry-devdariani.jpg`,
    'helene-berger': `${base}images/05-helene-berger.jpg`,
    'yu-yamamoto': `${base}images/06-yu-yamamoto.jpg`,
    'thomas-kreuzberger': `${base}images/07-thomas-kreuzberger.jpg`,
  },
  partners: {
    'cap-ferret': `${base}images/logo-cap-ferret.png`,
    ec: `${base}images/logo-ec.png`,
    litres: `${base}images/logo-litres.png`,
    sommerstudio: `${base}images/logo-sommerstudio.png`,
    obraztsova: `${base}images/logo-obraztsova.jpg`,
    artcompass: `${base}images/logo-artcompass.png`,
    melos: `${base}images/logo-melos.png`,
    teatro: `${base}images/logo-teatro.png`,
    koekla: `${base}images/logo-koekla.png`,
  },
} as const;

export const getDisciplineImage = (discipline: string) =>
  ASSETS.disciplines[discipline as keyof typeof ASSETS.disciplines] || ASSETS.disciplines.vocal;

export const getJuryImage = (id: string) =>
  ASSETS.jury[id as keyof typeof ASSETS.jury];
