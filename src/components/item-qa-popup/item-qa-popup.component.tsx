import { Popover } from "antd";
import { ItemQAContent } from "./item-qa-content.component";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { feedback2item } from "../../app/ai.slice/ai.slice.async";
import { ItemV2 } from "../../app/supabaseClient";

interface ItemQAPopupProps {
    item: ItemV2,
    show: boolean,
    final: boolean,
    onLocalTextChange: (newText: string, final: boolean) => void
}
export function ItemQAPopup(props: ItemQAPopupProps) {

    const [isLoading, setLoading] = useState<boolean>(false)
    const dispatch = useDispatch()
    const [oldText, setOldText] = useState<string | null>(null)
    const [newText, setNewText] = useState<string | null>(null)

    const onPrompt = (prompt) => {
        // alert(prompt)
        setLoading(true)
        const text = props.final ? props.item.final : props.item.outline
        setOldText(oldText)
        const hallo = feedback2item({
            text,
            query: prompt,
            type: props.final ? "paragraph" : "outline"
        })
            .then((result) => props.onLocalTextChange(result.result, props.final))
            .then(() => setLoading(false))
    }


    return <Popover
        content={<ItemQAContent loading={isLoading} onPrompt={onPrompt} />}
        trigger="click"
        open={props.show}
        onOpenChange={(val) => props.onOpenChange(val)}
    >
        {props.children}
    </Popover>
}