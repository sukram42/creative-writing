
import "./moveable-object.component.scss"
import { DeleteOutlined, RedoOutlined } from "@ant-design/icons"
import { Button } from "antd"

interface MoveableObjectProps {
    children: JSX.Element|JSX.Element[]
    type: string
    onDelete?: () => void
    onRedo?: () => void
    showRedo?: boolean
}

export function MoveableObject(props: MoveableObjectProps) {
    return (
        <div className="moveableObject">
            <div className="objectName">
                {props.type}
                <Button
                    type="text"
                    shape="circle"
                    size="small"
                    onClick={() => { if(!!props.onDelete) props.onDelete() }}
                    icon={<DeleteOutlined />} />

                {props.showRedo ? <Button
                    type="text"
                    size="small"
                    shape="circle"
                    onClick={() => { if(props.onRedo) props.onRedo() }}
                    icon={<RedoOutlined />} /> : ""}


            </div>
            {props.children}
        </ div>)
}