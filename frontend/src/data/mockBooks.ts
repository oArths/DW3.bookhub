export type Book = {
  id: number
  title: string
  author: string
  category: string
  rating: number
  reviews: number
  price: number
  year: number
  cover: string
  accent: string
  blurb: string
  description: string
  detailSummary: string
  details: Array<{ label: string; value: string }>
  reviewsList: Array<{ name: string; stars: number; text: string }>
  relatedIds: number[]
}

export const mockBooks: Book[] = [
  {
    id: 1,
    title: 'Duna',
    author: 'Frank Herbert',
    category: 'Ficção',
    rating: 4.9,
    reviews: 2400,
    price: 39.9,
    year: 1965,
    cover: 'Duna',
    accent: 'from-violet-700 via-indigo-600 to-cyan-500',
    blurb: 'Uma jornada épica em um universo de poder, areia e mistério.',
    description:
      'Em um planeta desértico conhecido como Arrakis, Paul Atreides herda um legado perigoso quando sua família assume o controle da produção do spice, o recurso mais valioso do universo.',
    detailSummary:
      'Duna acompanha a transformação de Paul em um líder inevitável, em meio a política, religião e sobrevivência em um mundo brutal e fascinante.',
    details: [
      { label: 'Autor', value: 'Frank Herbert' },
      { label: 'Editora', value: 'Ace Books' },
      { label: 'Idioma', value: 'Português' },
      { label: 'Páginas', value: '688' },
      { label: 'Formato', value: 'Capa dura' },
      { label: 'Ano', value: '1965' },
    ],
    reviewsList: [
      {
        name: 'Ana L.',
        stars: 5,
        text: 'Uma leitura intensa, profunda e extremamente envolvente. O mundo criado é inesquecível e cada capítulo prende a atenção.',
      },
      {
        name: 'Rafael M.',
        stars: 4,
        text: 'Fantástico para quem gosta de ficção científica e construções de universo. O livro é denso, mas vale cada página.',
      },
    ],
    relatedIds: [4, 6, 5],
  },
  {
    id: 2,
    title: 'Orgulho e Preconceito',
    author: 'Jane Austen',
    category: 'Romance',
    rating: 4.8,
    reviews: 1320,
    price: 24.9,
    year: 1813,
    cover: 'Orgulho',
    accent: 'from-rose-500 via-pink-500 to-orange-400',
    blurb: 'Uma obra clássica sobre amor, orgulho e entendimento pessoal.',
    description:
      'A trama acompanha Elizabeth Bennet em uma jornada de percepção, orgulho e equilíbrio emocional, enquanto a família e a sociedade ditam regras rígidas para o amor.',
    detailSummary:
      'Uma das obras mais marcantes da literatura inglesa, com personagens memoráveis e reflexões sobre amor, classe e valores pessoais.',
    details: [
      { label: 'Autor', value: 'Jane Austen' },
      { label: 'Editora', value: 'Penguin' },
      { label: 'Idioma', value: 'Português' },
      { label: 'Páginas', value: '432' },
      { label: 'Formato', value: 'Capa comum' },
      { label: 'Ano', value: '1813' },
    ],
    reviewsList: [
      {
        name: 'Carla S.',
        stars: 5,
        text: 'Elegante, delicado e inteligente. A obra consegue ser romântica sem perder profundidade e crítica social.',
      },
      {
        name: 'Tiago P.',
        stars: 4,
        text: 'Muito bem escrito e cheio de personalidade. A leitura flui bem e os personagens são muito ricos.',
      },
    ],
    relatedIds: [3, 5],
  },
  {
    id: 3,
    title: 'A Jornada do Herói',
    author: 'Joseph Campbell',
    category: 'Autoajuda',
    rating: 4.7,
    reviews: 1880,
    price: 31.5,
    year: 1949,
    cover: 'Herói',
    accent: 'from-amber-500 via-orange-500 to-red-500',
    blurb: 'Estratégias para transformar desafios em evolução pessoal.',
    description:
      'Campbell explora o poder dos arquétipos e da jornada pessoal, mostrando como desafios e experiências podem ser convertidos em crescimento e sentido.',
    detailSummary:
      'Uma leitura inspiradora para quem busca ressignificar obstáculos, propósito e evolução pessoal através de uma visão simbólica e profunda.',
    details: [
      { label: 'Autor', value: 'Joseph Campbell' },
      { label: 'Editora', value: 'HarperOne' },
      { label: 'Idioma', value: 'Português' },
      { label: 'Páginas', value: '320' },
      { label: 'Formato', value: 'Capa flexível' },
      { label: 'Ano', value: '1949' },
    ],
    reviewsList: [
      {
        name: 'Helena V.',
        stars: 5,
        text: 'Uma obra que muda a maneira de enxergar obstáculos e transformação pessoal. Excelente leitura para autoconhecimento.',
      },
      {
        name: 'Marcos T.',
        stars: 4,
        text: 'Muito inspirador, com uma linguagem clara e bastante útil para quem quer evoluir emocionalmente.',
      },
    ],
    relatedIds: [2, 5],
  },
  {
    id: 4,
    title: 'A Cidade do Sol',
    author: 'Maya Lin',
    category: 'Fantasia',
    rating: 4.6,
    reviews: 980,
    price: 34.2,
    year: 2019,
    cover: 'Sol',
    accent: 'from-emerald-500 via-teal-500 to-cyan-500',
    blurb: 'Uma aventura mágica com personagens profundos e cenários ricos.',
    description:
      'A história leva o leitor a um mundo encantado, em que mistério, coragem e fantasia se misturam em uma jornada emocional e visualmente rica.',
    detailSummary:
      'Uma fantasia contemporânea com atmosfera intensa, personagens marcantes e um universo cheio de magia e descobertas.',
    details: [
      { label: 'Autor', value: 'Maya Lin' },
      { label: 'Editora', value: 'Moonlight' },
      { label: 'Idioma', value: 'Português' },
      { label: 'Páginas', value: '512' },
      { label: 'Formato', value: 'Capa dura' },
      { label: 'Ano', value: '2019' },
    ],
    reviewsList: [
      {
        name: 'Beatriz N.',
        stars: 5,
        text: 'Visualmente rica e profundamente emocional. A fantasia aqui é muito bem construída e envolvente.',
      },
      {
        name: 'Eduardo C.',
        stars: 4,
        text: 'Muito bonito, com personagens bem desenvolvidos e um mundo muito interessante para explorar.',
      },
    ],
    relatedIds: [1, 6],
  },
  {
    id: 5,
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    category: 'Biografia',
    rating: 4.9,
    reviews: 2200,
    price: 42.5,
    year: 2011,
    cover: 'Jobs',
    accent: 'from-slate-700 via-zinc-600 to-stone-500',
    blurb: 'A história de uma mente visionária e suas decisões marcantes.',
    description:
      'A biografia de Steve Jobs revela o processo criativo, os conflitos e as escolhas que moldaram uma das maiores forças inovadoras do século XXI.',
    detailSummary:
      'Uma narrativa profunda sobre criatividade, liderança e impacto cultural, com detalhes fascinantes sobre a vida e o trabalho do empresário.',
    details: [
      { label: 'Autor', value: 'Walter Isaacson' },
      { label: 'Editora', value: 'Simon & Schuster' },
      { label: 'Idioma', value: 'Português' },
      { label: 'Páginas', value: '656' },
      { label: 'Formato', value: 'Capa dura' },
      { label: 'Ano', value: '2011' },
    ],
    reviewsList: [
      {
        name: 'Nina K.',
        stars: 5,
        text: 'Muito bem escrita e fascinante. Vale por mostrar a parte humana e estratégica de uma figura tão influente.',
      },
      {
        name: 'Davi A.',
        stars: 4,
        text: 'Uma leitura inspiradora e rica em detalhes, especialmente para quem gosta de inovação e liderança.',
      },
    ],
    relatedIds: [1, 3],
  },
  {
    id: 6,
    title: 'Neuromancer',
    author: 'William Gibson',
    category: 'Sci-Fi',
    rating: 4.5,
    reviews: 870,
    price: 26.8,
    year: 1984,
    cover: 'Neuro',
    accent: 'from-cyan-500 via-sky-500 to-blue-700',
    blurb: 'Cyberpunk, tecnologia e futuro em uma visão implacável.',
    description:
      'Neuromancer transporta o leitor para um futuro distópico repleto de tecnologia, identidade e memória, com uma narrativa futurista e intensa.',
    detailSummary:
      'Uma obra essencial do cyberpunk, com atmosfera sombria, linguagem inovadora e uma visão provocativa sobre tecnologia e sociedade.',
    details: [
      { label: 'Autor', value: 'William Gibson' },
      { label: 'Editora', value: 'Abyss' },
      { label: 'Idioma', value: 'Português' },
      { label: 'Páginas', value: '304' },
      { label: 'Formato', value: 'Capa comum' },
      { label: 'Ano', value: '1984' },
    ],
    reviewsList: [
      {
        name: 'Luis F.',
        stars: 4,
        text: 'Um clássico do cyberpunk com uma atmosfera incrível e um futuro que parece ao mesmo tempo distante e real.',
      },
      {
        name: 'Paula R.',
        stars: 5,
        text: 'Muito original e envolvente. A narrativa é densa, mas extremamente memorável e impactante.',
      },
    ],
    relatedIds: [1, 4],
  },
]
