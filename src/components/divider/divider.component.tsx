import { Button } from "antd"
import {PlusOutlined} from "@ant-design/icons"
import "./divider.component.scss"

interface DividerComponentProps {
    onButtonClick: (index: number) => {}
    buttonCaption: string,
    index: number
}

export function DividerComponent(props: DividerComponentProps) {

    return <>
        <div className="dividerComponent">
            <div className="dividerButtons">
                <Button shape="round"
                    icon={<PlusOutlined />}
                    onClick={() => props.onButtonClick(props.index)}>{props.buttonCaption}</Button>
            </div>
            <div className="dividerLine"></div>
        </div>
    </>
}