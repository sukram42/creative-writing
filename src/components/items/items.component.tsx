import { Input } from "antd";
import { Item } from "../../app/supabaseClient";
import TextArea from "antd/es/input/TextArea";
import { MoveableObject } from "../moveable-object/moveable-object.component";

interface ItemsComponentProps {
    item: Item
}

export function ItemsComponent(props: ItemsComponentProps) {

    return <>
    {/* <TextArea variant="borderless" placeholder="Autosize height based on content lines" autoSize /> */}
    <MoveableObject type={props.item.type}>
    <TextArea
        autoSize
        size="small"
        placeholder="Chapter Title"
        value={props.item.outline || ""}
        variant="borderless"
    /></MoveableObject>
    </>
}