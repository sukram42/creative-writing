import { RootState } from "../store";

export const getCounter = (state: RootState) => state.ui.count

export const getActiveProject = (state: RootState) => state.ui.activeProject
export const getChapters = (state: RootState) => state.ui.chapters
export const getItems = (state: RootState) => state.ui.items
export const getProjects = (state: RootState) => state.ui.projects
export const getAreProjectsLoading = (state: RootState) => state.ui.loadingProjects
