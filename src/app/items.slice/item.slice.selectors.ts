import { RootState } from "../store";

export const getItemsV2 = (state: RootState) => state.items.itemsV2
export const getItemCount = (state: RootState) => state.items.itemsV2.length
export const getLoadingItems = (state: RootState) => state.items.loadingItems
export const getErrorItems = (state: RootState) => state.items.errorItems

export const getActiveFocusSide = (state: RootState) => state.items.activeFocusSide
export const getActiveFocusIndex = (state: RootState) => state.items.activeFocusIndex