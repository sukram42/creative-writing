import { ItemV2 } from "../../app/supabaseClient";
import { MoveableObject } from "../moveable-object/moveable-object.component";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.core.css';

import './item-side.component.scss'
import { useDispatch } from "react-redux";
import { setActiveEditingSide, updateItemType } from "../../app/items.slice/item.slice";
import { updateItemTypeAsync } from "../../app/items.slice/item.slice.async";
import { AppDispatch } from "../../app/store";

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

    autofocus: boolean
}

export function ItemSideComponent(props: ItemsComponentProps) {

    const [wasChanged, setWasChanged] = useState(false)
    const [active, setActive] = useState(false)

    const dispatch = useDispatch<AppDispatch>()
    const editorRef = useRef<ReactQuill | null>(null); useRef()


    const onTextChange = (newText: string) => {

        if (!wasChanged) return
        props.onCommitChange(props.item, newText)
        setWasChanged(false)
    }

    const onLocalTextChange = (newText: string, final: boolean) => {
        if (newText !== content) {
            props.onChange({ ...props.item, [final ? "final" : "outline"]: newText }, newText)
        }

        if (newText === "<p># </p>") {
            dispatch(updateItemTypeAsync({
                newType: "H1",
                item: { ...props.item, outline: "" }
            }))
        }
        setWasChanged(true)
    }
    useEffect(() => {

        if (props.autofocus) {
            if (editorRef.current) editorRef.current.focus();
        }
    }, [props.autofocus])

    useEffect(() => {
        if (editorRef.current) editorRef.current.getEditor().root.dataset.placeholder = active ? props.placeholder : "";

    }, [editorRef, active]);

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
                autofocus={props.autofocus}

                onEditorCreated={() => alert('Editor created!')}
                ref={editorRef}
                value={content || ""}
                onFocus={() => {
                    setActive(true);
                    dispatch(setActiveEditingSide(props.final ? "final" : "outline"))
                }}
                onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "Enter") {
                        onTextChange(e.getHTML())
                        props.onNewItem()
                    }
                }}
                onBlur={(_0, _1, editor) => {
                    setTimeout(() => {
                        let fixRange = editor.getSelection()
                        if (fixRange) { } else {
                            onTextChange(editor.getHTML())
                            setActive(false)
                        }
                    }, 2)
                }}
                placeholder={active ? props.item.item_id : ""}
                onChange={(val) => onLocalTextChange(val, props.final)}
            ></ReactQuill>
        </MoveableObject >
    </>
}