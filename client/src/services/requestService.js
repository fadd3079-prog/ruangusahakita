import { requests } from '../data/mockData'

export const requestService = {
  async getRequests() {
    return Promise.resolve(requests)
  },

  async getRequestById(id) {
    return Promise.resolve(requests.find((request) => request.id === id) || null)
  },
}
