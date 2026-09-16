import { create } from "zustand";
interface User {
  _id: string;
  username: string;
  email: string;
  bio: string;
  avatarURL: string;
  createdAt: string;
}
interface sessionInterface {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useSession = create<sessionInterface>((set) => ({
  user: null,
  token: null,

  setUser: (user) => set({ user }),

  setToken: (token) => set({ token }),

  logout: () =>
    set({
      user: null,
      token: null,
    }),
}));
