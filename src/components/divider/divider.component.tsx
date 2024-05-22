import { Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import "./divider.component.scss"

enum ItemType {
    "PARAGRAPH",
    "H1"
}
interface DividerComponentProps {
    onButtonClick: (index: number, type: ItemType) => void
    buttonCaption: string,
    index: number
}

export function DividerComponent(props: DividerComponentProps) {
    return <>
        <div className="dividerComponent">
            <div className="dividerButtons">
                <Button shape="round"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => props.onButtonClick(props.index, ItemType.PARAGRAPH)}>{props.buttonCaption}</Button>
            </div>
            <div className="dividerLine"></div>
        </div>
    </>
}