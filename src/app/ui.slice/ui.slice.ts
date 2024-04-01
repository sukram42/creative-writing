import { createSlice } from "@reduxjs/toolkit"
import { UiState } from "./ui.slice.interface"
import { getChaptersByProject, upsertChapterTitle, upsertItemText, upsertNewChapter } from "./ui.slice.async"
import { Item } from "../supabaseClient"
import { v4 as uuidv4 } from 'uuid';



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
        if (c.chapter_id == action.payload.chapterId) {
          c.title = action.payload.newTitle
          return
        }
      }))
    },
    locallyAddChapterAtIndex: (state, action: {
      payload: {
        index: number,
        projectId: string
      }
    }) => {
      const newId = uuidv4()
      state.chapters.push({
        title: "",
        chapter_id: newId,
        created_at: "pending",
        descriptions: "",
        project: action.payload.projectId,
        index: action.payload.index
      })

      state.items[newId] = []
    },
    locallyUpdateItemText: (state, action: {
      payload: {
        item: Item,
        newText: string,
        field: string
      }
    }) => {
      state.items[action.payload.item.chapter].forEach((i: Item) => {
        if (i.item_id === action.payload.item.item_id) {
          i[action.payload.field] = action.payload.newText
          return
        }
      })
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
      ),
      builder.addCase(
        upsertItemText.fulfilled, (state, action) => {
          if (!action.payload) return
          console.log(action.payload)
          state.items[action.payload[0].chapter].forEach(i => {
            if (i.item_id === action.payload[0].item_id) {
              i.final = action.payload[0].final
              i.outline = action.payload[0].outline
              return
            }
          })
        }
      )
  }

})

export default uiSlice.reducer
export const { addToCount, locallyUpdateChapterTitle, locallyUpdateItemText, locallyAddChapterAtIndex } = uiSlice.actions