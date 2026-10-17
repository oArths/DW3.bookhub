const express = require('express');
const Review = require('../models/Review');
const { validarCorpo, reviewSchema } = require('../schemas');

const router = express.Router();

// POST /reviews -> cria uma avaliação (nota + texto) de um livro
router.post('/', validarCorpo(reviewSchema), async (req, res) => {
  try {
    const { usuarioId, livroId, nota, texto } = req.body;

    const review = await Review.create({ usuarioId, livroId, nota, texto });
    res.status(201).json(review);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// GET /reviews/usuario/:usuarioId -> avaliações escritas pelo usuário,
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const reviews = await Review.find({ usuarioId: req.params.usuarioId })
      .populate('livroId', 'titulo capaUrl idExterno')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

// GET /reviews/livro/:livroId -> lista as reviews de um livro específico,
// já trazendo os dados do usuário que escreveu (via populate).
router.get('/livro/:livroId', async (req, res) => {
  try {
    const reviews = await Review.find({ livroId: req.params.livroId })
      .populate('usuarioId', 'username avatarUrl')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
