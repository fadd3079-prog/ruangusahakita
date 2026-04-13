import { creators } from '../data/mockData'

export const favoriteService = {
  async getFavoriteCreators(favoriteIds) {
    return Promise.resolve(creators.filter((creator) => favoriteIds.includes(creator.id)))
  },
}
