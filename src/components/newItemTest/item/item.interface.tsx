import { ItemV2 } from "../../../app/supabaseClient";


export interface ItemProps {
    item: ItemV2,
    onDelete: (item: ItemV2) => void,
    index?: number,
    onNew?: (index: number) => void
}