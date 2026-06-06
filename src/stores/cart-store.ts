import { create } from "zustand";

type CartState = {
  itemCount: number;
  setItemCount: (value: number) => void;
};

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  setItemCount: (value) => set({ itemCount: value }),
}));
