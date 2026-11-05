// All titles and descriptions below are original synthetic fixtures for this prototype.
// They do not represent licensed works, chapters, products or commercial availability.
const works = [
  {
    id: 'archivo-aurora', title: 'Archivo Aurora', format: 'manga', genres: ['Ciencia ficción', 'Misterio'],
    synopsis: 'En una estación meteorológica imaginaria, una archivista descubre mensajes que llegan con la luz de cada amanecer. Para descifrarlos deberá dibujar el mapa de un cielo que cambia cada noche.',
  },
  {
    id: 'orbita-de-papel', title: 'Órbita de papel', format: 'manhwa', genres: ['Aventura', 'Ciencia ficción'],
    synopsis: 'Una joven cartógrafa construye pequeños satélites de papel para explorar una ciudad suspendida. Una órbita inesperada la lleva a conocer los barrios que habían desaparecido de todos los mapas.',
  },
  {
    id: 'el-jardin-de-los-ecos', title: 'El jardín de los ecos', format: 'manga', genres: ['Fantasía', 'Vida cotidiana'],
    synopsis: 'En un jardín ficticio crecen árboles que repiten conversaciones olvidadas. Su nueva cuidadora aprende a escuchar esas historias mientras intenta recuperar la voz de un río silencioso.',
  },
  {
    id: 'ciudad-de-tinta', title: 'Ciudad de tinta', format: 'manhwa', genres: ['Fantasía', 'Aventura'],
    synopsis: 'Las calles de esta ciudad se redibujan al caer la lluvia. Dos aprendices de impresor recorren sus pasajes para encontrar un lugar que solo aparece en los márgenes de un viejo cuaderno.',
  },
  {
    id: 'despues-del-ultimo-tren', title: 'Después del último tren', format: 'manga', genres: ['Drama', 'Misterio'],
    synopsis: 'Una estación imaginaria abre una vez al año para recibir cartas sin destinatario. Un grupo de vecinos decide entregarlas y descubre pequeñas historias que unen lugares aparentemente lejanos.',
  },
  {
    id: 'la-ruta-del-viento', title: 'La ruta del viento', format: 'manhwa', genres: ['Aventura', 'Fantasía'],
    synopsis: 'Una mensajera sigue las corrientes de un archipiélago inventado con una brújula que señala recuerdos. Cada isla le ofrece una forma distinta de entender qué significa volver a casa.',
  },
];
export const demoWorks = Object.freeze(works.map(work => Object.freeze({ ...work, genres: Object.freeze(work.genres) })));
