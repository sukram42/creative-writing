import { Chapter, Item, Project } from "../supabaseClient";

export interface UiState {
    count: number,
    projects: Project[]
    activeProject: string | null,
    loadingProjects: boolean,
    chapters: Chapter[]
    items: Record<string, Item[]>
}