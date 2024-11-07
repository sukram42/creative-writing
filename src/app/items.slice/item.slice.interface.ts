import { ItemV2, ItemVersion } from "../supabaseClient";

export interface ItemsState {
    itemsV2: ItemV2[],

    // The paragraph ids which are loading
    loadingItems: string[]

    // The paragraphs with an error on generation <paragraph id> : Message Code
    errorItems: Record<string, string>
    
    // What side are we currently editing?
    activeFocusSide: "outline" | "final" | null
    activeFocusIndex: number | null
 
    // history
    itemVersions: Record<string, ItemVersion[]>
}