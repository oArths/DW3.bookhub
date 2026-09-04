const mongoose = require('mongoose');

const livroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  capaUrl: { type: String, default: '' },
  descricao: { type: String, default: '' },
  anoPublicacao: { type: Number },
  generos: { type: [String], default: [] },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Livro', livroSchema);
