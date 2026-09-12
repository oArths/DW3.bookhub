import { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type RecoveryState = {
	email?: string;
};

export default function NovaSenha() {
	const navigate = useNavigate();
	const location = useLocation();
	const email = (location.state as RecoveryState | null)?.email ?? "";

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		navigate("/");
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
								<input type="password" id="password" name="password" minLength={6} autoComplete="new-password" required />
							</div>
						</div>

						<div className="auth-field">
							<label htmlFor="password-confirmation">Confirme a nova senha</label>
							<div className="auth-input-wrap">
								<input type="password" id="password-confirmation" name="password-confirmation" minLength={6} autoComplete="new-password" required />
							</div>
						</div>

						<button type="submit" className="auth-submit">Salvar nova senha</button>
					</form>
				</div>
			</main>
		</div>
	);
}
