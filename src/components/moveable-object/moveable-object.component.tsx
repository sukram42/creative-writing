
import "./moveable-object.component.scss"
import { DeleteOutlined, LoadingOutlined, RedoOutlined } from "@ant-design/icons"
import { Button } from "antd"

interface MoveableObjectProps {
    children: JSX.Element | JSX.Element[]
    type: string
    onDelete?: () => void
    onRedo?: () => void
    showRedo?: boolean
    loading?: boolean
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
                    onClick={() => { if (!!props.onDelete) props.onDelete() }}
                    icon={<DeleteOutlined />} />

                {props.showRedo ? <Button
                    type="text"
                    size="small"
                    shape="circle"
                    onClick={() => { if (props.onRedo) props.onRedo() }}
                    icon={<RedoOutlined />} /> : ""}


            </div>
            <div className="textContent">
                {props.loading ?
                    <div className="moveableContent loadingOverlay">
                        <LoadingOutlined spin={true} />
                    </div> : ""}
                <div className="moveableContent">{props.children}</div>
            </div>
        </ div>)
}