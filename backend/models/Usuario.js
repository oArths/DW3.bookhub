const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  // Nome de exibição (o "Nome completo" do perfil). Diferente de username,
  // pode conter espaços e não precisa ser único.
  nome: { type: String, default: '' },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: '' },
  // URL do avatar escolhido (gerado pelo DiceBear a partir da seleção do usuário).
  avatarUrl: { type: String, default: '' },
  resetPasswordCode: { type: String, default: '' },
  resetPasswordToken: { type: String, default: '' },
  resetPasswordExpires: { type: Date, default: '' },
  resetPasswordSentAt: { type: Date, default: null },
}, {
  timestamps: true, // cria createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('Usuario', usuarioSchema);
