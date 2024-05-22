import { ReactElement } from "react";
import { Paragraph } from "../paragraph/paragraph.component";
import { ItemProps } from "./item.interface";
import { H1 } from "../header/h1.component";

export const ItemMapping: Record<string, (props: ItemProps) => ReactElement> = {
    "PARAGRAPH": (props) => <Paragraph {...props} />,
    "H1": (props) => <H1 {...props}></H1>
}