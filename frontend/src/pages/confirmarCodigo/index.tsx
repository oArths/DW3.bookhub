import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { toastWarn } from "../../utils/toast";
import { ApiError, ApiResponse, UserCodeLogin, verifyCode } from "../../services/userario";
import axios from "axios";
import { useSearchParams } from 'react-router-dom';

interface UserDataInterface {
  code: string
}

export default function ConfirmarCodigo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false)
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const [userData, setUserData] = useState<UserDataInterface>({
    code: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    console.log()
    if (email == null) {
      toastWarn('Sem email regsitardo')
      return;
    }

    if (userData.code.length <= 0) {
      toastWarn('Preencha o codigo para criar a nova senha')
      return;
    }

    try {

      const inputUser: UserCodeLogin = {
        email: email,
        code: userData.code
      }

      const response: ApiResponse | ApiError = await verifyCode(inputUser)

      if ('mensagem' in response) {
        navigate(`/nova-senha?email=${email}&code=${userData.code}`);
      }
    } catch (error) {

      if (axios.isAxiosError<ApiError>(error)) {
        const mensagem = error.response?.data.erro;
        if (typeof mensagem == "string") {
          toastWarn(mensagem)
        }
      }
    }
    setLoading(true)

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
          <h2>Confirme o código</h2>
          <p className="auth-sub">
            Código enviado para <strong>{email || "seu e-mail"}</strong>.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="code">Código de confirmação</label>
              <div className="auth-input-wrap">
                <input type="text" id="code" name="code" inputMode="numeric" placeholder="000000" onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    code: e.target.value
                  }))
                } />
              </div>
            </div>

            <button type="submit" className="auth-submit">Confirmar código</button>
          </form>
        </div>
      </main>
    </div>
  );
}
