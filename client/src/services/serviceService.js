import { services } from '../data/mockData'

export const serviceService = {
  async getServices() {
    return Promise.resolve(services)
  },

  async getServiceBySlug(slug) {
    return Promise.resolve(services.find((service) => service.slug === slug) || null)
  },

  async getServiceById(id) {
    return Promise.resolve(services.find((service) => service.id === id) || null)
  },
}
