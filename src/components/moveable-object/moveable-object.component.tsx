import { ReactElement } from "react"
import "./moveable-object.component.scss"
import { DeleteOutlined, RedoOutlined } from "@ant-design/icons"
import { Button } from "antd"

interface MoveableObjectProps {
    children: ReactElement
    type: string
    onDelete: () => {}
    onRedo: () => {}
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
                    onClick={() => { props.onDelete() }}
                    icon={<DeleteOutlined />} />

                {props.showRedo ? <Button
                    type="text"
                    size="small"
                    shape="circle"
                    onClick={() => { props.onRedo() }}
                    icon={<RedoOutlined />} /> : ""}


            </div>
            {props.children}
        </ div>)
}