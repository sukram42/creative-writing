import { Item } from "../../app/supabaseClient";
import { MoveableObject } from "../moveable-object/moveable-object.component";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { deleteItem, testEdgeFunctions, upsertItemText } from "../../app/ui.slice/ui.slice.async";
import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.core.css';

import './items.component.scss'
import { updateItemText } from "../../app/ui.slice/ui.slice";
import { loadingFinalTexts } from "../../app/ui.slice/ui.slice.selectors";

interface ItemsComponentProps {
    item: Item,
    final: boolean
    onNewItem: () => void
}

export function ItemsComponent(props: ItemsComponentProps) {
    const dispatch = useDispatch<AppDispatch>()

    const [wasChanged, setWasChanged] = useState(false)

    const paragraphsLoading = useSelector(loadingFinalTexts)

    const onTextChange = (newText: string, final: boolean) => {
        if (wasChanged) {

            if (!final && newText.length > 20) {
                dispatch(testEdgeFunctions({ paragraph: props.item }))
            }
            dispatch(upsertItemText({ itemId: props.item.item_id + "", newText, field: final ? "final" : "outline" }))
            setWasChanged(false)
        }
    }
    const onLocalTextChange = (newText: string, final: boolean, item: Item) => {
        if (newText !== content) {
            setWasChanged(true)
            dispatch(updateItemText({ item, newText: newText, field: final ? "final" : "outline" }))
        }
    }

    const content = props.final ? props.item.final : props.item.outline
    return <>
        <MoveableObject
            type={props.item.type + "" || "Paragraph"}
            onDelete={() => dispatch(deleteItem(props.item))}
            onRedo={() => dispatch(testEdgeFunctions({ paragraph: props.item }))}
            showRedo
            loading={props.final && new Set(paragraphsLoading).has(props.item.item_id)}   
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
                onBlur={(_0,_1, editor) => {
                    setTimeout(() => {
                        let fixRange = editor.getSelection()
                        if (fixRange) {} else {
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