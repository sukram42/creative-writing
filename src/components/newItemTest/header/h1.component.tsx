
import "./h1.component.scss"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { ItemProps } from "../item/item.interface";
import { updateItemTextV2Async, updateItemTypeAsync } from "../../../app/items.slice/item.slice.async";
import { MoveableObject } from "../../moveable-object/moveable-object.component";
import { Input } from "antd";
import { setActiveEditingSide, updateItemTextV2 } from "../../../app/items.slice/item.slice";
import { getActiveEditingSide } from "../../../app/items.slice/item.slice.selectors";
import { KeyboardEvent } from "react";


export function H1(props: ItemProps) {

    const dispatch = useDispatch<AppDispatch>()

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

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Backspace" && props.item.outline === "") {
            dispatch(updateItemTypeAsync({
                newType: "PARAGRAPH",
                item: props.item
            }))
            e.preventDefault();
        }
        if (e.ctrlKey && e.key === "Enter") {
            props.onNew && props.onNew(props.index! + 1)
        }
    }

    const activeEditingSide = useSelector(getActiveEditingSide)

    return (
        <div >
            <div className="chapterComponent">
                <div>
                    <div className="doubleSide">
                        <MoveableObject
                            type={"Chapter"}
                            onNew={() => props.onNew!((props.index || 0) + 1)}
                            onDelete={() => props.onDelete(props.item)}>
                            <Input
                                autoFocus={activeEditingSide === "outline"}
                                size="small"
                                placeholder="Chapter Title"
                                className="chapterTitle"
                                value={props.item.outline || ""}
                                variant="borderless"
                                onChange={(e) => updateTitle(e.target.value)}
                                onBlur={(e) => updateTitleAsync(e.target.value)}
                                onFocus={() => dispatch(setActiveEditingSide("outline"))}
                                onKeyDown={onKeyDown}
                            />
                        </MoveableObject>
                        <MoveableObject
                            onNew={() => props.onNew!((props.index || 0) + 1)}
                            type={"Chapter"}
                            onDelete={() => props.onDelete(props.item)}>
                            <Input
                                autoFocus={activeEditingSide === "final"}
                                size="small"
                                placeholder="Chapter Title"
                                className="chapterTitle"
                                value={props.item.outline || ""}
                                variant="borderless"
                                onFocus={() => dispatch(setActiveEditingSide("final"))}
                                onChange={(e) => updateTitle(e.target.value)}
                                onBlur={(e) => updateTitleAsync(e.target.value)}
                                onKeyDown={onKeyDown}
                            />
                        </MoveableObject>
                    </div>
                </div>
            </div>
        </div >
    )
}