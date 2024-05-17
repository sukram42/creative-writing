import { useSelector } from "react-redux"
import { getItems, getChapters } from "../../app/ui.slice/ui.slice.selectors"

import ReactQuill from "react-quill"
import "./raw-text-view.component.scss"


export function RawTextView() {
    const items = useSelector(getItems)
    const chapters = useSelector(getChapters)


    return (<div className="rawTextViewComponent">
        {chapters.map((chapter) => <div>
            <h1>{chapter.title}</h1>
            {items[chapter.chapter_id].map(para =>
                // @ts-ignore
                <ReactQuill theme={null} className="paragraphs" readOnly={true} value={para.final} />)}
        </div>
        )}
    </div>
    )
}