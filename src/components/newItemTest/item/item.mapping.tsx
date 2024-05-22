import { ReactElement } from "react";
import { Paragraph } from "../paragraph/paragraph.component";
import { ItemProps } from "./item.interface";
import { ItemV2 } from "../../../app/supabaseClient";

export const ItemMapping: Record<string, (props: ItemProps) => ReactElement> = {
    "PARAGRAPH": (item)=><Paragraph item={item} />
}