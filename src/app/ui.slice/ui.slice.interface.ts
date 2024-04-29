import { Chapter, Item, Project } from "../supabaseClient";

export interface UiState {
    count: number,
    projects: Project[]
    activeProjectId: string | null,
    activeProject: Project,
    loadingProjects: boolean,

    loadChapters: boolean,
    chapters: Chapter[],
    items: Record<string, Item[]>

    // The paragraph ids which are loading
    loadingFinalTexts: string[]
}