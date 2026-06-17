import { create } from 'zustand'
import type { CatalogFilters } from '@/types/yokai'

interface YokaiState {
  catalogFilters: CatalogFilters
  catalogScrollPosition: number
  setCatalogFilters: (filters: Partial<CatalogFilters>) => void
  resetCatalogFilters: () => void
  setCatalogScrollPosition: (pos: number) => void
}

const defaultFilters: CatalogFilters = {
  chapter: null,
  region: null,
  dangerLevel: null,
  searchQuery: '',
}

export const useYokaiStore = create<YokaiState>((set) => ({
  catalogFilters: { ...defaultFilters },
  catalogScrollPosition: 0,
  setCatalogFilters: (filters) =>
    set((state) => ({
      catalogFilters: { ...state.catalogFilters, ...filters },
    })),
  resetCatalogFilters: () => set({ catalogFilters: { ...defaultFilters } }),
  setCatalogScrollPosition: (pos) => set({ catalogScrollPosition: pos }),
}))
