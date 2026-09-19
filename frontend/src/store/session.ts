import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  username: string;
  email: string;
  bio: string;
  avatarURL: string;
  createdAt: string;
}

interface SessionInterface {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useSession = create<SessionInterface>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user) => set({ user }),

      setToken: (token) => set({ token }),

      logout: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: "session",
    },
  ),
);
