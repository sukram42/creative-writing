import { RootState } from "../store";

export const getCounter = (state: RootState) => state.ui.count

export const getActiveProjectId = (state: RootState) => state.ui.activeProjectId
export const getActiveProject = (state: RootState) => state.ui.activeProject
export const getChapters = (state: RootState) => state.ui.chapters
export const getItems = (state: RootState) => state.ui.items
export const getProjects = (state: RootState) => state.ui.projects
export const getAreProjectsLoading = (state: RootState) => state.ui.loadingProjects
export const getLoadChapter = (state: RootState) => state.ui.loadChapters
export const getUser = (state: RootState) => state.ui.user
export const loadingFinalTexts = (state: RootState) => state.ui.loadingFinalTexts
export const getProfile = (state: RootState) => state.ui.profile