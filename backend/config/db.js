const mongoose = require('mongoose');

// Essa função conecta o Back-end ao MongoDB usando a string
// guardada no arquivo .env (variável MONGO_URI).
async function conectarBancoDeDados() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (erro) {
    // Se a conexão falhar, o servidor é encerrado, pois a
    // aplicação não faz sentido sem acesso ao banco.
    console.error('Erro ao conectar ao MongoDB:', erro.message);
    process.exit(1);
  }
}

module.exports = conectarBancoDeDados;
