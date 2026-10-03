import { useState } from "react"
import { Bounce, ToastContainer } from 'react-toastify';
import { ApiError, UserInputCreate, UserInputResponse } from "../../services/userario";
import { createUser } from "../../services/userario";
import axios from "axios";
import { toastWarn } from "../../utils/toast";
import { useSession } from "../../store/session";
import { useNavigate } from "react-router-dom";

interface UserDataInterface {
  name: string
  email: string
  senha: string
  senhaConfirmação: string
}

export default function Cadastro() {

  const setToken = useSession((s) => s.setToken);
  const setUser = useSession((s) => s.setUser)

  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserDataInterface>({
    name: "",
    email: "",
    senha: "",
    senhaConfirmação: ""
  })

  const handlerCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.table(userData)
    if (userData.email.length <= 0 || userData.name.length <= 0 || userData.senha.length <= 0 || userData.senhaConfirmação.length <= 0) {
      toastWarn('Preencha todos os campos antes de se cadastrar')
      return;
    }

    if (userData.senha.length < 8 || userData.senhaConfirmação.length < 8) {
      toastWarn('As senhas deve ter no minimo 8 caracteres');
      return;
    }
    if (userData.senha !== userData.senhaConfirmação) {
      toastWarn('As senhas deve ser iguais');
      return;
    }

    try {

      const inputUser: UserInputCreate = {
        username: userData.name,
        email: userData.email,
        password: userData.senha,
        bio: null

      }

      const response: UserInputResponse | string = await createUser(inputUser)

      if (typeof response !== "string") {
        setToken(response._id)
        setUser(response)

        navigate("/home");
      }

    } catch (error) {

      if (axios.isAxiosError<ApiError>(error)) {
        const mensagem = error.response?.data.erro;
        if (typeof mensagem == "string") {
          toastWarn(mensagem)
        }
      }
    }

  }
  const [showPassword, setShowPassword] = useState(false);


  return (<div className="auth-shell">

    <aside className="auth-brand" aria-label="BookHub">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="auth-brand-inner">
        <a className="auth-logo" href="/">
          <span className="auth-logo-mark" aria-hidden="true"><img src="/logo.png" className="aspect-square w-[70%]" /></span>
          BookHub
        </a>
        <div className="auth-hero">
          <h1>Registre os livros que você já leu.</h1>
          <p>Salve aqueles que você quer e compartilhe com seus amigos o que você achou bom.</p>
        </div>
      </div>
    </aside>

    <main className="auth-panel">
      <div className="auth-form-wrap">
        <h2>Cadastro</h2>
        <p className="auth-sub">
          Já possui conta? <a href="/">Faça login</a>
        </p>

        <div className="auth-message auth-message--error" data-auth-message hidden role="alert"></div>

        <form onSubmit={handlerCreateUser} >
          <div className="auth-field">
            <label >Username</label>
            <div className="auth-input-wrap">
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Seu nome"
                minLength={2}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    name: e.target.value
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label >Email</label>
            <div className="auth-input-wrap">
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="seu@email.com"
                required
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    email: e.target.value
                  }))
                }
              />
            </div>
          </div>

          <div className="auth-field">
            <label >Senha</label>
            <div className="auth-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder="********"

                required
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    senha: e.target.value
                  }))
                }
              />

              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                aria-controls="password"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label >Confirmação de senha</label>
            <div className="auth-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="passwordConfirm"
                name="passwordConfirm"
                autoComplete="new-password"
                placeholder="********"
                required
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    senhaConfirmação: e.target.value
                  }))
                }
              />
              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                aria-controls="password"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                aria-pressed={showPassword}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>

          </div>

          <button type="submit" className="auth-submit">Cadastrar</button>
        </form>
      </div>
    </main>
  </div>)
}

