import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function RecuperarSenha(){
    const navigate = useNavigate();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("email") ?? "").trim();

      if (!email) return;

      navigate("/confirmar-codigo", { state: { email } });
    }

    return(
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
          <h2>Informe seu e-mail</h2>
        <p className="auth-sub">
          Já possui conta? <a href="/">Faça login</a>
        </p>

        <div className="auth-message auth-message--error" data-auth-message hidden role="alert"></div>

        <form id="forgot-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label >Email</label>
            <div className="auth-input-wrap">
              <input type="email" id="email" name="email" autoComplete="email" placeholder="teste@exemplo.com" required />
            </div>
          </div>

     
          <button type="submit" className="auth-submit">Confirmar</button>
        </form>
      </div>
    </main>
  </div>
    )
}