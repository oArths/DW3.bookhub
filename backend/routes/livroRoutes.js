const express = require('express');
const Livro = require('../models/Livro');
const { consultarLivros } = require('../services/livroConsulta');

const router = express.Router();

// GET /livros -> lista todos os livros
router.get('/', async (req, res) => {
  try {
    const livros = await Livro.find().sort({ createdAt: -1 });
    res.json(livros);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// GET /livros/busca?q=termo -> consulta livros na API Penguin Random House
router.get('/busca', async (req, res) => {
  try {
    const livros = await consultarLivros(req.query.q, {
      maxResults: req.query.maxResults,
    });
    res.json(livros);
  } catch (erro) {
    const status = erro.message === 'Informe um termo para buscar livros.' ? 400 : 502;
    res.status(status).json({ erro: erro.message });
  }
});

// GET /livros/externo/:idExterno -> busca pela referência da API externa
// (precisa ficar ANTES de /:id, senão "externo" seria lido como um id)
router.get('/externo/:idExterno', async (req, res) => {
  try {
    const livro = await Livro.findOne({ idExterno: req.params.idExterno });
    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }
    res.json(livro);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// GET /livros/:id -> busca um livro específico pelo id interno
router.get('/:id', async (req, res) => {
  try {
    const livro = await Livro.findById(req.params.id);
    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }
    res.json(livro);
  } catch (erro) {
    if (erro.name === 'CastError') {
      return res.status(400).json({ erro: 'id inválido.' });
    }
    res.status(500).json({ erro: erro.message });
  }
});

// POST /livros -> salva a referência de um livro vindo da API externa.
// Se o idExterno já existir, atualiza título e capa em vez de duplicar.
router.post('/', async (req, res) => {
  try {
    const { idExterno, titulo, capaUrl } = req.body;

    if (!idExterno || !titulo) {
      return res.status(400).json({ erro: 'idExterno e titulo são obrigatórios.' });
    }

    const livro = await Livro.findOneAndUpdate(
      { idExterno },
      { $set: { titulo, capaUrl: capaUrl || '' } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(livro);
  } catch (erro) {
    if (erro.code === 11000) {
      return res.status(409).json({ erro: 'Livro já cadastrado.' });
    }
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
