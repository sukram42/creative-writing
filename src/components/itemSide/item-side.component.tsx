import { ItemV2 } from "../../app/supabaseClient";
import { MoveableObject } from "../moveable-object/moveable-object.component";
import { useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.core.css';

import './item-side.component.scss'

interface ItemsComponentProps {
    item: ItemV2,
    final: boolean
    onNewItem: () => void

    onChange: (item: ItemV2) => void
    onCommitChange: (item: ItemV2, newText: string) => void
    onDelete: (item: ItemV2) => void

    onRegenerate?: (item: ItemV2) => void

    loading: boolean
}

export function ItemSideComponent(props: ItemsComponentProps) {

    const [wasChanged, setWasChanged] = useState(false)

    const onTextChange = (newText: string) => {
        if (!wasChanged) return
        props.onCommitChange(props.item, newText)
        setWasChanged(false)
    }
    const onLocalTextChange = (newText: string, final: boolean) => {
        if (newText !== content) {
            setWasChanged(true)
            // dispatch(updateItemText({ item, newText: newText, field: final ? "final" : "outline" }))
            props.onChange({ ...props.item, [final ? "final" : "outline"]: newText })
        }
    }

    const content = props.final ? props.item.final : props.item.outline

    return <>
        <MoveableObject
            type={"Paragraph"}
            onDelete={() => props.onDelete(props.item)}
            onRedo={() => props.onRegenerate && props.onRegenerate(props.item)}
            showRedo={!!props.onRegenerate}
            loading={props.loading}
        >
            {/*
            // @ts-ignore */}
            <ReactQuill theme={null}
                value={content || ""}
                onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "Enter") {
                        onTextChange(e.getHTML())
                        props.onNewItem()
                    }
                }
                }
                onBlur={(_0, _1, editor) => {
                    setTimeout(() => {
                        let fixRange = editor.getSelection()
                        if (fixRange) { } else {
                            onTextChange(editor.getHTML())
                        }
                    }, 2)
                }}
                placeholder={props.item.item_id}
                onChange={(val) => onLocalTextChange(val, props.final)}
            ></ReactQuill>
        </MoveableObject >
    </>
}