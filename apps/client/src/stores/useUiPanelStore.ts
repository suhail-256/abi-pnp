import { create } from 'zustand';

interface UiPanelState {
  showFunctions: boolean;
  activeAiPanel: string | null;
  actions: {
    setShowFunctions: (value: boolean) => void;
    setActiveAiPanel: (value: string | null) => void;
  };
}

const useUiPanelStore = create<UiPanelState>(set => ({
  showFunctions: false,
  activeAiPanel: null,
  actions: {
    setShowFunctions: (value: boolean) => set(() => ({ showFunctions: value })),
    setActiveAiPanel: (value: string | null) => set(() => ({ activeAiPanel: value })),
  },
}));

export const useShowFunctions = () => useUiPanelStore(state => state.showFunctions);
export const useActiveAiPanel = () => useUiPanelStore(state => state.activeAiPanel);
export const useUiPanelActions = () => useUiPanelStore(state => state.actions);
