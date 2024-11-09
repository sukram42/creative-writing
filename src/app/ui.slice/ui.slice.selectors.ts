import { RootState } from "../store";

export const getCounter = (state: RootState) => state.ui.count

export const getActiveProjectId = (state: RootState) => state.ui.activeProjectId
export const getActiveProject = (state: RootState) => state.ui.activeProject
export const getChapters = (state: RootState) => state.ui.chapters
export const getItems = (state: RootState) => state.ui.items
export const getProjects = (state: RootState) => state.ui.projects
export const getAreProjectsLoading = (state: RootState) => state.ui.loadingProjects
export const getLoadProject = (state: RootState) => state.ui.loadProject
export const getUser = (state: RootState) => state.ui.user
export const loadingFinalTexts = (state: RootState) => state.ui.loadingFinalTexts
export const getProfile = (state: RootState) => state.ui.profile

export const isShowSidebar = (state: RootState) => state.ui.showSidebar

export const getDocumentDrawerState = (state: RootState) => state.ui.documentDrawerOpen
export const getRawDrawerState = (state: RootState) => state.ui.rawDrawerOpen

export const getItemsV2 = (state: RootState) => state.ui.itemsV2