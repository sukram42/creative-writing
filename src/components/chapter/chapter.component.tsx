import { Input } from "antd";
import { Chapter, Item } from "../../app/supabaseClient";
import { MoveableObject } from "../moveable-object/moveable-object.component";

import "./chapter.component.scss"
import { useDispatch } from "react-redux";
import { deleteChapter, upsertChapterTitle, upsertNewItem } from "../../app/ui.slice/ui.slice.async";
import { locallyUpdateChapterTitle } from "../../app/ui.slice/ui.slice";
import { AppDispatch } from "../../app/store";
import { ItemsComponent } from "../items/items.component";
import { DividerComponent } from "../divider/divider.component";
import { v4 } from "uuid";

export interface ChapterComponentProps {
    items: Item[],
    chapter: Chapter
}

export function ChapterComponent(props: ChapterComponentProps) {
    const dispatch = useDispatch<AppDispatch>()

    const createNewItem = (idx: number) => {
        {
            const newItem: Partial<Item> = {
                rank_in_chapter: idx + 1,
                item_id: v4(),
                outline: "",
                chapter: props.chapter.chapter_id
            }
            dispatch(upsertNewItem({ index: idx, item: newItem, project_id: props.chapter.project +"" }))
        }
    }
    const onLocalTitleChange = (newTitle: string) => {
        const updatePayload = {
            chapterId: props.chapter.chapter_id,
            newTitle
        }
        dispatch(locallyUpdateChapterTitle(updatePayload))
    }
    const onTitleChange = (newTitle: string) => {
        const updatePayload = {
            chapterId: props.chapter.chapter_id,
            newTitle
        }
        dispatch(upsertChapterTitle(updatePayload))
    }

    const rmChapter = (chapterId: string)=>{
        dispatch(deleteChapter(chapterId))
    }
    return (
        <div>
            <div className="chapterComponent">
                <div className="doubleSide">
                    <MoveableObject type={"Chapter"} onDelete={()=>rmChapter(props.chapter.chapter_id)}>
                        <Input
                            size="small"
                            placeholder="Chapter Title"
                            className="chapterTitle"
                            value={props.chapter.title || ""}
                            variant="borderless"
                            onChange={(e) => onLocalTitleChange(e.target.value)}
                            onBlur={(e) => onTitleChange(e.target.value)
                            }
                        />
                    </MoveableObject>
                    <MoveableObject type={"Chapter"}>
                        <Input
                            size="small"
                            placeholder="Chapter Title"
                            className="chapterTitle"
                            value={props.chapter.title || ""}
                            variant="borderless"
                            onChange={(e) => onLocalTitleChange(e.target.value)}
                            onBlur={(e) => onTitleChange(e.target.value)
                            }
                        />
                    </MoveableObject>
                </div>
                {/* # Children */}
                {props.items && props.items.map((i, idx) => {
                    return (
                        <><div className="doubleSide">
                            <ItemsComponent key={idx} item={i} final={false} onNewItem={() => createNewItem(idx + 1)} />
                            <ItemsComponent key={idx} item={i} final={true} onNewItem={() => createNewItem(idx + 1)} />
                        </div>
                            <DividerComponent onButtonClick={() => createNewItem(idx)} buttonCaption={"Paragraph"} index={idx} />
                        </>)
                })}
            </div>
        </div>
    )
}