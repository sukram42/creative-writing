import { BulbOutlined, DeleteOutlined, HolderOutlined, LockOutlined, PlusOutlined, UnlockOutlined } from "@ant-design/icons";
import { Dropdown, Button, theme } from "antd";
import React, { ReactNode } from "react";
import { ViewDescriptionMapping } from "../description/paragraph-description.component";
import { createNewItem, deleteItemAsyncV2 } from "../../app/items.slice/item.slice.async";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { Views } from "../../app/ui.slice/view.states";
import { ItemV2 } from "../../app/supabaseClient";
const { useToken } = theme;


interface MoveableDropdownProps {
    view: Views,
    index: number,
    locked?: boolean,
    onToggleLock?: () => void
    item: ItemV2,
    showQA?: () => void,
    children: ReactNode

    trigger: ("contextMenu" | "click" | "hover")[] | undefined
}

export function MoveableDropdown(props: MoveableDropdownProps) {

    const dispatch = useDispatch<AppDispatch>()

    const { token } = useToken();




    const contentStyle: React.CSSProperties = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
    };

    const menuStyle: React.CSSProperties = {
        boxShadow: 'none',
    };


    const dropdown: { show: boolean, item: any }[] = [
        {
            show: true,
            item:
            {
                type: 'divider',
            }
        },
        {
            show: true,
            item: {
                label: (
                    < div className="menuItem" >
                        <p>New Paragraph</p>
                        <div>Ctrl + Enter</div>
                    </div >),
                key: "0",
                onClick: () => dispatch(createNewItem({ idx: props.index, type: "PARAGRAPH" })),
                icon: <PlusOutlined />
            }
        },
        {
            show: true,
            item: {
                label: (<div className="menuItem">
                    <p>New Heading</p>
                </div>),
                onClick: () => dispatch(createNewItem({ idx: props.index, type: "H1" })),
                key: "1",
                icon: <PlusOutlined />
            }
        },
        {
            show: true,
            item:
            {
                type: 'divider',
            }
        },
        {
            show: props.view == "final",
            item:
            {
                label: (<div className="menuItem"><p>{props.locked ? "Unlock Paragraph" : "Lock Paragraph"}</p></div>),
                key: "2",
                onClick: () => props.onToggleLock && props.onToggleLock(),
                icon: props.locked ? <LockOutlined></LockOutlined> : <UnlockOutlined></UnlockOutlined>,
                danger: props.locked
            }
        },
        {
            show: props.view !== "idea",
            item: {
                label: <div className="menuItem"><p>AI Refinement</p></div>,
                key: "3",
                onClick: () => props.showQA && props.showQA(),
                icon: <BulbOutlined />,
            }
        },
        {
            show: true,
            item:
            {
                type: 'divider',
            }
        },
        {
            show: true,
            item:
            {
                label: <div className="menuItem"> <p>Delete</p><div>Ctrl + Backspace</div></div>,
                key: '4',
                onClick: () => dispatch(deleteItemAsyncV2(props.item)),
                icon: <DeleteOutlined />,
                extra: '⌘P',
                danger: true,
            }
        }
    ];
    return <Dropdown destroyPopupOnHide
        menu={{ items: dropdown.filter((i) => i.show).map(i => i.item) }}

        trigger={props.trigger}
        dropdownRender={(menu) => (
            <div style={contentStyle}>
                {ViewDescriptionMapping[props.view]}
                {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
            </div>)}
    >
        {props.children}
    </Dropdown>
}