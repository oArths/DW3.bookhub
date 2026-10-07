const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
  // ID interno: o MongoDB cria sozinho (campo _id)

  // ID externo: o ID do livro na API da Penguin
  idExterno: { type: String, required: true, unique: true, trim: true },

  titulo: { type: String, required: true, trim: true },

  capaUrl: { type: String, default: '' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Livro', livroSchema);
