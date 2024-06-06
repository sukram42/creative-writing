import { ItemV2 } from "../../app/supabaseClient";
import { MoveableObject } from "../moveable-object/moveable-object.component";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.core.css';

import './item-side.component.scss'
import { useDispatch, useSelector } from "react-redux";
import { setActiveFocus, setActiveFocusIndex } from "../../app/items.slice/item.slice";
import { updateItemLocked, updateItemTypeAsync } from "../../app/items.slice/item.slice.async";
import { AppDispatch } from "../../app/store";
import { getActiveFocusSide, getActiveFocusIndex } from "../../app/items.slice/item.slice.selectors";

interface ItemsComponentProps {
    item: ItemV2,
    final: boolean
    onNewItem: (index: number) => void

    onChange: (item: ItemV2, newText: string) => void
    onCommitChange: (item: ItemV2, newText: string) => void
    onDelete: (item: ItemV2) => void

    onRegenerate?: (item: ItemV2) => void

    loading: boolean
    placeholder?: string

    autofocus: boolean
    index: number
    locked?: boolean
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

    const activeFocusSide = useSelector(getActiveFocusSide)
    const activeFocusIndex = useSelector(getActiveFocusIndex)


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
        dispatch(setActiveFocusIndex(props.index!))

    }
    useEffect(() => {
        if (props.autofocus) {
            if (editorRef.current) {
                editorRef.current.focus();
                dispatch(setActiveFocusIndex(null))
            }
        }
    }, [activeFocusSide, activeFocusIndex])

    useEffect(() => {
        if (editorRef.current) editorRef.current.getEditor().root.dataset.placeholder = active ? props.placeholder : "";

    }, [editorRef, active]);

    const content = props.final ? props.item.final : props.item.outline
    return <div className={"itemSideComponent " + (props.locked ? "locked" : "")}>
        <MoveableObject
            type={"Paragraph"}
            onDelete={() => props.onDelete(props.item)}
            onRedo={() => props.onRegenerate && props.onRegenerate(props.item)}
            showRedo={!!props.onRegenerate}
            loading={props.loading}
            onNew={() => props.onNewItem(props.index + 1)}
            locked={props.final && props.item.locked}
            showLocked={props.final}
            onToggleLock={() => dispatch(updateItemLocked({ item: props.item, newLocked: !props.item.locked }))}
        >
            {/*
            // @ts-ignore */}
            <ReactQuill theme={null}
                className={"quill-editor "}
                autofocus={props.autofocus}
                onEditorCreated={() => alert('Editor created!')}
                ref={editorRef}
                value={content || ""}
                onFocus={() => {
                    setActive(true);
                }}
                onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "Enter") {
                        onTextChange(e.target.getInnerHTML())
                        props.onNewItem(props.index + 1)
                        dispatch(setActiveFocusIndex(props.index! + 1))
                    }
                    if (e.ctrlKey && e.key === "Backspace" && e.target.getInnerHTML() === "<p><br></p>") {

                        props.onDelete(props.item)
                        dispatch(setActiveFocusIndex(props.index! - 1))
                    }
                    if (e.ctrlKey && e.altKey && e.key == "ArrowDown") {
                        dispatch(setActiveFocusIndex(props.index! + 1))
                    }
                    if (e.ctrlKey && e.altKey && e.key == "ArrowUp") {
                        dispatch(setActiveFocusIndex(props.index! - 1))
                    }
                    if (e.ctrlKey && e.altKey && e.key == "ArrowRight" && !props.final) {
                        dispatch(setActiveFocus({ side: "final", index: props.index! }))
                    }
                    if (e.ctrlKey && e.altKey && e.key == "ArrowLeft" && props.final) {
                        dispatch(setActiveFocus({ side: "outline", index: props.index! }))
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
    </div>
}