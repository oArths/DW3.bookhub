import { useState } from "react";
import { toastWarn } from "../../utils/toast";
import { ApiError, UserInputLogin } from "../../services/userario";
import { loginUser } from "../../services/userario";
import axios from "axios";
import { useSession } from "../../store/session";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";

interface UserDataInterface {
    email: string
    senha: string
}


export default function Login() {
    const [userData, setUserData] = useState<UserDataInterface>({
        email: "",
        senha: "",
    })

    const setToken = useSession((s) => s.setToken)
    const setUser = useSession((s) => s.setUser)
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handlerLoginUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.table(userData)
        if (userData.email.length <= 0 || userData.senha.length <= 0) {
            toastWarn('Preencha todos os campos antes de se cadastrar')

            return;
        }
        if (userData.senha.length < 8) {
            toastWarn('As senhas deve ter no minimo 8 caracteres');

            return;
        }
        try {

            const inputUser: UserInputLogin = {
                email: userData.email,
                password: userData.senha,
            }

            const response = await loginUser(inputUser)

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

                <form onSubmit={handlerLoginUser} >
                    <div className="auth-field">
                        <label >E-mail</label>
                        <div className="auth-input-wrap">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="voce@email.com"
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
                        <div className="auth-field-header">
                            <label >Senha</label>
                            <a href="/recuperar-senha">Esqueceu a senha?</a>
                        </div>
                        <div className="auth-input-wrap">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="••••••••"
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