export const ASSETS = {
  hero: '/manus-storage/hero-creative-stage_74495dc7.jpg',
  heroMobile: '/manus-storage/hero-creative-stage-mobile_3a3d8e80.jpg',
  triumphLogo: '/manus-storage/triumph-logo_a62c3059.svg',
  disciplines: {
    vocal: '/manus-storage/vocal-competition_ef105875.jpg',
    folkVocal: '/manus-storage/folk-academic-vocal-headsafe_a0ddd57b.jpg',
    choreography: '/manus-storage/dance-competition_ccbc075c.jpg',
    theater: '/manus-storage/theatre-competition_263faeac.jpg',
    instrumental: '/manus-storage/instrumental-competition_c8d515e8.jpg',
    circus: '/manus-storage/circus-competition_9c3aed67.jpg',
    art: '/manus-storage/art-competition_8f985f1b.jpg',
  },
  jury: {
    'silvio-zanon': '/manus-storage/01-silvio-zanon_aa6e1b5b.jpg',
    'kunito-nishitani': '/manus-storage/02-kunito-nishitani_fd79faf8.jpg',
    'alexander-paley': '/manus-storage/03-alexander-paley_bdda34fb.jpg',
    'dmitry-devdariani': '/manus-storage/04-dmitry-devdariani_17b8f4bd.jpg',
    'helene-berger': '/manus-storage/05-helene-berger_f088d266.jpg',
    'yu-yamamoto': '/manus-storage/06-yu-yamamoto_a540b0fb.jpg',
    'thomas-kreuzberger': '/manus-storage/07-thomas-kreuzberger_b2d240d4.jpg',
  },
  partners: {
    'cap-ferret': '/manus-storage/logo-cap-ferret_18bc6738.png',
    ec: '/manus-storage/logo-ec_a5c184a1.png',
    litres: '/manus-storage/logo-litres_5f1d444a.png',
    sommerstudio: '/manus-storage/logo-sommerstudio_b045c8ec.png',
    obraztsova: '/manus-storage/logo-obraztsova_e00c96fc.jpg',
    artcompass: '/manus-storage/logo-artcompass_45cd4aa2.png',
    melos: '/manus-storage/logo-melos_d34893d1.png',
    teatro: '/manus-storage/logo-teatro_43bef639.png',
    koekla: '/manus-storage/logo-koekla_53526d98.png',
  },
} as const;

export const getDisciplineImage = (discipline: string) =>
  ASSETS.disciplines[discipline as keyof typeof ASSETS.disciplines] || ASSETS.disciplines.vocal;

export const getJuryImage = (id: string) =>
  ASSETS.jury[id as keyof typeof ASSETS.jury];
