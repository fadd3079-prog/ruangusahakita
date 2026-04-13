import { portfolioItems } from '../data/mockData'

export const portfolioService = {
  async getPortfolioItems() {
    return Promise.resolve(portfolioItems)
  },
}
