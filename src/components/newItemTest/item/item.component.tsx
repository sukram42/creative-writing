import { useDispatch } from "react-redux"
import { ItemProps } from "./item.interface"
import { ItemMapping } from "./item.mapping"
import { AppDispatch } from "../../../app/store"
import { deleteItemAsyncV2 } from "../../../app/items.slice/item.slice.async"
import { ItemV2 } from "../../../app/supabaseClient"

import "./item.component.scss"

export function Item(props: Partial<ItemProps>) {

    if (!props.item) throw Error("An Item type needs an Item to be passed down.")
    const dispatch = useDispatch<AppDispatch>()

    const onDelete = (item: ItemV2) => {
        dispatch(deleteItemAsyncV2(item))
    }
    const newProps: ItemProps = {
        onDelete,
        item: props.item!,
        ...props
    }
    console.log(newProps)
    const itemComponent = ItemMapping[props.item.type!](newProps)
    return itemComponent
}