
import "./paragraph.component.scss"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { ItemSideComponent } from "../../item-side/item-side.component";
import { ItemProps } from "../item/item.interface";
import { ItemType, ItemV2 } from "../../../app/supabaseClient";
import { createNewItem, updateItemTextV2Async } from "../../../app/items.slice/item.slice.async";
import { updateItemTextV2 } from "../../../app/items.slice/item.slice";
import { outline2textCompletion } from "../../../app/ai.slice/ai.slice.async";
import { getActiveFocusIndex, getActiveFocusSide, getErrorItems, getItemCount, getLoadingItems } from "../../../app/items.slice/item.slice.selectors";
import { getViews } from "../../../app/ui.slice/ui.slice.selectors";
import { Idea } from "../../idea/idea.component";


export function Paragraph(props: ItemProps) {

    const dispatch = useDispatch<AppDispatch>()

    const itemCount = useSelector(getItemCount)
    const loadingItems = new Set(useSelector(getLoadingItems))
    const error = useSelector(getErrorItems);
    const hasError = Object.keys(error).includes(props.item.item_id);
    const errorCode = hasError ? error[props.item.item_id] : undefined;

    const commitChange = (item: ItemV2, type: "outline" | "final" | "idea", newText: string) => {
        // TODO check the indexing here
        if (type == "outline" && (item[type] || "").length > 20 && !props.item.locked) {
            dispatch(outline2textCompletion({ paragraph: props.item, project_id: props.item.project_id! }))
        }
        dispatch(updateItemTextV2Async({ item: props.item, newText, field: type }))
    }

    const changeText = (item: ItemV2, type: "outline" | "final" | "idea", newText: string) => {
        dispatch(updateItemTextV2({ item, newText, field: type }))
    }

    const regenerate = (type: "outline" | "final") => {
        if (type == "final") {
            dispatch(outline2textCompletion({ paragraph: props.item, project_id: props.item.project_id! }))
        }
    }
    const activeFocusSide = useSelector(getActiveFocusSide)
    const activeFocusIndex = useSelector(getActiveFocusIndex)
    const views = useSelector(getViews)

    return (
        <div id={props.item.item_id} >
            <div className={"chapterComponent " + (props.className || "")}>
                <div>
                    <div className={"itemSide " + (views.length == 1 ? "singleSide" : "doubleSide")}>
                        {views.includes("idea") &&
                            <Idea
                                autofocus={activeFocusSide === "idea" && props.index == activeFocusIndex}
                                forcePlaceholder={itemCount === 1}
                                placeholder="Explain what this column is for."
                                item={props.item}
                                onCommitChange={(item: ItemV2, newText: string) => { commitChange(item, "idea", newText); }}
                                onChange={(item: ItemV2, newText: string) => { changeText(item, "idea", newText); }}
                                index={props.index!}
                                loading={false} />
                        }
                        {views.includes("outline") &&
                            <ItemSideComponent
                                forcePlaceholder={itemCount === 1}
                                autofocus={activeFocusSide === "outline" && props.index == activeFocusIndex}
                                placeholder={`- Here comes your paragraph outline in bullets`}
                                item={props.item}
                                view="outline"
                                onCommitChange={(item: ItemV2, newText: string) => { commitChange(item, "outline", newText); }}
                                onChange={(item: ItemV2, newText: string) => { changeText(item, "outline", newText); }}
                                index={props.index!}
                                loading={false} />}
                    {views.includes("final") &&
                            <ItemSideComponent
                                forcePlaceholder={itemCount === 1}
                                autofocus={activeFocusSide === "final" && props.index == activeFocusIndex}
                                placeholder="As soon as you added the outline on the right, a paragraph will appear."
                                item={props.item}
                                view="final"
                                locked={true || props.item.locked}
                                onRegenerate={() => regenerate("final")}
                                onCommitChange={(item: ItemV2, newText: string) => { commitChange(item, "final", newText); }}
                                onChange={(item: ItemV2, newText: string) => { changeText(item, "final", newText); }}
                                error={errorCode}
                                loading={loadingItems.has(props.item.item_id)}
                                index={props.index!} />}
                    </div>
                </div>
            </div>
        </div >
    )
}