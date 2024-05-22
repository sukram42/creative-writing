import { configureStore } from "@reduxjs/toolkit"
import uiSlice from "./ui.slice/ui.slice"
import itemsSlice from "./items.slice/item.slice"

export const store = configureStore({
  reducer: {
    ui: uiSlice,
    items: itemsSlice,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>