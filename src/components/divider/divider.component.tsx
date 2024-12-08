import { Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import "./divider.component.scss"
import { ItemType } from "../../app/supabaseClient"

interface DividerComponentProps {
    onButtonClick: (index: number, type: ItemType) => void
    buttonCaptionParagraph: string,
    buttonCaptionHeader: string,
    index: number
}

export function DividerComponent(props: DividerComponentProps) {
    return <>
        <div className="dividerComponent">
            <div className="dividerButtons">
                <Button shape="round"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => props.onButtonClick(props.index, "H1")}>{props.buttonCaptionHeader}</Button>
                <Button shape="round"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => props.onButtonClick(props.index, "PARAGRAPH")}>{props.buttonCaptionParagraph}</Button>
            </div>
            <div className="dividerLine"></div>
        </div>
    </>
}