import { useSelector } from "react-redux"

import ReactQuill from "react-quill"
import "./raw-text-view.component.scss"
import { getItemsV2 } from "../../app/items.slice/item.slice.selectors"
import { getActiveProject } from "../../app/ui.slice/ui.slice.selectors"


export function RawTextView() {
    const items = useSelector(getItemsV2)
    const activeProject = useSelector(getActiveProject)


    return (
        <div className="rawTextViewComponent">
            <h1>{activeProject?.name}</h1>
            <br />
            {items.map((i,idx) => {
                switch (i.type) {
                    case "PARAGRAPH":
                        // @ts-ignore
                        return <ReactQuill key={idx}theme={null} className="paragraphs" readOnly={true} value={i.final} />
                    case "H1":
                        return <h2 key={idx}>{i.outline}</h2>
                }
            })}
        </div>

    )
}