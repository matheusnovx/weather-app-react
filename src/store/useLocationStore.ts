import { create } from 'zustand';
import { StorageService } from '../services/StorageService';

interface LocationState {
  selectedCityQuery: string | null;
  init: () => Promise<void>;
  setSelectedCity: (query: string) => Promise<void>;
  clearSelectedCity: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  selectedCityQuery: null,
  init: async () => {
    const saved = await StorageService.getSelectedCity();
    if (saved) {
      set({ selectedCityQuery: saved });
    }
  },
  setSelectedCity: async (query: string) => {
    await StorageService.saveSelectedCity(query);
    set({ selectedCityQuery: query });
  },
  clearSelectedCity: async () => {
    await StorageService.clearSelectedCity();
    set({ selectedCityQuery: null });
  },
}));
