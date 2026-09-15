export const ASSETS = {
  hero: '/manus-storage/hero-creative-stage_49817e88.jpg',
  heroMobile: '/manus-storage/hero-creative-stage-mobile_91330abe.jpg',
  triumphLogo: '/manus-storage/triumph-logo_e0f69ff5.svg',
  disciplines: {
    vocal: '/manus-storage/vocal-competition_13643ebd.jpg',
    folkVocal: '/manus-storage/folk-academic-vocal-headsafe_21427d9c.jpg',
    choreography: '/manus-storage/dance-competition_fbb7c499.jpg',
    theater: '/manus-storage/theatre-competition_ed2ddf2c.jpg',
    instrumental: '/manus-storage/instrumental-competition_c03199fa.jpg',
    circus: '/manus-storage/circus-competition_e94ab44a.jpg',
    art: '/manus-storage/art-competition_224db14a.jpg',
  },
  jury: {
    'silvio-zanon': '/manus-storage/01-silvio-zanon_92c8b954.jpg',
    'kunito-nishitani': '/manus-storage/02-kunito-nishitani_d530647f.jpg',
    'alexander-paley': '/manus-storage/03-alexander-paley_4e1ee81c.jpg',
    'dmitry-devdariani': '/manus-storage/04-dmitry-devdariani_cfb85924.jpg',
    'helene-berger': '/manus-storage/05-helene-berger_436877b8.jpg',
    'yu-yamamoto': '/manus-storage/06-yu-yamamoto_7e86ee7c.jpg',
    'thomas-kreuzberger': '/manus-storage/07-thomas-kreuzberger_4ddbcd3f.jpg',
  },
  partners: {
    'cap-ferret': '/manus-storage/logo-cap-ferret_a2bb1ae8.png',
    ec: '/manus-storage/logo-ec_22e01bb9.png',
    litres: '/manus-storage/logo-litres_127ea857.png',
    sommerstudio: '/manus-storage/logo-sommerstudio_554f6717.png',
    obraztsova: '/manus-storage/logo-obraztsova_1fc39eb6.jpg',
    artcompass: '/manus-storage/logo-artcompass_2a1248a1.png',
    melos: '/manus-storage/logo-melos_66140783.png',
    teatro: '/manus-storage/logo-teatro_47e8ebd0.png',
    koekla: '/manus-storage/logo-koekla_3ec8ae4f.png',
  },
} as const;

export const getDisciplineImage = (discipline: string) =>
  ASSETS.disciplines[discipline as keyof typeof ASSETS.disciplines] || ASSETS.disciplines.vocal;

export const getJuryImage = (id: string) =>
  ASSETS.jury[id as keyof typeof ASSETS.jury];
