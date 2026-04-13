import { create } from 'zustand'
import { creators } from '../data/mockData'

export const useFavoriteStore = create((set) => ({
  favoriteIds: creators.filter((creator) => creator.isFavorite).map((creator) => creator.id),
  toggleFavorite: (creatorId) =>
    set((state) => ({
      favoriteIds: state.favoriteIds.includes(creatorId)
        ? state.favoriteIds.filter((id) => id !== creatorId)
        : [...state.favoriteIds, creatorId],
    })),
}))
