import { create } from 'zustand'

let toastId = 0

export const useUiStore = create((set) => ({
  toasts: [],
  addToast: (message, tone = 'success') =>
    set((state) => ({
      toasts: [...state.toasts, { id: toastId += 1, message, tone }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}))
