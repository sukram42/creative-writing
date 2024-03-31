import { createSlice } from "@reduxjs/toolkit"
import { UiState } from "./ui.slice.interface"


const initialState: UiState = {
  count: 0
}

export const uiSlice = createSlice({
  "name": "ui",
  initialState,
  reducers: {
    addToCount: (state, action: {payload: number})=>{
      state.count = state.count + action.payload
    }
  },
})

export default uiSlice.reducer

export const { addToCount } = uiSlice.actions