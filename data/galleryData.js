// galleryData.js
// Datos de las colecciones narrativas para Capítulo III

export const COLLECTIONS = [
  { key: 'RenovacionDeVotos', title: 'Renovación de votos', description: 'Solo me acuerdo de las caras que hicimos y eso que es gracias a los videos jajaja.' },
  { key: 'Charla', title: 'Tu rancho Parte 1', description: 'Se puede decir que hay mejores formas de pasar el tiempo, pero estar ahí contigo, eso, al menos para mí, era perfecto.' },
  { key: 'Salida', title: 'Tu rancho Parte 2', description: 'Nunca habia sentido lo que senti ese dia, que peluches tan comodos ome.' },
  { key: 'Feria2022', title: 'Ferias 2022', description: 'Esa "Rueda de la fortuna" estaba amarrada con una piola, partes oxidadas, con razon le dicen rueda de la fortuna' },
  { key: 'FresasConChocolate', title: 'Pesimo servicio', description: 'Ey me quede con las ganas de comerlas.' },
  { key: 'LlegandoACali', title: 'Llegando de cali', description: 'Creo que llegaba, o iba, ya ni me acuerdo.' },
  { key: 'Feria2023', title: 'Feria 2023', description: 'La misma feria, solo que mas posibilidades de que nos de cancer por el oxido' },
  { key: 'Asalareados', title: 'Asalareados', description: 'El balcon de la explotacion.' },
  { key: 'Felix', title: 'Félix', description: 'Como me aruñaba ese gato.' },
  { key: 'Karina', title: 'Karina', description: 'Al final la persona mas importante de este dia' }
];

const ASSETS_PATH = 'assets/images/chapter3/';

const ASSET_MANIFEST = {
  RenovacionDeVotos: [
    'Renovacion de votos (1).jpg',
    'Renovacion de votos (1).mp4',
    'Renovacion de votos (10).jpg',
    'Renovacion de votos (11).jpg',
    'Renovacion de votos (12).jpg',
    'Renovacion de votos (13).jpg',
    'Renovacion de votos (14).jpg',
    'Renovacion de votos (15).jpg',
    'Renovacion de votos (16).jpg',
    'Renovacion de votos (17).jpg',
    'Renovacion de votos (2).jpg',
    'Renovacion de votos (2).mp4',
    'Renovacion de votos (3).jpg',
    'Renovacion de votos (3).mp4',
    'Renovacion de votos (4).jpg',
    'Renovacion de votos (4).mp4',
    'Renovacion de votos (5).jpg',
    'Renovacion de votos (5).mp4',
    'Renovacion de votos (6).jpg',
    'Renovacion de votos (7).jpg',
    'Renovacion de votos (8).jpg',
    'Renovacion de votos (9).jpg'
  ],
  Charla: [
    'Charla (3).jpg',
    'Charla (4).jpg'
  ],
  Salida: [
    'Salida1.jpg',
    'Salida1 (2).jpg'
  ],
  Feria2022: [
    'Feria2022.jpg',
    'Ferias2022.mp4'
  ],
  FresasConChocolate: [
    'FresasChocolate.jpg',
    'FresasChocolate.mp4',
    'FresasChocolate (2).jpg',
    'FresasChocolate (2).mp4',
    'FresasChocolate (3).jpg',
    'FresasChocolate (3).mp4',
    'FresasChocolate (4).jpg',
    'FresasChocolate (4).mp4',
    'FresasChocolate (5).jpg',
    'FresasChocolate (5).mp4',
    'FresasChocolate (6).mp4',
    'FresasChocolate (7).mp4'
  ],
  LlegandoACali: [
    'LlegandoCali.jpg',
    'LlegandoCali.mp4',
    'LlegandoCali (2).jpg'
  ],
  Feria2023: [
    'Feria2023.jpg',
    'Feria2023.mp4',
    'Feria2023 (2).mp4',
    'Feria2023 (3).jpg',
    'Feria2023 (4).mp4'
  ],
  Asalareados: [
    'Asalareados (2).jpg',
    'Asalareados.jpg',
    'Asalareados (2).mp4',
    'Asalareados (3).jpg',
    'Asalareados (4).jpg',
    'Asalareados (5).jpg'
  ],
  Felix: [
    'Felix (1).jpg',
    'Felix (2).jpg',
    'Felix (3).jpg',
    'Felix (4).jpg',
    'Felix (5).jpg'
  ],
  Karina: [
    'Karina.mp4',
    'Karina (1).mp4',
    'Karina (2).mp4',
    'Karina (3).mp4',
    'Karina (4).mp4',
    'Karina (5).mp4',
  ]
};

function buildAssetUrl(fileName) {
  return `${ASSETS_PATH}${encodeURI(fileName)}`;
}

export async function discoverCollectionAssets(key) {
  const assetFiles = ASSET_MANIFEST[key] || [];
  return assetFiles.map((fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    return {
      url: buildAssetUrl(fileName),
      type: ext === 'mp4' || ext === 'webm' ? 'video' : 'image'
    };
  });
}

export async function discoverAllCollections() {
  const results = {};
  for (const col of COLLECTIONS) {
    // eslint-disable-next-line no-await-in-loop
    results[col.key] = await discoverCollectionAssets(col.key);
  }
  return results;
}
