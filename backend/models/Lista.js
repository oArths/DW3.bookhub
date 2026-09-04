const mongoose = require('mongoose');

const listaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  nome: { type: String, required: true },
  descricao: { type: String, default: '' },
  // Array de referências: uma lista tem vários livros.
  livroIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livro' }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lista', listaSchema);
