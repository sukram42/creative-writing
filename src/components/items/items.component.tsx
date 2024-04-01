import { Input } from "antd";
import { Item } from "../../app/supabaseClient";
import TextArea from "antd/es/input/TextArea";
import { MoveableObject } from "../moveable-object/moveable-object.component";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { upsertItemText } from "../../app/ui.slice/ui.slice.async";
import { locallyUpdateItemText } from "../../app/ui.slice/ui.slice";

interface ItemsComponentProps {
    item: Item,
    final: boolean
}

export function ItemsComponent(props: ItemsComponentProps) {
    const dispatch = useDispatch<AppDispatch>()

    const onTextChange = (newText: string, final: boolean) => {
        dispatch(upsertItemText({ itemId: props.item.item_id+"", newText, field: final ? "final" : "outline" }))
    }
    const onLocalTextChange = (newText: string, final: boolean, item: Item) => {
        dispatch(locallyUpdateItemText({item, newText: newText, field:final?"final":"outline"}))
    }

    const content = props.final ? props.item.final : props.item.outline
    return <>
        <MoveableObject type={props.item.type || "1"}>
            <TextArea
                autoSize
                size="small"
                placeholder={props.item.item_id}
                value={content || ""}
                variant="borderless"
                onBlur={(e) => onTextChange(e.target.value, props.final)}
                onChange={(e)=>onLocalTextChange(e.target.value, props.final, props.item)}
            /></MoveableObject>
    </>
}