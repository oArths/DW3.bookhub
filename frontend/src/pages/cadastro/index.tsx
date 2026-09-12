import { useState } from "react"
import { Bounce, ToastContainer, toast } from 'react-toastify';


interface UserDataInterface {
  name: string
  email: string
  senha: string
  senhaConfirmação: string
}

export default function Cadastro() {


  const [userData, setUserData] = useState<UserDataInterface>({
    name: "",
    email: "",
    senha: "",
    senhaConfirmação: ""
  })

  const handlerCreateUser = () => {

    if (userData.email.length <= 0 || userData.name.length <= 0 || userData.senha.length <= 0 || userData.senhaConfirmação.length <= 0) {
      toast.warn('Preencha todos os campos antes de se cadastrar', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }



  }


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
        <a className="auth-logo" href="/">BookHub</a>

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

        <form id="register-form" >
          <div className="auth-field">
            <label >Nome</label>
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
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder="********"
                minLength={8}
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
                data-toggle-password
                aria-controls="password"
                aria-label="Mostrar senha"
                aria-pressed="false"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    senhaConfirmação: e.target.value
                  }))
                }
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
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
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                autoComplete="new-password"
                placeholder="********"
                minLength={8}
                required
              />
            </div>
          </div>

          <button type="submit" onClick={handlerCreateUser} className="auth-submit">Cadastrar</button>
        </form>
      </div>
    </main>
  </div>)
}