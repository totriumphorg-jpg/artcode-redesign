export const ASSETS = {
  hero: '/manus-storage/artcode-hero_67f3999b.png',
  triumphLogo: '/manus-storage/triumph-logo_e0f69ff5.svg',
  disciplines: {
    vocal: '/manus-storage/discipline-vocal_92c47c24.png',
    choreography: '/manus-storage/discipline-dance_372ab21b.png',
    theater: '/manus-storage/discipline-theater_9bf052a1.png',
    instrumental: '/manus-storage/discipline-instrumental_7467565e.png',
    circus: '/manus-storage/discipline-circus_f83e4eea.png',
  },
  jury: {
    'silvio-zanon': '/manus-storage/jury-zanon_5344edfe.png',
    'kunito-nishitani': '/manus-storage/jury-nishitani_643cdacd.png',
    'alexander-paley': '/manus-storage/jury-paley_16aea043.png',
    'dmitry-devdariani': '/manus-storage/jury-devdariani_9a5c5d1f.png',
    'helene-berger': '/manus-storage/jury-berger_26e9621d.jpg',
    'yu-yamamoto': '/manus-storage/jury-yamamoto_9a02093b.png',
    'thomas-kreuzberger': '/manus-storage/jury-kreuzberger_81e35e1a.png',
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
