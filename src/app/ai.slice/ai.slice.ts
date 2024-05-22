import { createSlice } from "@reduxjs/toolkit"
import { AiState } from "./ai.slice.interface"

const initialState: AiState = {

}

export const aiSlice = createSlice({
  "name": "ai",
  initialState,
  reducers: {
  }
})

export default aiSlice.reducer
export const { } = aiSlice.actions