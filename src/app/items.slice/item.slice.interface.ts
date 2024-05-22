import { ItemV2 } from "../supabaseClient";

export interface ItemsState {
    itemsV2: ItemV2[],
    
    // The paragraph ids which are loading
    loadingItems: string[]
}