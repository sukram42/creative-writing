import { createSlice } from "@reduxjs/toolkit"
import { UiState } from "./ui.slice.interface"
import { getChaptersByProject, upsertChapterTitle } from "./ui.slice.async"


const initialState: UiState = {
  count: 0,
  activeProject: "34cf04e5-2ba0-41ba-ac44-705c33065481",
  chapters: [],
  items: {}
}

export const uiSlice = createSlice({
  "name": "ui",
  initialState,
  reducers: {
    addToCount: (state, action: { payload: number }) => {
      state.count = state.count + action.payload
    },
    locallyUpdateChapterTitle: (state, action: { payload: { chapterId: string, newTitle: string } }) => {
      state.chapters.forEach((c => {
        if(c.chapter_id == action.payload.chapterId){
          c.title = action.payload.newTitle
          return
        }
      }))
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      getChaptersByProject.fulfilled, (state, action) => {
        state.chapters = action.payload.chapters
        state.items = action.payload.items
      }),
      builder.addCase(
        upsertChapterTitle.fulfilled, (state, action) => {
          state.chapters.forEach((c) => {
            if (c.chapter_id === action.payload[0].chapter_id) {
              c.title = action.payload[0].title
              return
            }
          })
        }
      )
  }

})

export default uiSlice.reducer
export const { addToCount, locallyUpdateChapterTitle} = uiSlice.actions