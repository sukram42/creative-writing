import { ItemV2 } from "../../app/supabaseClient";
import { MoveableObject } from "../moveable-object/moveable-object.component";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.core.css';

import './item-side.component.scss'

interface ItemsComponentProps {
    item: ItemV2,
    final: boolean
    onNewItem: () => void

    onChange: (item: ItemV2, newText: string) => void
    onCommitChange: (item: ItemV2, newText: string) => void
    onDelete: (item: ItemV2) => void

    onRegenerate?: (item: ItemV2) => void

    loading: boolean
    placeholder?: string
}

export function ItemSideComponent(props: ItemsComponentProps) {

    const [wasChanged, setWasChanged] = useState(false)
    const [active, setActive] = useState(false)

    const editor = useRef<ReactQuill | null>(null); useRef()

    const onTextChange = (newText: string) => {
        if (!wasChanged) return
        props.onCommitChange(props.item, newText)
        setWasChanged(false)
    }

    const onLocalTextChange = (newText: string, final: boolean) => {
        if (newText !== content) {
            props.onChange({ ...props.item, [final ? "final" : "outline"]: newText }, newText)
        }
        setWasChanged(true)
    }

    useEffect(() => {
        if (editor.current) editor.current.getEditor().root.dataset.placeholder = active ? props.placeholder : "";
    }, [editor, active]);

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
                ref={editor}
                value={content || ""}
                onFocus={() => setActive(true)}

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
                            setActive(false)
                        }
                    }, 2)
                }}
                placeholder={active ? props.item.item_id : "s"}
                onChange={(val) => onLocalTextChange(val, props.final)}
            ></ReactQuill>
        </MoveableObject >
    </>
}