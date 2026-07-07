import { create } from 'zustand';

type UiState = {
  refreshEnabled: boolean;
  toggleRefresh: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  refreshEnabled: true,
  toggleRefresh: () => set((state) => ({ refreshEnabled: !state.refreshEnabled })),
}));
