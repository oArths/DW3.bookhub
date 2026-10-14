const mongoose = require('mongoose');

// Status possíveis de leitura de um livro dentro de uma lista.
const STATUS_LEITURA = ['quero_ler', 'lendo', 'lido', 'abandonado'];

// Cada documento representa UM livro dentro de UMA lista de um usuário.
// Relaciona: Usuario <- Lista <- ListaLivro -> Livro
const listaLivroSchema = new mongoose.Schema({
  listaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lista', required: true },

  // Dono da lista. Fica guardado aqui também para permitir consultas como
  // "todos os livros do usuário" sem precisar passar pela Lista.
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },

  livroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true },

  statusLeitura: {
    type: String,
    enum: STATUS_LEITURA,
    default: 'quero_ler',
    required: true,
  },

  // Data em que o livro foi adicionado à lista.
  adicionadoEm: { type: Date, default: Date.now, required: true },
}, {
  timestamps: true,
});

// Impede o mesmo livro duas vezes na mesma lista.
listaLivroSchema.index({ listaId: 1, livroId: 1 }, { unique: true });
// Acelera "todos os livros de um usuário" e filtro por status.
listaLivroSchema.index({ usuarioId: 1, statusLeitura: 1 });

module.exports = mongoose.model('ListaLivro', listaLivroSchema);
module.exports.STATUS_LEITURA = STATUS_LEITURA;
