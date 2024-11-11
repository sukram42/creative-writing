
import "./h1.component.scss"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { ItemProps } from "../item/item.interface";
import { updateItemTextV2Async, updateItemTypeAsync } from "../../../app/items.slice/item.slice.async";
import { MoveableObject } from "../../moveable-object/moveable-object.component";
import { Input, InputRef } from "antd";
import { setActiveFocus, setActiveFocusIndex, updateItemTextV2 } from "../../../app/items.slice/item.slice";
import { getActiveFocusSide, getActiveFocusIndex } from "../../../app/items.slice/item.slice.selectors";
import { KeyboardEvent, useEffect, useRef } from "react";


export function H1(props: ItemProps) {

    const dispatch = useDispatch<AppDispatch>()

    const activeFocusSide = useSelector(getActiveFocusSide)
    const activeFocusIndex = useSelector(getActiveFocusIndex)


    const updateTitleAsync = (newTitle: string) => {
        dispatch(
            updateItemTextV2Async({
                field: "outline",
                item: props.item,
                newText: newTitle
            }))
    }
    const updateTitle = (newTitle: string) => {
        dispatch(
            updateItemTextV2({
                field: "outline",
                item: props.item,
                newText: newTitle
            }))
    }

    const onKeyDown = (e: KeyboardEvent, side: "outline" | "final") => {
        if (e.key === "Backspace" && props.item.outline === "") {
            dispatch(updateItemTypeAsync({
                newType: "PARAGRAPH",
                item: props.item
            }))
            dispatch(setActiveFocus({ side: side, index: props.index!}))
            e.preventDefault();
        }
        if (e.ctrlKey && e.key === "Enter") {
            props.onNew && props.onNew(props.index! + 1)
            dispatch(setActiveFocusIndex(props.index! + 1))
            return
        }
        if (e.ctrlKey && e.altKey && e.key == "ArrowDown") {
            dispatch(setActiveFocus({ side: side, index: props.index! + 1 }))
            return
        }
        if (e.ctrlKey && e.altKey && e.key == "ArrowUp") {
            dispatch(setActiveFocusIndex(props.index! - 1))
            dispatch(setActiveFocus({ side: side, index: props.index! - 1 }))
            return
        }
        if (e.ctrlKey && e.altKey && e.key == "ArrowRight" && side === "outline") {
            dispatch(setActiveFocus({ side: "final", index: props.index! }))
            return
        }
        if (e.ctrlKey && e.altKey && e.key == "ArrowLeft" && side === "final") {
            dispatch(setActiveFocus({ side: "outline", index: props.index! }))
            return
        }
    }

    const outlineRef = useRef<InputRef>(null)
    const finalRef = useRef<InputRef>(null)
    useEffect(() => {
        if (activeFocusSide === "outline" && props.index == activeFocusIndex) {
            if (outlineRef.current) {
                outlineRef.current.focus();
                dispatch(setActiveFocusIndex(null))
            }
        }
        if (activeFocusSide === "final" && props.index == activeFocusIndex) {
            if (finalRef.current) {
                finalRef.current.focus();
                dispatch(setActiveFocusIndex(null))
            }
        }
    }, [activeFocusSide, activeFocusIndex])


    return (
        <div id={props.item.item_id}>
            <div className={"chapterComponent " + (props.className || "")}>
                <div>
                    <div className="doubleSide">
                        <MoveableObject
                            type={"Chapter"}
                            onNew={() => props.onNew!((props.index || 0) + 1)}
                            onDelete={() => props.onDelete(props.item)}>
                            <Input
                                ref={outlineRef}
                                size="small"
                                placeholder="Chapter Title"
                                className="chapterTitle"
                                value={props.item.outline || ""}
                                variant="borderless"
                                onChange={(e) => updateTitle(e.target.value)}
                                onBlur={(e) => updateTitleAsync(e.target.value)}
                                onFocus={() => dispatch(setActiveFocus({ side: "outline", index: null }))}
                                onKeyDown={(e) => onKeyDown(e, "outline")}
                            />
                        </MoveableObject>
                        <MoveableObject
                            onNew={() => props.onNew!((props.index || 0) + 1)}
                            type={"Chapter"}
                            onDelete={() => props.onDelete(props.item)}>
                            <Input
                                ref={finalRef}
                                size="small"
                                placeholder="Chapter Title"
                                className="chapterTitle"
                                value={props.item.outline || ""}
                                variant="borderless"
                                onFocus={() => dispatch(setActiveFocus({ side: "final", index: null }))}
                                onChange={(e) => updateTitle(e.target.value)}
                                onBlur={(e) => updateTitleAsync(e.target.value)}
                                onKeyDown={(e) => onKeyDown(e, "final")}
                            />
                        </MoveableObject>
                    </div>
                </div>
            </div>
        </div >
    )
}