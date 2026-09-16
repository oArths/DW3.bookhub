import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toastWarn } from "../../utils/toast";
import { ApiError, ApiResponse, UserInputForgot, verifyCode } from "../../services/userario";
import axios from "axios";
import { Bounce, ToastContainer } from "react-toastify";


interface UserDataInterface {
  email: string
}

export default function RecuperarSenha() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<UserDataInterface>({
    email: "",
  })
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    if (userData.email.length <= 0) {
      toastWarn('Preencha todos os campos antes de se cadastrar')
      setLoading(false)
      return;
    }
    try {

      const inputUser: UserInputForgot = {
        email: userData.email,
      }

      const response: ApiResponse | ApiError = await verifyCode(inputUser)

      if ('mensagem' in response) {
        navigate(`/confirmar-codigo?email=${userData.email}`);
      }
    } catch (error) {

      if (axios.isAxiosError<ApiError>(error)) {
        const mensagem = error.response?.data.erro;
        if (typeof mensagem == "string") {
          toastWarn(mensagem)
        }
      }
    }
    setLoading(false)

  }

  return (
    <div className="auth-shell">
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
        <div className="auth-form-wrap auth-form-wrap--compact">
          <h2>Informe seu e-mail</h2>
          <p className="auth-sub">
            Já possui conta? <a href="/">Faça login</a>
          </p>

          <div className="auth-message auth-message--error" data-auth-message hidden role="alert"></div>

          <form id="forgot-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label >Email</label>
              <div className="auth-input-wrap">
                <input type="email" id="email" name="email" autoComplete="email" placeholder="teste@exemplo.com" onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    email: e.target.value
                  }))
                } />

              </div>
            </div>


            <button type="submit" disabled={loading} className="auth-submit">Confirmar</button>
          </form>
        </div>
      </main>
    </div>
  )
}

