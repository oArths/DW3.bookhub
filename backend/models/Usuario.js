const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  resetPasswordCode: { type: String, default: '' },
  resetPasswordToken: { type: String, default: '' },
  resetPasswordExpires: { type: Date, default: '' },
  resetPasswordSentAt: { type: Date, default: null },
}, {
  timestamps: true, // cria createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('Usuario', usuarioSchema);
