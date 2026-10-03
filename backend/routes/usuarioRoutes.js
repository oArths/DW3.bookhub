const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const resend = require("../config/resend");
const crypto = require("crypto");
const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET

// Intervalo mínimo entre envios de código de recuperação por e-mail,
// para evitar spam de requisições de reset de senha.
const COOLDOWN_RESET_MS = 60 * 1000;

// POST /usuarios -> cria um novo usuário (cadastro)
router.post('/', async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ erro: 'username, email e password são obrigatórios.' });
    }

    // Nunca salvamos a senha em texto puro: o bcrypt transforma
    // "123456" em um hash irreversível, tipo "$2a$10$N9qo8u...".
    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({ username, email, passwordHash, bio });

    // Removemos o hash da resposta por segurança, mesmo sendo
    // um hash — não há motivo para expor isso na API.
    const { passwordHash: _omitido, ...usuarioSemSenha } = usuario.toObject();

    res.status(201).json(usuarioSemSenha);
  } catch (erro) {
    // Erro 11000 = campo "unique" duplicado (username ou email já existem)
    if (erro.code === 11000) {
      return res.status(409).json({ erro: 'Username ou email já cadastrado.' });
    }
    res.status(500).json({ erro: erro.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ erro: 'email e password são obrigatórios.' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({
        erro: 'Email ou senha incorretos.'
      });
    }
    const senhaCorreta = await bcrypt.compare(
      password,
      usuario.passwordHash
    );

    if (senhaCorreta) {
      // Removemos o hash da resposta por segurança, mesmo sendo
      // um hash — não há motivo para expor isso na API.
      const { passwordHash: _omitido, ...usuarioSemSenha } = usuario.toObject();

      res.status(201).json(usuarioSemSenha);
    } else {
      return res.status(404).json({
        erro: 'Email ou Senha Incorretos.'
      });
    }
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ erro: 'email é obrigatório.' });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({
        erro: 'Email não encontrado.'
      });
    }

    // Bloqueia pedidos seguidos para o mesmo e-mail: só permite um novo
    // código por janela de 1 minuto, evitando spam de requisições.
    const ultimoEnvio = usuario.resetPasswordSentAt
      ? new Date(usuario.resetPasswordSentAt).getTime()
      : 0;

    const decorrido = Date.now() - ultimoEnvio;

    if (ultimoEnvio > 0 && decorrido < COOLDOWN_RESET_MS) {
      const segundos = Math.ceil((COOLDOWN_RESET_MS - decorrido) / 1000);

      return res.status(429).json({
        erro: `Aguarde ${segundos} segundo(s) antes de solicitar um novo código.`,
        segundos,
      });
    }

    const code = crypto.randomInt(100000, 1000000).toString();

    usuario.resetPasswordCode = code;

    usuario.resetPasswordExpires = new Date(
      Date.now() + 60 * 60 * 1000
    );

    usuario.resetPasswordSentAt = new Date();

    await usuario.save();


    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "BookHub <onboarding@resend.dev>",

      to: usuario.email,

      subject: "Seu código para redefinir a senha",

      html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recuperação de senha - BookHub</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 40px 20px;
          background-color: #f4f4f5;
          font-family: Arial, Helvetica, sans-serif;
          color: #18181b;
        "
      >
        <div
          style="
            max-width: 520px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          "
        >
          <!-- Header -->
          <div
            style="
              padding: 28px;
              text-align: center;
              background-color: #18181b;
            "
          >
            <h1
              style="
                margin: 0;
                color: #ffffff;
                font-size: 26px;
              "
            >
              BookHub
            </h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 32px;">
            <h2
              style="
                margin: 0 0 16px;
                font-size: 24px;
              "
            >
              Recuperação de senha
            </h2>

            <p
              style="
                margin: 0 0 28px;
                color: #52525b;
                font-size: 16px;
                line-height: 1.6;
              "
            >
              Recebemos uma solicitação para redefinir a senha
              da sua conta. Utilize o código abaixo para continuar:
            </p>

            <!-- Code -->
            <div
              style="
                padding: 24px;
                margin-bottom: 28px;
                background-color: #f4f4f5;
                border: 1px solid #e4e4e7;
                border-radius: 12px;
                text-align: center;
              "
            >
              <span
                style="
                  display: block;
                  margin-bottom: 8px;
                  color: #71717a;
                  font-size: 13px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                "
              >
                Seu código
              </span>

              <strong
                style="
                  font-size: 36px;
                  letter-spacing: 8px;
                  color: #18181b;
                "
              >
                ${code}
              </strong>
            </div>

            <p
              style="
                margin: 0 0 12px;
                color: #52525b;
                font-size: 14px;
              "
            >
              ⏱️ Este código expira em <strong>10 minutos</strong>.
            </p>

            <p
              style="
                margin: 0;
                color: #71717a;
                font-size: 13px;
                line-height: 1.6;
              "
            >
              Se você não solicitou a recuperação de senha,
              pode ignorar este e-mail. Sua conta continuará segura.
            </p>
          </div>

          <!-- Footer -->
          <div
            style="
              padding: 20px 32px;
              border-top: 1px solid #e4e4e7;
              text-align: center;
            "
          >
            <p
              style="
                margin: 0;
                color: #a1a1aa;
                font-size: 12px;
              "
            >
              © ${new Date().getFullYear()} BookHub
            </p>
          </div>
        </div>
      </body>
    </html>
  `,
    });


    return res.status(200).json({
      mensagem: "Código enviado para o seu email.",
    });

  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

router.post("/verify-reset-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        erro: "Email e código são obrigatórios.",
      });
    }

    const usuario = await Usuario.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!usuario) {
      return res.status(400).json({
        erro: "Código inválido ou expirado.",
      });
    }

    return res.status(200).json({
      mensagem: "Código válido.",
    });

  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao verificar código.",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const {
      email,
      code,
      password,
    } = req.body;

    if (!email || !code || !password) {
      return res.status(400).json({
        erro: "Email, código e senha são obrigatórios.",
      });
    }

    const usuario = await Usuario.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!usuario) {
      return res.status(400).json({
        erro: "Código inválido ou expirado.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    usuario.passwordHash = passwordHash;

    usuario.resetPasswordCode = null;
    usuario.resetPasswordExpires = null;

    await usuario.save();

    const { passwordHash: _omitido, ...usuarioSemSenha } = usuario.toObject();

    res.status(201).json(usuarioSemSenha);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao alterar senha.",
    });
  }
});
// GET /usuarios/:id -> busca um usuário pelo id
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-passwordHash');
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    res.json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

module.exports = router;
