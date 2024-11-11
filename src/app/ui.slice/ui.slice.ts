import { createSlice } from "@reduxjs/toolkit"
import { UiState } from "./ui.slice.interface"
import { getChaptersByProject, upsertChapterTitle, upsertItemText } from "./ui.slice.async"
import { Chapter, Item, ItemV2, Profile, Project } from "../supabaseClient"
import { v4 as uuidv4 } from 'uuid';
import { User } from "@supabase/supabase-js";



const initialState: UiState = {
  count: 0,
  activeProjectId: null,
  activeProject: null,
  projects: [],
  loadingProjects: true,

  user: undefined,
  loadProject: false,

  rawDrawerOpen: false,
  documentDrawerOpen: false,
  showSidebar: true,
  sidebarSize: ["20%", "80%"],

  itemsV2: [],

  chapters: [],
  items: {},

  loadingFinalTexts: []
}

export const uiSlice = createSlice({
  "name": "ui",
  initialState,
  reducers: {
    setParagraphToLoad: (state, action: { payload: string }) => {
      let data = new Set(state.loadingFinalTexts)
      data.add(action.payload)
      state.loadingFinalTexts = [...data]
    },
    setProfile: (state, action: { payload: Profile }) => {
      state.profile = action.payload
    },
    rmParagraphFromLoading: (state, action: { payload: string }) => {
      let data = new Set(state.loadingFinalTexts)
      data.delete(action.payload)
      state.loadingFinalTexts = [...data]
    },
    setUser: (state, action: { payload: User | undefined }) => {
      state.user = action.payload
    },
    addToCount: (state, action: { payload: number }) => {
      state.count = state.count + action.payload
    },
    setDocumentDrawerOpen: (state, action: { payload: boolean }) => {
      state.documentDrawerOpen = action.payload
    },
    setRawDrawerOpen: (state, action: { payload: boolean }) => {
      state.rawDrawerOpen = action.payload
    },
    updateProjectName: (state, action: { payload: { name: string } }) => {
      if (!state.activeProject) {
        return
      }
      const project = { ...state.activeProject }
      project.name = action.payload.name
      state.activeProject = project

      state.projects.forEach((p) => {
        if (p.project_id === state.activeProject?.project_id) {
          p.name = action.payload.name
        }
      })
    },
    setLoadProject: (state, action: { payload: boolean }) => {
      state.loadProject = action.payload
    },
    locallyUpdateChapterTitle: (state, action: { payload: { chapterId: string, newTitle: string } }) => {
      state.chapters.forEach((c => {
        if (c.chapter_id == action.payload.chapterId) {
          c.title = action.payload.newTitle
          return
        }
      }))
    },
    updateChapters: (state, action: { payload: { chapters: Chapter[] } }) => {
      state.chapters = action.payload.chapters
    },
    setLoadingProjects: (state, action: { payload: boolean }) => {
      state.loadingProjects = action.payload
    },
    locallyAddChapterAtIndex: (state, action: {
      payload: {
        index: number,
        projectId: string,
        chapter?: Chapter
      }
    }) => {
      const newId = uuidv4()
      state.chapters.push(action.payload.chapter || {
        title: "",
        chapter_id: newId,
        created_at: "pending",
        descriptions: "",
        project: action.payload.projectId,
        index: action.payload.index
      })

      state.items[newId] = []
    },
    updateProjects: (state, action: { payload: Project[] }) => {
      state.projects = [...action.payload]
    },
    locallyRemoveChapter: (state, action: { payload: string }) => {
      // delete state.chapters[action.payload]
      const chapters = state.chapters.filter(c => c.chapter_id !== action.payload)
      state.chapters = chapters

      const items = state.items
      delete items[action.payload]
      state.items = items
    },
    updateItemText: (state, action: {
      payload: {
        item: Item,
        newText: string,
        field: "final" | "outline"
      }
    }) => {
      state.items[action.payload.item.chapter].forEach((i: Item) => {
        if (i.item_id === action.payload.item.item_id) {
          i[action.payload.field] = action.payload.newText
          return
        }
      })
    },
    updateActiveProject(state, action: { payload: Project }) {
      state.activeProject = action.payload
    },
    updateActiveProjectId(state, action: { payload: string }) {
      state.activeProjectId = action.payload
    },
    updateItem(state, action: { payload: { item: Item } }) {
      state.items[action.payload.item.chapter].forEach((i: Item) => {
        if (i.item_id === action.payload.item.item_id) {
          i = action.payload.item
          return
        }
      })
    },
    setShowSidebar(state, action: { payload: boolean }) {
      state.showSidebar = action.payload
    },
    updateItems(state, action: { payload: { items: Item[], chapter: string } }) {
      state.items[action.payload.chapter] = action.payload.items
    },
    setItemsV2(state, action: { payload: { items: ItemV2[] } }) {
      console.log("payload", action.payload)
      state.itemsV2 = action.payload.items;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      getChaptersByProject.fulfilled, (state, action) => {
        if (!action.payload) return
        state.chapters = action.payload.chapters
        //@ts-ignore
        state.items = action.payload.items
      }),
      builder.addCase(
        upsertChapterTitle.fulfilled, (state, action) => {
          state.chapters.forEach((c) => {
            if (action.payload !== null && c.chapter_id === action.payload[0].chapter_id) {
              c.title = action.payload[0].title
              return
            }
          })
        }
      ),
      builder.addCase(
        upsertItemText.fulfilled, (state, action) => {
          if (action.payload !== null) {
            state.items[action.payload[0].chapter].forEach(i => {
              if (action.payload === null) return
              if (i.item_id === action.payload[0].item_id) {
                i.final = action.payload[0].final
                i.outline = action.payload[0].outline
                return
              }
            })
          }
        }
      )
  }

})

export default uiSlice.reducer
export const { addToCount,
  locallyUpdateChapterTitle,
  updateItemText,
  locallyAddChapterAtIndex,
  setRawDrawerOpen,
  locallyRemoveChapter,
  setShowSidebar,
  updateChapters,
  setLoadingProjects,
  updateProjects,
  setLoadProject,
  setParagraphToLoad,
  setDocumentDrawerOpen,
  updateActiveProject,
  setUser,
  rmParagraphFromLoading,
  setProfile,
  updateProjectName,
  setItemsV2,
  updateItems } = uiSlice.actions