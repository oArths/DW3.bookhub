const mongoose = require('mongoose');

const segueSchema = new mongoose.Schema({
  seguidorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  seguidoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
}, {
  timestamps: true,
});

// Evita que o mesmo usuário siga outro duas vezes.
segueSchema.index({ seguidorId: 1, seguidoId: 1 }, { unique: true });

module.exports = mongoose.model('Segue', segueSchema);
