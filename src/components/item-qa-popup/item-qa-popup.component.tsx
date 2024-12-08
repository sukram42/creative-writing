import { Button, Input, InputRef, Popover } from "antd";
import { ReactNode, useRef, useState } from "react";
import { feedback2item } from "../../app/ai.slice/ai.slice.async";
import { ItemV2 } from "../../app/supabaseClient";
import { InfoCircleOutlined, RollbackOutlined } from "@ant-design/icons";

const { Search } = Input;

import "./item-qa-popup.component.scss"
import { Views } from "../../app/ui.slice/view.states";
interface ItemQAPopupProps {
    item: ItemV2,
    show: boolean,
    view: Views,
    onLocalTextChange: (newText: string, view: Views) => void
    onOpenChange: (val: boolean) => void

    children: ReactNode

}
export function ItemQAPopup(props: ItemQAPopupProps) {

    const [isLoading, setLoading] = useState<boolean>(false)
    const [oldText, setOldText] = useState<string | null>(null)
    const [queryText, setQueryText] = useState<string>("")

    const searchRef = useRef<InputRef>(null)

    const reset = () => {
        setOldText(null)
        setLoading(false)
        setQueryText("")
    }

    const onOpenChange = (val: boolean) => {
        if (!val) {
            reset()
        }
        props.onOpenChange(val)
    }

    const onPrompt = (prompt: string) => {
        setLoading(true)
        const text = props.item[props.view]
        setOldText(text)
        feedback2item({
            text: text || "",
            query: prompt,
            type: props.view
        })
            .then((result) => { props.onLocalTextChange(result.result, props.view); return result })
            .then(() => setLoading(false))
    }

    const revert = () => {
        if (!oldText) return
        props.onLocalTextChange(oldText, props.view)
        setOldText(null)
    }

    return <Popover
        trigger="click"
        open={props.show}
        onOpenChange={(val) => onOpenChange(val)}
        content={
            <div className='itemQaContentComponent'>
                <Search
                    ref={searchRef}
                    placeholder="How can I help you with this paragraph?"
                    variant="borderless"
                    onSearch={(value) => onPrompt(value)}
                    loading={isLoading}
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    suffix={
                        <Button type="text" size="small" icon={<InfoCircleOutlined />}>
                        </Button>
                    }
                    enterButton />
                <div className='acceptButtons'>
                    {!!oldText && <Button type="text" disabled={isLoading} size="small" onClick={() => revert()} icon={<RollbackOutlined />}>
                        Revert
                    </Button>}
                </div>
            </div>}
    >
        {props.children}
    </Popover>
}