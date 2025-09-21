import { create } from "zustand";


type TAuthStore = {
  email: string;
  code: string;

  setData: (email: string, code: string) => void;
  clearData: () => void;
};

export const useAuthStore = create<TAuthStore>((set) => ({
  email: "",
  code: "",
  setData: (email: string, code: string) => set({ email, code }),
  clearData: () => set({ email: "", code: "" }),
}));
