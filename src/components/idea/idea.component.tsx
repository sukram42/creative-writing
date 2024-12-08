import ReactQuill from "react-quill";
import { setActiveFocus, setActiveFocusIndex } from "../../app/items.slice/item.slice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../app/store";
import { ItemV2, ItemType } from "../../app/supabaseClient";
import { createNewItem, deleteItemAsyncV2, updateItemTypeAsync } from "../../app/items.slice/item.slice.async";
import { getActiveFocusSide, getActiveFocusIndex } from "../../app/items.slice/item.slice.selectors";
import { MoveableObject } from "../moveable-object/moveable-object.component";
import { handleKeyDownInEditor } from "../../services/keymap.service";


interface IdeaComponentProps {
    item: ItemV2,
    onChange: (item: ItemV2, newText: string) => void
    onCommitChange: (item: ItemV2, newText: string) => void
    loading: boolean
    error?: string
    placeholder?: string

    autofocus: boolean
    index: number
    locked?: boolean
}

export function Idea(props: IdeaComponentProps) {

    const dispatch = useDispatch<AppDispatch>()
    const editorRef = useRef<ReactQuill | null>(null);

    const [wasChanged, setWasChanged] = useState(false)
    const [active, setActive] = useState(false)

    const onTextChange = (newText: string) => {
        if (!wasChanged) return
        props.onCommitChange(props.item, newText)
        setWasChanged(false)
    }

    const onLocalTextChange = (newText: string) => {
        if (newText !== props.item.idea) {
            props.onChange({ ...props.item, idea: newText }, newText)
        }
        if (newText === "<p># </p>") {
            dispatch(updateItemTypeAsync({
                newType: "H1",
                item: { ...props.item, outline: "" }
            }))
            dispatch(setActiveFocus({ side: "idea", index: props.index }))
        }
        setWasChanged(true)
    }

    const activeFocusSide = useSelector(getActiveFocusSide)
    const activeFocusIndex = useSelector(getActiveFocusIndex)

    useEffect(() => {
        if (props.autofocus) {
            if (editorRef.current) {
                editorRef.current.focus();
                dispatch(setActiveFocusIndex(null))
            }
        }
    }, [activeFocusSide, activeFocusIndex])

    return <div className={"itemSideComponent"}>
        <MoveableObject
            index={props.index}
            item={props.item}
            view="idea"
        >
            <ReactQuill theme={null}
                className={"quill-editor " + (!!props.error ? "error-state" : "")}
                ref={editorRef}
                value={props.item.idea || ""}
                onFocus={() => {
                    setActive(true);
                }}
                onKeyDown={(e) => {
                    if (e.ctrlKey && e.key === "Enter") {
                        e.preventDefault()
                        onTextChange(e.target.getHTML())
                    }
                    handleKeyDownInEditor(e, props.index, props.item, "idea")
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
            ></ReactQuill></MoveableObject></div>
}