import { Item } from "../../app/supabaseClient";
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
    onNewItem: () => void
}

export function ItemsComponent(props: ItemsComponentProps) {
    const dispatch = useDispatch<AppDispatch>()

    const [wasChanged, setWasChanged] = useState(false)

    const onTextChange = (newText: string, final: boolean) => {
        if (wasChanged) {

            if (!final && newText.length > 20) {
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
            type={props.item.type + "" || "Paragraph"}
            onDelete={() => dispatch(deleteItem(props.item))}
            onRedo={() => dispatch(testEdgeFunctions({ paragraph: props.item.item_id }))}
            showRedo
        >
            {/* 
            // @ts-ignore */}
            <ReactQuill theme={null}
                value={content || ""}
                onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "Enter") {
                        onTextChange(e.getHTML(), props.final)
                        props.onNewItem()
                    }
                }
                }
                // onBlur={(_0, _1, c) => onTextChange(c.getHTML(), props.final)}
                onBlur={(range, source, editor) => {
                    setTimeout(() => {
                        let fixRange = editor.getSelection()
                        if (fixRange) {
                            // paste event or none real blur event
                            console.log('fake blur')
                        } else {
                            onTextChange(editor.getHTML(), props.final)
                        }
                    }, 2) // random time
                }}
                placeholder={props.item.item_id}
                onChange={(val) => onLocalTextChange(val, props.final, props.item)}
            ></ReactQuill>
        </MoveableObject >
    </>
}