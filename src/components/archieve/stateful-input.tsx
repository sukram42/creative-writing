import { Input } from "antd"
import { useState } from "react"

interface StatefulInputProps {
    onChange: (e: React.ChangeEvent) => void
    initialValue?: string
    variant?: "filled"
}

export function StatefulInput(props: StatefulInputProps) {
    const [value, setValue] = useState(props.initialValue || "")

    const onChange = (e: React.ChangeEvent) => {
        setValue((e.target as HTMLTextAreaElement).value)
        props.onChange(e)
    }

    return <Input value={value} onChange={onChange} />
}