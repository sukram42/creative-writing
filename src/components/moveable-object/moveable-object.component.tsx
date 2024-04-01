import { ReactElement } from "react"
import "./moveable-object.component.scss"

interface MoveableObjectProps {
    children: ReactElement
    type: string
}

export function MoveableObject(props: MoveableObjectProps) {
    return (
        <div className="moveableObject">
            <div className="objectName">{props.type}</div>
            {props.children}
        </ div>)
}