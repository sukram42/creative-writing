import { Button, Input, InputRef, Popover } from "antd";
import { useRef, useState } from "react";
import { feedback2item } from "../../app/ai.slice/ai.slice.async";
import { ItemV2 } from "../../app/supabaseClient";
import { InfoCircleOutlined, RollbackOutlined } from "@ant-design/icons";

const { Search } = Input;

import "./item-qa-popup.component.scss"
interface ItemQAPopupProps {
    item: ItemV2,
    show: boolean,
    final: boolean,
    onLocalTextChange: (newText: string, final: boolean) => void
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

    const onOpenChange = (val) => {
        if (!val) {
            reset()
        }
        props.onOpenChange(val)
    }

    const onPrompt = (prompt) => {
        setLoading(true)
        const text = props.final ? props.item.final : props.item.outline
        setOldText(text)
        feedback2item({
            text,
            query: prompt,
            type: props.final ? "paragraph" : "outline"
        })
            .then((result) => { props.onLocalTextChange(result.result, props.final); return result })
            .then(() => setLoading(false))
    }

    const revert = () => {
        if (!oldText) return
        props.onLocalTextChange(oldText, props.final)
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
                    placeholder="input search loading with enterButton"
                    variant="borderless"
                    onSearch={(value, e) => onPrompt(value)}
                    loading={isLoading}
                    value={queryText}
                    onChange={(e)=>setQueryText(e.target.value)}
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




    // <ItemQAContent
    //     loading={isLoading}
    //     onPrompt={onPrompt}
    //     proposalGiven={!!oldText}
    //     onRevert={() => { revert() }} />}

    >
        {props.children}
    </Popover>
}