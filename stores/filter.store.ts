import { create } from "zustand";


type TFilterStore = {
  filters: Record<string, string>;
  page: number;
  limit: number;

  setData: (filters: Record<string, string>, page: number, limit: number) => void;
  clearData: () => void;
};

export const useFilterStore = create<TFilterStore>((set) => ({
  filters: {},
  page: 1,
  limit: 10,
  setData: (filters: Record<string, string>, page: number, limit: number) => set({ filters, page, limit }),
  clearData: () => set({ filters: {}, page: 1, limit: 10 }),
}));
