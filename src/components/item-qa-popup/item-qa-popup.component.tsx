import { Button, Input, InputRef, Popover } from "antd";
import { ReactNode, useEffect, useRef, useState } from "react";
import { feedback2item } from "../../app/ai.slice/ai.slice.async";
import { ItemV2 } from "../../app/supabaseClient";
import { BulbOutlined, InfoCircleOutlined, RollbackOutlined } from "@ant-design/icons";

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

    useEffect(() => {
        console.log(searchRef)
        setTimeout(()=>searchRef.current?.focus(), 0.1)
    }, [props.show])


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

    const doExample = (example: text) => {
        setQueryText(example)
        onPrompt(example)
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
                    onKeyDown={(e)=>e.key==="Escape" && onOpenChange(false)}
                    suffix={
                        <Popover trigger={["click", "hover"]} title={<><BulbOutlined /> AI Refinement </>}
                            content={<p>Ask the AI something about your outline or paragraph. <br />Please check the output of the model.</p>}>
                            <Button type="text" size="small" icon={<InfoCircleOutlined />}>
                            </Button>
                        </Popover>
                    }
                    enterButton />
                <div className='acceptButtons'>
                    {!oldText && <div className={"examples"}>
                        <Button
                            color="default"
                            onClick={() => doExample("Add examples")}
                            shape="round">
                            Add more examples
                        </Button>
                        <Button color="default"
                            shape="round"
                            onClick={() => doExample("Make it more concise")}>
                            Make it more concise
                        </Button>
                    </div>}
                    {!!oldText && <Button type="text" disabled={isLoading} size="small" onClick={() => revert()} icon={<RollbackOutlined />}>
                        Revert
                    </Button>}
                </div>
            </div>}
    >
        {props.children}
    </Popover>
}