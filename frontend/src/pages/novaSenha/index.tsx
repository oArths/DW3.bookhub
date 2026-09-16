import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { toastWarn } from "../../utils/toast";
import { ApiError, UserCodeResetPassword, UserInputResponse } from "../../services/userario";
import { resetPassword } from "../../services/userario";
import { useSession } from "../../store/session";
import axios from "axios";

interface UserDataInterface {
	senha: string
	senhaConfirmação: string
}

export default function NovaSenha() {
	const navigate = useNavigate();
	const setToken = useSession((s) => s.setToken);
	const setUser = useSession((s) => s.setUser)

	const [searchParams] = useSearchParams();
	const [loading, setLoading] = useState<boolean>(false)
	const [showPassword, setShowPassword] = useState(false);

	const email = searchParams.get('email');
	const code = searchParams.get('code');
	const [userData, setUserData] = useState<UserDataInterface>({
		senha: "",
		senhaConfirmação: ""
	})


	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true)
		e.preventDefault();
		if (email == null || code == null) {
			toastWarn('Sem email ou codigo registrado')
			setLoading(false)
			return;
		}

		if (userData.senha.length <= 0 || userData.senhaConfirmação.length <= 0) {
			toastWarn('Preencha a nova senha para criar a nova senha')
			setLoading(false)
			return;
		}

		if (userData.senha.length < 8) {
			toastWarn('A nova senha deve ter no minimo 8 caracteres')
			setLoading(false)
			return;
		}

		if (userData.senha !== userData.senhaConfirmação) {
			toastWarn('As senhas precisam ser iguais')
			setLoading(false)
			return;
		}

		try {

			const inputUser: UserCodeResetPassword = {
				email: email,
				password: userData.senha,
				code: code
			}

			const response: UserInputResponse | ApiError = await resetPassword(inputUser)

			if ('_id' in response) {
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
					<h2>Crie uma nova senha</h2>
					<p className="auth-sub">
						{email ? `Defina uma nova senha para ${email}.` : "Defina uma nova senha para sua conta."}
					</p>

					<form onSubmit={handleSubmit}>
						<div className="auth-field">
							<label htmlFor="password">Nova senha</label>
							<div className="auth-input-wrap">
								<input type={showPassword ? "text" : "password"}
									id="password" name="password" placeholder="••••••••" autoComplete="new-password" onChange={(e) =>
										setUserData((prev) => ({
											...prev,
											senha: e.target.value
										}))} />
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

						<div className="auth-field">
							<label htmlFor="password-confirmation">Confirme a nova senha</label>
							<div className="auth-input-wrap">
								<input type={showPassword ? "text" : "password"}
									id="password-confirmation" placeholder="••••••••" name="password-confirmation" autoComplete="new-password" onChange={(e) =>
										setUserData((prev) => ({
											...prev,
											senhaConfirmação: e.target.value
										}))} />
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

						<button type="submit" className="auth-submit">Salvar nova senha</button>
					</form>
				</div>
			</main>
		</div>
	);
}
