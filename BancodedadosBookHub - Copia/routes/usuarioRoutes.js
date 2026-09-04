const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const router = express.Router();

// POST /usuarios -> cria um novo usuário (cadastro)
router.post('/', async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ erro: 'username, email e password são obrigatórios.' });
    }

    // Nunca salvamos a senha em texto puro: o bcrypt transforma
    // "123456" em um hash irreversível, tipo "$2a$10$N9qo8u...".
    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({ username, email, passwordHash, bio });

    // Removemos o hash da resposta por segurança, mesmo sendo
    // um hash — não há motivo para expor isso na API.
    const { passwordHash: _omitido, ...usuarioSemSenha } = usuario.toObject();

    res.status(201).json(usuarioSemSenha);
  } catch (erro) {
    // Erro 11000 = campo "unique" duplicado (username ou email já existem)
    if (erro.code === 11000) {
      return res.status(409).json({ erro: 'Username ou email já cadastrado.' });
    }
    res.status(500).json({ erro: erro.message });
  }
});

// GET /usuarios/:id -> busca um usuário pelo id
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-passwordHash');
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    res.json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
