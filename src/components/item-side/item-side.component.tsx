import { ItemType, ItemV2 } from "../../app/supabaseClient";
import { MoveableObject } from "../moveable-object/moveable-object.component";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.core.css';

import './item-side.component.scss'
import { useDispatch, useSelector } from "react-redux";
import { setActiveFocus, setActiveFocusIndex } from "../../app/items.slice/item.slice";
import { createNewItem, deleteItemAsyncV2, updateItemLocked, updateItemTypeAsync } from "../../app/items.slice/item.slice.async";
import { AppDispatch } from "../../app/store";
import { getActiveFocusSide, getActiveFocusIndex } from "../../app/items.slice/item.slice.selectors";
import { ItemQAPopup } from "../item-qa-popup/item-qa-popup.component";
import { StepsType, Views } from "../../app/ui.slice/view.states";
import { handleKeyDownInEditor } from "../../services/keymap.service";

interface ItemsComponentProps {
    item: ItemV2,
    view: Views

    onChange: (item: ItemV2, newText: string) => void
    onCommitChange: (item: ItemV2, newText: string) => void

    onRegenerate?: (item: ItemV2) => void

    loading: boolean
    error?: string
    placeholder?: string

    autofocus: boolean
    index: number
    locked?: boolean
}

export function ItemSideComponent(props: ItemsComponentProps) {

    const [wasChanged, setWasChanged] = useState(false)
    const [active, setActive] = useState(false)
    const [isQAPopup, showQAPopup] = useState(false)

    const dispatch = useDispatch<AppDispatch>()
    const editorRef = useRef<ReactQuill | null>(null);

    const activeFocusSide = useSelector(getActiveFocusSide)
    const activeFocusIndex = useSelector(getActiveFocusIndex)


    const onTextChange = (newText: string) => {

        if (!wasChanged) return
        props.onCommitChange(props.item, newText)
        setWasChanged(false)
    }

    const onLocalTextChange = (newText: string) => {
        if (newText !== content) {
            props.onChange({ ...props.item, [props.view]: newText }, newText)
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

    const content = props.item[props.view]
    return <div className={"itemSideComponent " + (props.locked ? "locked" : "")}>
        <MoveableObject
            error={props.error}
            view={props.view}
            index={props.index}
            item={props.item}
            onRedo={() => props.onRegenerate && props.onRegenerate(props.item)}
            showRedo={!!props.onRegenerate}
            loading={props.loading}
            locked={props.view == "final" && props.item.locked}
            showLocked={props.view == "final"}
            onToggleLock={() => dispatch(updateItemLocked({ item: props.item, newLocked: !props.item.locked }))}
            showQA={() => showQAPopup(true)}
        >
            <ItemQAPopup
                show={isQAPopup}
                item={props.item}
                onLocalTextChange={onLocalTextChange}
                view={props.view}
                onOpenChange={(val) => showQAPopup(val)} >
                {/*// @ts-ignore */}
                <ReactQuill theme={null}
                    className={"quill-editor " + (!!props.error ? "error-state" : "")}
                    onEditorCreated={() => alert('Editor created!')}
                    ref={editorRef}
                    value={content || ""}
                    onFocus={() => {
                        setActive(true);
                    }}
                    onKeyDown={(e) => {
                        // if (e.ctrlKey && e.key === "Enter") {
                        //     e.preventDefault()
                        //     onTextChange(e.target.getHTML())
                        // }
                        console.log("keydown", e, props.index, props.item, props.view)
                        handleKeyDownInEditor(e, props.index, props.item, props.view)

                    }}
                    onBlur={(_0, _1, editor) => {
                        dispatch(setActiveFocus({ side: null, index: null }))

                        setTimeout(() => {
                            let fixRange = editor.getSelection()
                            if (fixRange) { } else {
                                onTextChange(editor.getHTML())
                                setActive(false)
                            }
                        }, 2)
                    }}
                    placeholder={active ? props.item.item_id : ""}
                    onChange={(val) => onLocalTextChange(val)}
                ></ReactQuill>
            </ItemQAPopup>
        </MoveableObject >
    </div>
}