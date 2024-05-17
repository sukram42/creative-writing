import { User } from "@supabase/supabase-js";
import { Chapter, Item, Profile, Project } from "../supabaseClient";

export interface UiState {
    count: number,
    projects: Project[]
    activeProjectId: string | null,
    activeProject: Project | null,
    loadingProjects: boolean,

    loadChapters: boolean,
    chapters: Chapter[],
    items: Record<string, Item[]>

    user?: User;
    profile?: Profile;


    // The paragraph ids which are loading
    loadingFinalTexts: string[]
}