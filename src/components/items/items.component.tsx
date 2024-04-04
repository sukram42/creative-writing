import { Input } from "antd";
import { Item } from "../../app/supabaseClient";
import TextArea from "antd/es/input/TextArea";
import { MoveableObject } from "../moveable-object/moveable-object.component";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { deleteItem, testEdgeFunctions, upsertItemText } from "../../app/ui.slice/ui.slice.async";
import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.core.css';
import { locallyUpdateItemText } from "../../app/ui.slice/ui.slice";

import './items.component.scss'

interface ItemsComponentProps {
    item: Item,
    final: boolean
    onNewItem: () => {}
}

export function ItemsComponent(props: ItemsComponentProps) {
    const dispatch = useDispatch<AppDispatch>()

    const [wasChanged, setWasChanged] = useState(false)

    const onTextChange = (newText: string, final: boolean) => { 
        if (wasChanged) {
            if (!final && newText.length > 10) {
                dispatch(testEdgeFunctions({ paragraph: props.item.item_id }))
            }
            dispatch(upsertItemText({ itemId: props.item.item_id + "", newText, field: final ? "final" : "outline" }))
            setWasChanged(false)
        }
    }
    const onLocalTextChange = (newText: string, final: boolean, item: Item) => {
        if (newText !== content) {
            setWasChanged(true)
            dispatch(locallyUpdateItemText({ item, newText: newText, field: final ? "final" : "outline" }))
        }
    }

    const content = props.final ? props.item.final : props.item.outline
    return <>
        <MoveableObject
            type={props.item.type || "Paragraph"}
            onDelete={()=>dispatch(deleteItem(props.item))}
            onRedo={()=>dispatch(testEdgeFunctions({ paragraph: props.item.item_id }))}
            showRedo
        >
            {/* <TextAread
                autoSize
                size="small"
                placeholder={props.item.item_id}
                value={content || ""}
                variant="borderless"
                onBlur={(e) => onTextChange(e.target.value, props.final)}
                onChange={(e) => onLocalTextChange(e.target.value, props.final, props.item)} */}
            <ReactQuill theme={null}
                value={content || ""}
                onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "Enter") {
                        onTextChange(e.getHTML(), props.final)
                        props.onNewItem()
                    }
                }
                }
                onBlur = {(a, b, e) => onTextChange(e.getHTML(), props.final)}
                // onBlur={(e, b, c) => console.log(e, b, c)}
                placeholder={props.item.item_id}
                onChange={(val) => onLocalTextChange(val, props.final, props.item)}></ReactQuill>
        </MoveableObject >
    </>
}