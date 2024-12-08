
import { theme } from "antd";
import "./description.component.scss";
import { Rect } from "./rect.image";

const { useToken } = theme;

interface DescriptionProps {
    description: string
    header: string
    column: number[]
}
export function Description(props: DescriptionProps) {
    const { token } = useToken()

    const getRectColor = (column: number) => props.column.includes(column) ? token.colorPrimary : token.colorBgContainer
    return <div className="viewDescription">
        <div className="rectangles">
            <Rect fill={getRectColor(1)}></Rect>
            <Rect fill={getRectColor(2)}></Rect>
            <Rect fill={getRectColor(3)}></Rect>
        </div>
        <div className="header">
            {props.header}
        </div>
        <div className="description">
            {props.description}
        </div>
    </div >
}