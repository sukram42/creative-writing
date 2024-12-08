
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
import { getViews } from "../../../app/ui.slice/ui.slice.selectors";
import { Views } from "../../../app/ui.slice/view.states";
import { handleKeyDownInEditor } from "../../../services/keymap.service";


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

    const onKeyDown = (e: KeyboardEvent, view: Views) => {
        console.log("h1    ", view, props.index)
        if (e.key === "Backspace" && props.item.outline === "") {
            dispatch(updateItemTypeAsync({
                newType: "PARAGRAPH",
                item: props.item
            }))
            dispatch(setActiveFocus({ side: view, index: props.index! }))
            e.preventDefault();
        }
        handleKeyDownInEditor(e, props.index, props.item, view)

    }

    const refs = {
        idea: useRef<InputRef>(null),
        outline: useRef<InputRef>(null),
        final: useRef<InputRef>(null)
    }

    useEffect(() => {
        if (activeFocusSide === "idea" && props.index == activeFocusIndex) {
            if (refs.idea.current) {
                refs.idea.current.focus();
                dispatch(setActiveFocusIndex(null))
            }
        }
        if (activeFocusSide === "outline" && props.index == activeFocusIndex) {
            if (refs.outline.current) {
                refs.outline.current.focus();
                dispatch(setActiveFocusIndex(null))
            }
        }
        if (activeFocusSide === "final" && props.index == activeFocusIndex) {
            if (refs.final.current) {
                refs.final.current.focus();
                dispatch(setActiveFocusIndex(null))
            }
        }
    }, [activeFocusSide, activeFocusIndex])

    const views = useSelector(getViews)

    return (
        <div id={props.item.item_id}>
            <div className={"chapterComponent " + (props.className || "") + " h1Item"}>
                <div>
                    <div className={"itemSide " + (views.length == 1 ? "singleSide" : "doubleSide")}>
                        {views.map((view) =>
                            <MoveableObject
                                key={"h1" + view}
                                index={props.index}
                                item={props.item}
                                view={view}>
                                <Input
                                    ref={refs[view]}
                                    size="small"
                                    placeholder="Chapter Title"
                                    className="chapterTitle"
                                    value={props.item.outline || ""}
                                    variant="borderless"
                                    onChange={(e) => updateTitle(e.target.value)}
                                    onBlur={(e) => updateTitleAsync(e.target.value)}
                                    onFocus={() => dispatch(setActiveFocus({ side: view, index: null }))}
                                    onKeyDown={(e) => onKeyDown(e, view)}
                                />
                            </MoveableObject>)}
                    </div>
                </div>
            </div>
        </div >
    )
}