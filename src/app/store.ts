import { configureStore } from "@reduxjs/toolkit"
import uiSlice from "./ui.slice/ui.slice"

export const store = configureStore({
  reducer: {
    ui: uiSlice,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>