import { User } from "@supabase/supabase-js";
import { Chapter, Item, ItemV2, Profile, Project } from "../supabaseClient";

export interface UiState {
    count: number,
    projects: Project[]
    activeProjectId: string | null,
    activeProject: Project | null,
    loadingProjects: boolean,

    documentDrawerOpen: boolean,
    rawDrawerOpen: boolean,

    showSidebar: boolean,

    loadProject: boolean,
    chapters: Chapter[],
    items: Record<string, Item[]>

    itemsV2: ItemV2[],

    user?: User;
    profile?: Profile;

    // The paragraph ids which are loading
    loadingFinalTexts: string[]

}