import { useSession } from "../../store/session";
import { UserDeafult } from "../../assets";
export default function Home() {
    const user = useSession((state) => state.user);
    const logout = useSession((state) => state.logout)

    return (
        <main className="flex items-center justify-center w-full h-screen">
            {user && (
                <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">

                        <img
                            src={user.avatarURL ?? UserDeafult}
                            alt={`Avatar de ${user.username}`}
                            className="h-16 w-16 rounded-full object-cover border-[0.5px] border-gray-200  "
                        />
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-900">

                                {user.username}
                            </h2>
                            <p className="text-sm text-zinc-500"> {user.email} </p>
                        </div>
                    </div>
                    <div className="mt-5">

                        <p className="text-sm font-medium text-zinc-700">

                            Sobre mim
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">

                            {user.bio || "Nenhuma biografia adicionada."}
                        </p>
                    </div>
                    <div className="mt-5 border-t border-zinc-100 pt-4">

                        <div className="flex justify-between text-sm">

                            <span className="text-zinc-500"> ID </span>
                            <span className="max-w-48 truncate text-zinc-700">

                                {user._id}
                            </span>
                        </div>
                        <div className="mt-2 flex justify-between text-sm">

                            <span className="text-zinc-500"> Criado em </span>
                            <span className="text-zinc-700">

                                {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                        </div>
                    </div>
                    <div className="w-full p- flex items-center justify-center">
                        <button onClick={() => logout()} className="bg-red-800 text-white px-4 py-1 rounded-2xl w-40">Sair da Seção</button>
                    </div>
                </div>
            )}
        </main>
    );
}
