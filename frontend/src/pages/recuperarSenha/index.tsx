export default function RecuperarSenha(){
    return(
          <div className="auth-shell">
    <aside className="auth-brand" aria-label="BookHub">
      <div className="auth-brand-inner">
        <a className="auth-logo" href="login.html">BookHub</a>

        <div className="auth-hero">
          <h1>Registre os livros que você já leu.</h1>
          <p>Salve aqueles que você quer e compartilhe com seus amigos o que você achou bom.</p>
        </div>
      </div>
    </aside>

    <main className="auth-panel">
      <div className="auth-form-wrap auth-form-wrap--compact">
        <h2>Informe o código enviado ao seu e-mail</h2>
        <p className="auth-sub">
          Já possui conta? <a href="login.html">Faça login</a>
        </p>

        <div className="auth-message auth-message--error" data-auth-message hidden role="alert"></div>

        <form id="forgot-form">
          <div className="auth-field">
            <label >Email</label>
            <div className="auth-input-wrap">
              <input type="email" id="email" name="email" autoComplete="email" placeholder="seu@email.com" required />
            </div>
          </div>

          <div className="auth-field">
            <label >Código</label>
            <div className="auth-input-wrap">
              <input type="text" id="code" name="code" inputMode="numeric" autoComplete="one-time-code" placeholder="••••••" maxLength={6} required />
            </div>
          </div>

          <button type="submit" className="auth-submit">Confirmar</button>
        </form>
      </div>
    </main>
  </div>
    )
}