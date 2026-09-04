const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // "ref" diz ao Mongoose a qual coleção esse ObjectId pertence,
  // permitindo usar populate() para trazer os dados completos depois.
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  livroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true },
  nota: { type: Number, required: true, min: 0, max: 5 },
  texto: { type: String, default: '' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Review', reviewSchema);
