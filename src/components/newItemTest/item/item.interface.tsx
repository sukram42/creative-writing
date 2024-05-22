import { ItemV2 } from "../../../app/supabaseClient";


export interface ItemProps {
    item: ItemV2,
    onDelete: () => {}
    onUpdate: (item: ItemV2) => {}
    onCommitChange: (item: ItemV2) => {}
}