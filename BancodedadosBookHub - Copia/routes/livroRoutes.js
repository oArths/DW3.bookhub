const express = require('express');
const Livro = require('../models/Livro');

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

// GET /livros/:id -> busca um livro específico
router.get('/:id', async (req, res) => {
  try {
    const livro = await Livro.findById(req.params.id);
    if (!livro) {
      return res.status(404).json({ erro: 'Livro não encontrado.' });
    }
    res.json(livro);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// POST /livros -> cadastra um novo livro no catálogo
router.post('/', async (req, res) => {
  try {
    const livro = await Livro.create(req.body);
    res.status(201).json(livro);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
