import { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type RecoveryState = {
  email?: string;
};

export default function ConfirmarCodigo() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as RecoveryState | null)?.email ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const code = String(formData.get("code") ?? "").trim();

    if (!code) return;

    navigate("/nova-senha", { state: { email } });
  }

  return (
    <div className="auth-shell">
      <aside className="auth-brand" aria-label="BookHub">
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
            Código simulado para <strong>{email || "seu e-mail"}</strong>. Nenhuma mensagem foi enviada.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="code">Código de confirmação</label>
              <div className="auth-input-wrap">
                <input type="text" id="code" name="code" inputMode="numeric" placeholder="000000" required />
              </div>
            </div>

            <button type="submit" className="auth-submit">Confirmar código</button>
          </form>
        </div>
      </main>
    </div>
  );
}
