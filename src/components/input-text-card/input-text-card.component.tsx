import { Card } from "antd"
import Meta from "antd/es/card/Meta"
import TextArea from "antd/es/input/TextArea"
import { useState } from "react"


interface InputTextCardProps {
    description: string,
    title: string, 
    placeholder: string,
    onBlur: (val: string)=>void
    maxLength: number,
    defaultValue: string | undefined
}

export function InputTextCard(props: InputTextCardProps){

    const [value, setValue] = useState<string>(props.defaultValue || "")

    return (
        <Card className="inputTextCardComponent">
                <Meta 
                    title={props.title}
                    description={props.description}
                />
                <div className="textInputField" style={{padding: "1em 0"}}>
                <TextArea showCount
                onChange={(e) => setValue(e.target.value)}
                maxLength={props.maxLength}
                defaultValue={props.defaultValue || ""}
                placeholder={props.placeholder}
                onBlur={()=>props.onBlur(value)}
                variant="filled"/></div>
            </Card>
    )
}