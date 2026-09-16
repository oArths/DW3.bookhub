import { create } from "zustand";
interface sessionInterface {
  token: string | null;
  setToken: (token: string) => void;
}
export const useSession = create<sessionInterface>((set) => ({
  token: null,
  setToken: (newToken) => set({ token: newToken }),
}));
