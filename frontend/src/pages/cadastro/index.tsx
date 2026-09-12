


export default function Cadastro(){
    return( <div className="auth-shell">
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
              />
              <button
                type="button"
                className="auth-toggle-pw"
                data-toggle-password
                aria-controls="password"
                aria-label="Mostrar senha"
                aria-pressed="false"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
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

          <button type="submit" className="auth-submit">Cadastrar</button>
        </form>
      </div>
    </main>
  </div>)
}