import { Chapter, Item } from "../supabaseClient";

export interface UiState {
    count: number, 
    
    activeProject: string,
    chapters: Chapter[]
    items: Record<string, Item[]>
}