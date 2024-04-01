import { Input, Typography } from "antd";
import { Chapter, Item } from "../../app/supabaseClient";
import { MoveableObject } from "../moveable-object/moveable-object.component";

import "./chapter.component.scss"
import { useDispatch } from "react-redux";
import { upsertChapterTitle } from "../../app/ui.slice/ui.slice.async";
import { locallyUpdateChapterTitle } from "../../app/ui.slice/ui.slice";
import { AppDispatch } from "../../app/store";
import { ItemsComponent } from "../items/items.component";

export interface ChapterComponentProps {
    items: Item[],
    chapter: Chapter
}

export function ChapterComponent(props: ChapterComponentProps) {

    const dispatch = useDispatch<AppDispatch>()

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

    return (
        <MoveableObject type={"Chapter"}>
            <div className="chapterComponent">
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
                {props.items.map(i=>(<ItemsComponent item={i}/>))}
            </div>

        </MoveableObject>
    )
}