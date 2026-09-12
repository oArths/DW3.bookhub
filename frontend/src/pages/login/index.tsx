

export default function Login() {
    return (<div className="auth-shell">
        <aside className="auth-brand" aria-label="BookHub">
            
            <div className="auth-brand-inner">
                <a className="auth-logo" href="/">
                    <span className="auth-logo-mark" aria-hidden="true">📖</span>
                    BookHub
                </a>

                <div className="auth-hero">
                    <h1>Sua próxima <span className="hl">grande leitura</span> começa aqui.</h1>
                    <p>Descubra livros, compartilhe resenhas e conecte-se com leitores que têm os mesmos gostos que você.</p>

                    <ul className="auth-stats" role="list">
                        <li><strong>240k</strong><span>Leitores</span></li>
                        <li><strong>1.8M</strong><span>Livros catalogados</span></li>
                        <li><strong>560k</strong><span>Resenhas</span></li>
                    </ul>
                </div>

                <blockquote className="auth-quote">
                    “Finalmente uma rede social feita para quem ama literatura de verdade.”
                    <cite>— Mariana Costa, bookstagrammer</cite>
                </blockquote>
            </div>
        </aside>

        <main className="auth-panel">
            <div className="auth-form-wrap">
                <h2>Entrar na conta</h2>
                <p className="auth-sub">
                    Ainda não tem conta? <a href="/cadastro">Cadastre-se grátis</a>
                </p>

                <div className="auth-message auth-message--error" data-auth-message hidden role="alert"></div>

                <form id="login-form">
                    <div className="auth-field">
                        <label >E-mail</label>
                        <div className="auth-input-wrap">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="voce@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <div className="auth-field-header">
                            <label >Senha</label>
                            <a href="/recuperar-senha">Esqueceu a senha?</a>
                        </div>
                        <div className="auth-input-wrap">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
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
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit">Entrar</button>
                </form>

                <p className="auth-legal">
                    Ao entrar, você concorda com nossos
                    <a href="#"> Termos de Uso</a> e
                    <a href="#"> Política de Privacidade</a>.
                </p>
            </div>
        </main>
    </div>)
}