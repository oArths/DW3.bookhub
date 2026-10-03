const API_PENGUIN_RANDOM_HOUSE = 'https://reststop.randomhouse.com/resources/titles';

function adaptarLivro(titulo) {
  const dataPublicacao = String(titulo.onsaledate || '').match(/\d{4}/)?.[0];
  const ano = Number.parseInt(dataPublicacao || '', 10);
  const temas = titulo.themes
    ? Array.isArray(titulo.themes) ? titulo.themes : [titulo.themes]
    : [];
  const generos = [titulo.subjectcategorydescription1, ...temas].filter(Boolean);

  return {
    titulo: titulo.titleweb || titulo.titleshort || 'Título não informado',
    autor: titulo.authorweb || titulo.author || 'Autor não informado',
    capaUrl: titulo.capaUrl || '',
    descricao: titulo.flapcopy || titulo.acmartflap || titulo.rgcopy || '',
    anoPublicacao: Number.isNaN(ano) ? undefined : ano,
    generos,
  };
}

async function consultarLivros(termo, { maxResults = 20 } = {}) {
  const busca = String(termo || '').trim();
  if (!busca) {
    throw new Error('Informe um termo para buscar livros.');
  }

  const usuario = process.env.PRH_USERNAME;
  const senha = process.env.PRH_PASSWORD;
  if (!usuario || !senha) {
    throw new Error('Configure PRH_USERNAME e PRH_PASSWORD no ambiente.');
  }

  const url = new URL(API_PENGUIN_RANDOM_HOUSE);
  url.searchParams.set('search', busca);
  url.searchParams.set('start', '0');
  url.searchParams.set('max', String(Math.min(Math.max(Number(maxResults) || 20, 1), 40)));
  url.searchParams.set('expandLevel', '1');

  const resposta = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${Buffer.from(`${usuario}:${senha}`).toString('base64')}`,
    },
  });
  if (!resposta.ok) {
    throw new Error(`Falha ao consultar a API Penguin Random House (${resposta.status}).`);
  }

  const dados = await resposta.json();
  const titulos = dados.title || dados.titles?.title || [];
  return (Array.isArray(titulos) ? titulos : [titulos]).filter(Boolean).map(adaptarLivro);
}

module.exports = { consultarLivros };