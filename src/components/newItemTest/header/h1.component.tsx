
import "./h1.component.scss"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { ItemProps } from "../item/item.interface";
import { updateItemTextV2Async } from "../../../app/items.slice/item.slice.async";
import { MoveableObject } from "../../moveable-object/moveable-object.component";
import { Input } from "antd";
import { updateItemTextV2 } from "../../../app/items.slice/item.slice";


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


    return (
        <div >
            <div className="chapterComponent">
                <div>
                    <div className="doubleSide">
                        <MoveableObject type={"Chapter"}
                            onDelete={() => props.onDelete(props.item)}>
                            <Input
                                size="small"
                                placeholder="Chapter Title"
                                className="chapterTitle"
                                value={props.item.outline || ""}
                                variant="borderless"
                                onChange={(e) => updateTitle(e.target.value)}
                                onBlur={(e) => updateTitleAsync(e.target.value)}
                            />
                        </MoveableObject>
                        <MoveableObject
                            type={"Chapter"}
                            onDelete={() => props.onDelete(props.item)}>
                            <Input
                                size="small"
                                placeholder="Chapter Title"
                                className="chapterTitle"
                                value={props.item.outline || ""}
                                variant="borderless"
                                onChange={(e) => updateTitle(e.target.value)}
                                onBlur={(e) => updateTitleAsync(e.target.value)}
                            // onChange={(e) => onLocalTitleChange(e.target.value)}
                            />
                        </MoveableObject>
                    </div>
                </div>
            </div>
        </div>
    )
}