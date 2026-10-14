const express = require('express');
const Lista = require('../models/Lista');
const Livro = require('../models/Livro');
const ListaLivro = require('../models/ListaLivro');
const { STATUS_LEITURA } = require('../models/ListaLivro');

const router = express.Router();

function tratarErro(res, erro) {
  if (erro.name === 'CastError') {
    return res.status(400).json({ erro: 'id inválido.' });
  }
  res.status(500).json({ erro: erro.message });
}

// Busca a lista e confirma que pertence ao usuário informado.
// Devolve null (e já responde) se algo estiver errado.
async function obterListaDoUsuario(req, res, usuarioId) {
  if (!usuarioId) {
    res.status(400).json({ erro: 'usuarioId é obrigatório.' });
    return null;
  }
  const lista = await Lista.findById(req.params.listaId);
  if (!lista) {
    res.status(404).json({ erro: 'Lista não encontrada.' });
    return null;
  }
  if (String(lista.usuarioId) !== String(usuarioId)) {
    res.status(403).json({ erro: 'Esta lista não pertence ao usuário.' });
    return null;
  }
  return lista;
}

// POST /listas -> cria uma lista para o usuário
router.post('/', async (req, res) => {
  try {
    const { usuarioId, nome, descricao } = req.body;
    if (!usuarioId || !nome) {
      return res.status(400).json({ erro: 'usuarioId e nome são obrigatórios.' });
    }
    const lista = await Lista.create({ usuarioId, nome, descricao });
    res.status(201).json(lista);
  } catch (erro) {
    tratarErro(res, erro);
  }
});

// GET /listas/usuario/:usuarioId -> todas as listas de um usuário
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const listas = await Lista.find({ usuarioId: req.params.usuarioId }).sort({ createdAt: -1 });
    res.json(listas);
  } catch (erro) {
    tratarErro(res, erro);
  }
});

// POST /listas/:listaId/livros -> adiciona um livro à lista
// body: { usuarioId, livroId, statusLeitura? }
router.post('/:listaId/livros', async (req, res) => {
  try {
    const { usuarioId, livroId, statusLeitura } = req.body;
    if (!livroId) {
      return res.status(400).json({ erro: 'livroId é obrigatório.' });
    }
    if (statusLeitura && !STATUS_LEITURA.includes(statusLeitura)) {
      return res.status(400).json({ erro: `statusLeitura deve ser um de: ${STATUS_LEITURA.join(', ')}.` });
    }

    const lista = await obterListaDoUsuario(req, res, usuarioId);
    if (!lista) return;

    const livro = await Livro.findById(livroId);
    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }

    const item = await ListaLivro.create({
      listaId: lista._id,
      usuarioId: lista.usuarioId,
      livroId: livro._id,
      statusLeitura,
    });
    res.status(201).json(item);
  } catch (erro) {
    if (erro.code === 11000) {
      return res.status(409).json({ erro: 'Livro já está nesta lista.' });
    }
    tratarErro(res, erro);
  }
});

// GET /listas/:listaId/livros?status=lendo -> livros da lista (com dados do livro)
router.get('/:listaId/livros', async (req, res) => {
  try {
    const filtro = { listaId: req.params.listaId };
    if (req.query.status) {
      if (!STATUS_LEITURA.includes(req.query.status)) {
        return res.status(400).json({ erro: `status deve ser um de: ${STATUS_LEITURA.join(', ')}.` });
      }
      filtro.statusLeitura = req.query.status;
    }
    const itens = await ListaLivro.find(filtro)
      .populate('livroId', 'titulo capaUrl idExterno')
      .sort({ adicionadoEm: -1 });
    res.json(itens);
  } catch (erro) {
    tratarErro(res, erro);
  }
});

// PATCH /listas/:listaId/livros/:livroId -> atualiza o status de leitura
// body: { usuarioId, statusLeitura }
router.patch('/:listaId/livros/:livroId', async (req, res) => {
  try {
    const { usuarioId, statusLeitura } = req.body;
    if (!STATUS_LEITURA.includes(statusLeitura)) {
      return res.status(400).json({ erro: `statusLeitura deve ser um de: ${STATUS_LEITURA.join(', ')}.` });
    }

    const lista = await obterListaDoUsuario(req, res, usuarioId);
    if (!lista) return;

    const item = await ListaLivro.findOneAndUpdate(
      { listaId: lista._id, livroId: req.params.livroId },
      { $set: { statusLeitura } },
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ erro: 'Livro não está nesta lista.' });
    }
    res.json(item);
  } catch (erro) {
    tratarErro(res, erro);
  }
});

// DELETE /listas/:listaId/livros/:livroId?usuarioId=... -> remove o livro da lista
router.delete('/:listaId/livros/:livroId', async (req, res) => {
  try {
    const lista = await obterListaDoUsuario(req, res, req.query.usuarioId);
    if (!lista) return;

    const item = await ListaLivro.findOneAndDelete({
      listaId: lista._id,
      livroId: req.params.livroId,
    });
    if (!item) {
      return res.status(404).json({ erro: 'Livro não está nesta lista.' });
    }
    res.status(204).end();
  } catch (erro) {
    tratarErro(res, erro);
  }
});

module.exports = router;
