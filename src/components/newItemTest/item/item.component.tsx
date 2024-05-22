import { ItemProps } from "./item.interface"
import { ItemMapping } from "./item.mapping"

export function Item(props: ItemProps) {
    const itemComponent = ItemMapping[props.item.type](props.item)
    return itemComponent
}