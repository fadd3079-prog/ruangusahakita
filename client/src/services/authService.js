export const authService = {
  async login(payload) {
    return Promise.resolve({
      name: payload.email.split('@')[0],
      email: payload.email,
    })
  },

  async register(payload) {
    return Promise.resolve({
      name: payload.name,
      email: payload.email,
      role: payload.role,
    })
  },

  async requestPasswordReset(email) {
    return Promise.resolve({ email })
  },
}
