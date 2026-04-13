import { create } from 'zustand'
import { ROLES } from '../constants/roles'

export const useAuthStore = create((set) => ({
  user: {
    name: 'Fadhol',
    email: 'fadhol@example.com',
  },
  role: ROLES.umkm,
  setRole: (role) => set({ role }),
  setUser: (user) => set({ user }),
}))
