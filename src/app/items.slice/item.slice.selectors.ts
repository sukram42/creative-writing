import { RootState } from "../store";

export const getItemsV2 = (state: RootState) => state.items.itemsV2
export const getLoadingItems = (state: RootState) => new Set(state.items.loadingItems)

export const getActiveEditingSide = (state: RootState) => state.items.activeEditingSide