require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conectarBancoDeDados = require('./config/db');

const usuarioRoutes = require('./routes/usuarioRoutes');
const livroRoutes = require('./routes/livroRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Sem isso, o navegador bloqueia por padrão chamadas feitas
// de um front-end (ex: http://localhost:5173, o React) para
// um back-end em outra porta (ex: http://localhost:3000).
app.use(cors());
app.use(express.json());

// Rota simples só para confirmar que o servidor está de pé.
app.get('/', (req, res) => {
  res.send('API do BookHub está no ar!');
});

// Cada "app.use" liga um prefixo de URL a um arquivo de rotas.
// Ex: POST /usuarios vai cair no router de usuarioRoutes.js
app.use('/usuarios', usuarioRoutes);
app.use('/livros', livroRoutes);
app.use('/reviews', reviewRoutes);

const PORT = process.env.PORT || 3000;

conectarBancoDeDados().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
});
