import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
	const [searchParams] = useSearchParams();
	const [loading, setLoading] = useState<boolean>(false)

	const email = searchParams.get('email');
	const code = searchParams.get('code');
	const [userData, setUserData] = useState<UserDataInterface>({
		senha: "",
		senhaConfirmação: ""
	})


	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true)
		e.preventDefault();
		console.log()
		if (email == null || code == null) {
			toastWarn('Sem email ou codigo regsitardo')
			return;
		}

		if (userData.senha.length <= 0 || userData.senhaConfirmação.length <= 0) {
			toastWarn('Preencha o codigo para criar a nova senha')
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
		setLoading(true)

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
					<h2>Crie uma nova senha</h2>
					<p className="auth-sub">
						{email ? `Defina uma nova senha para ${email}.` : "Defina uma nova senha para sua conta."}
					</p>

					<form onSubmit={handleSubmit}>
						<div className="auth-field">
							<label htmlFor="password">Nova senha</label>
							<div className="auth-input-wrap">
								<input type="password" id="password" name="password" autoComplete="new-password" onChange={(e) =>
									setUserData((prev) => ({
										...prev,
										senha: e.target.value
									}))} />
							</div>
						</div>

						<div className="auth-field">
							<label htmlFor="password-confirmation">Confirme a nova senha</label>
							<div className="auth-input-wrap">
								<input type="password" id="password-confirmation" name="password-confirmation" autoComplete="new-password" onChange={(e) =>
									setUserData((prev) => ({
										...prev,
										senhaConfirmação: e.target.value
									}))} />
							</div>
						</div>

						<button type="submit" className="auth-submit">Salvar nova senha</button>
					</form>
				</div>
			</main>
		</div>
	);
}
