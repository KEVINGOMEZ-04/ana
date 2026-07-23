// chapter03.js - Contenido dinámico para Capítulo III
import { PROFILE } from './profile.js';

const getProfileValue = (path, placeholder = 'Completar') => {
  return path.reduce((obj, key) => (obj && obj[key] !== undefined ? obj[key] : null), PROFILE) || placeholder;
};

export const CHAPTER3 = {
  introLines: [
    'Hasta ahora...',
    'he hablado de nosotros.',
    'Pero este día...',
    'nunca fue sobre nosotros.',
    'Siempre fue sobre ti.'
  ],

  artworks: [
    {
      id: 'patience',
      title: 'Tu compañia',
      image: '/assets/images/memoria-001.jpg',
      description: '',
      reflection: [
        ''
      ]
    },
    {
      id: 'laugh',
      title: 'Tu risa',
      image: '/assets/images/memoria-003.jpg',
      description: 'No importa lo que haya pasado antes. Veo el instante en que tomaste el peor servicio y lo convertiste en el mejor recuerdo.',
      reflection: [
        'Esa sonrisa no es solo alegría; es la forma en la que decides hacerle un lugar a lo absurdo.',
        'Te reíste antes de que yo pudiera enojarme. Eso cambió toda la noche.',
        'No hay foto que capture mejor cómo haces que un mal plan valga la pena.'
      ]
    },
    {
      id: 'presence',
      title: 'Tu forma de estar',
      image: '/assets/images/memoria-004.jpg',
      description: 'La imagen solo es el fondo. Lo que veo es cómo haces que cualquier cuarto parezca más fácil de respirar.',
      reflection: [
        'No necesitas hacer nada extraordinario para que un lugar se sienta distinto.',
        'Estar contigo es lo que hace que una tarde larga se convierta en algo ligero.',
        'Esta fotografía me recuerda que tu presencia puede ser lo más importante de la escena.'
      ]
    }
  ],

  universe: {
    music: [
      {
        id: 'favorite',
        label: 'La canción que más te acompaña',
        title: getProfileValue(['favorites', 'song']),
        subtitle: 'Tu melodía constante.',
        artist: getProfileValue(['favorites', 'artist']),
        embedUrl: 'https://open.spotify.com/embed/track/5GbVzc6Ex5LYlLJqzRQhuy?utm_source=generator&theme=0&si=a52d60fdaac54a66'
      },
      {
        id: 'kevin',
        label: 'La canción que siempre me recuerda a ti',
        title: 'Les rues de Paris',
        subtitle: 'Nicolas Godin',
        artist: 'Nicolas Godin',
        embedUrl: 'https://open.spotify.com/embed/track/5Cfz0DCrcFpISyvDHBWy9f?utm_source=generator&si=e98e445685c64767'
      }
    ],
    details: [
      {
        id: 'drink',
        icon: '☕',
        label: 'Bebida favorita',
        value: getProfileValue(['favorites', 'drink']),
        note: 'Adicta al cafe y a todas sus presentaciones.'
      },
      {
        id: 'flower',
        icon: '🌷',
        label: 'Flor que siempre menciona',
        value: getProfileValue(['favorites', 'flower']),
        note: 'Florece en primavera, la unica vez en el año que nos vemos'
      },
      {
        id: 'book',
        icon: '📖',
        label: 'Libro que lleva cerca',
        value: getProfileValue(['favorites', 'book']),
        note: 'Casi nunca lo abre, pero segun ella su favorito'
      },
      {
        id: 'animal',
        icon: '🦌',
        label: 'Animal que le gusta',
        value: getProfileValue(['favorites', 'animal']),
        note: 'Por que asi la dejaron.'
      },
      {
        id: 'dreams',
        icon: '🌎',
        label: 'Países que sueña conocer',
        value: (() => {
          const destinations = getProfileValue(['dreams', 'destinations']);
          return Array.isArray(destinations) ? destinations.join(', ') : destinations;
        })(),
        note: 'Mas de alla que de aca.'
      },
      {
        id: 'series',
        icon: '🎬',
        label: 'Serie que vuelve a nombrar',
        value: getProfileValue(['favorites', 'series']),
        note: 'Se la sabe de memoria.'
      }
    ],
    videos: [
      {
        id: 'mem-002',
        title: 'Una noche cualquiera',
        src: '/assets/video/memoria-002.mp4',
        cover: '/assets/images/memoria-004.jpg',
        duration: '0:23'
      }
    ]
  },

  phrases: [
    'Kurikitaka ti, Kurikitaka ta'
  ],

  words: [
    { word: 'Leal', explanation: 'No elegí esta palabra porque suene bien. sencillamente asi es, es lo que compone todo lo que eres' },
    { word: 'Divertida', explanation: 'Ningun momento, ningun plan, no hay nada que me pueda parecer aburrido si ella esta ahi' },
    { word: 'Elegante', explanation: 'Es que si le atina a todos los oufits JAJAJAJA.' },
    { word: 'Inteligente', explanation: 'No es lo mas resaltable, pero tiene sus momentos :3' },
    { word: 'Valiente', explanation: 'Por que hay que ser valiente pa meterse con unos manes asi de feos JAJAJAJA.' },
    { word: 'Paciente', explanation: 'Tiene muchas cualidades, muchos atributos que la vuelven la mejor mujer del mundo, exepto este, aqui si paila JAJAJA.' },
    { word: 'Especial', explanation: 'Es como enfermita.' }
  ],

  final: {
    image: '/assets/images/memoria-001.jpg',
    lines: [
      'Después de todo este tiempo...',
      'aún sigues siendo la persona con la que prefiero compartir los planes que no salen como esperaba.'
    ]
  }
};
