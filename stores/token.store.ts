import { create } from "zustand";

type TTokenStore = {
  token: string;

  setToken: (token: string) => void;
  clearToken: () => void;
};

export const useTokenStore = create<TTokenStore>((set) => ({
  token: "",
  setToken: (token: string) => set({ token }),
  clearToken: () => set({ token: "" }),
}));
