import { ItemProps } from "./item.interface"
import { ItemMapping } from "./item.mapping"

import "./item.component.scss"

export function Item(props: Partial<ItemProps>) {

    if (!props.item) throw Error("An Item type needs an Item to be passed down.")
    const newProps: ItemProps = {
        item: props.item!,
        ...props
    }
    const itemComponent = ItemMapping[props.item.type!](newProps)
    
    return itemComponent

}