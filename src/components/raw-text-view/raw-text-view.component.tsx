import { useSelector } from "react-redux"

import ReactQuill from "react-quill"
import "./raw-text-view.component.scss"
import { getItemsV2 } from "../../app/items.slice/item.slice.selectors"


export function RawTextView() {
    const items = useSelector(getItemsV2)


    return (
        <div className="rawTextViewComponent">
            {items.map(i => {
                switch (i.type) {
                    case "PARAGRAPH":
                        // @ts-ignore
                        return <ReactQuill theme={null} className="paragraphs" readOnly={true} value={i.final} />
                    case "H1":
                        return <h1>{i.outline}</h1>
                }
            })}
        </div>

    )
}