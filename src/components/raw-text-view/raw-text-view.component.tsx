import { useSelector } from "react-redux"
import { getItems, getChapters } from "../../app/ui.slice/ui.slice.selectors"

import ReactQuill from "react-quill"
import "./raw-text-view.component.scss"

interface RawTextViewProps {
    projectId: string
}

export function RawTextView(props: RawTextViewProps) {
    const items = useSelector(getItems)
    const chapters = useSelector(getChapters)

    console.log("items", items)
    console.log("chapters", chapters)

    return (<div className="rawTextViewComponent">
        {chapters.map((chapter) => <div>
            <h1>{chapter.title}</h1>
            {items[chapter.chapter_id].map(para =>
                <ReactQuill theme={null} className="paragraphs" readOnly={true} value={para.final} />)}
        </div>
        )}
    </div>
    )
}