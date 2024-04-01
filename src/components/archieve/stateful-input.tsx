import { Input } from "antd"
import { useState } from "react"



export function StatefulInput(props) {
    const [value, setValue] = useState(props.initalValue)

    const onChange = (e) => {
        setValue(e.target.value)
        props.onChange(e)
    }

    return <Input value={value} onChange={onChange} />
}