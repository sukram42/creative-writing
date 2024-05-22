
import "./paragraph.component.scss"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { ItemSideComponent } from "../../itemSide/item-side.component";
import { ItemProps } from "../item/item.interface";
import { ItemV2 } from "../../../app/supabaseClient";
import { deleteItemAsyncV2, updateItemTextV2Async } from "../../../app/items.slice/item.slice.async";


export function Paragraph(props: ItemProps) {

    const dispatch = useDispatch<AppDispatch>()

    const commitChange = (item: ItemV2, type: "outline" | "final", newText: string) => {
        if (type == "outline" && item[[type]].length > 20) {
            console.log("mistralling!")
            // dispatch(mistralCompletion({ paragraph: props.item, project_id: activeProjectId! }))
        }
        dispatch(updateItemTextV2Async({ item: props.item, newText, field: type }))
    }

    const regenerate = (type: "outline" | "final") => {
        if (type == "final") {
            console.log("mistralling")
        }
    }

    const onDelete = () => {
        dispatch(deleteItemAsyncV2(props.item))
    }

    return (
        <div >
            <div className="chapterComponent">
                <div>
                    <div className="doubleSide">
                        <ItemSideComponent
                            item={props.item}
                            final={false}
                            onChange={() => { }}
                            onCommitChange={(item: ItemV2, newText: string) => { commitChange(item, "outline", newText); }}
                            onNewItem={() => { }}
                            onDelete={onDelete}
                            loading={false} />

                        <ItemSideComponent
                            item={props.item}
                            final={true}
                            onRegenerate={() => regenerate("final")}
                            onCommitChange={(item: ItemV2, newText: string) => { commitChange(item, "final", newText); }}
                            onNewItem={() => { }}
                            onChange={() => { }}
                            onDelete={onDelete}
                            loading={false} />
                    </div>
                </div>
            </div>
        </div>
    )
}