import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { toastSuccess, toastWarn } from "../../utils/toast";
import { ApiError, ApiResponse, UserCodeLogin, UserInputForgot, getCode, verifyCode } from "../../services/userario";
import axios from "axios";
import { useSearchParams } from 'react-router-dom';
import { useResendTimer } from "../../store/resendTimer";

interface UserDataInterface {
  code: string
}

function formatTimer(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export default function ConfirmarCodigo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false)
  const [resending, setResending] = useState<boolean>(false)
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const { secondsLeft, start, sync } = useResendTimer();
  const canResend = secondsLeft <= 0;

  useEffect(() => {
    sync(email ?? "");

    const resync = () => sync(email ?? "");
    window.addEventListener("focus", resync);
    document.addEventListener("visibilitychange", resync);
    return () => {
      window.removeEventListener("focus", resync);
      document.removeEventListener("visibilitychange", resync);
    };
  }, [email, sync]);

  const [userData, setUserData] = useState<UserDataInterface>({
    code: "",
  })

  const handleResend = async () => {
    if (email == null || !canResend || resending) {
      return;
    }
    setResending(true)
    try {
      const inputUser: UserInputForgot = {
        email: email,
      }

      const response: ApiResponse | ApiError = await verifyCode(inputUser)

      if ('mensagem' in response) {
        start(email);
        toastSuccess('Novo código enviado para o seu e-mail.');
      }
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        const mensagem = error.response?.data.erro;
        if (typeof mensagem == "string") {
          toastWarn(mensagem)
        }
        const segundos = error.response?.data.segundos;
        if (typeof segundos == "number") {
          start(email, segundos)
        }
      }
    }
    setResending(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    if (email == null) {
      toastWarn('Sem email registrado')
      setLoading(false)
      return;
    }

    if (userData.code.length <= 0) {
      toastWarn('Preencha o codigo para criar a nova senha')
      setLoading(false)
      return;
    }

    try {

      const inputUser: UserCodeLogin = {
        email: email,
        code: userData.code
      }

      const response: ApiResponse | ApiError = await getCode(inputUser)

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

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Confirmando..." : "Confirmar código"}
            </button>

            <p className="auth-resend-hint">
              O código não chegou?{" "}
              {canResend ? (
                <button
                  type="button"
                  className="auth-resend-link"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? "Enviando..." : "Faça o reenvio"}
                </button>
              ) : (
                <span className="auth-resend-wait">
                  Reenviar em {formatTimer(secondsLeft)}
                </span>
              )}
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
