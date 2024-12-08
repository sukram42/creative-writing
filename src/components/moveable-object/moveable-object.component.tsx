
import "./moveable-object.component.scss"
import { BulbOutlined, DeleteOutlined, HolderOutlined, LoadingOutlined, LockFilled, LockOutlined, PlusOutlined, RedoOutlined, UnlockOutlined, WarningFilled } from "@ant-design/icons"
import { Button, Dropdown, MenuProps, Popover, Tooltip, theme } from "antd"
import React from "react"
import { useDispatch } from "react-redux";
import { createNewItem, deleteItemAsyncV2 } from "../../app/items.slice/item.slice.async";
import { ItemV2 } from "../../app/supabaseClient";
import { Views } from "../../app/ui.slice/view.states";
const { useToken } = theme;
interface MoveableObjectProps {
    children: JSX.Element | JSX.Element[]
    index: number,
    item: ItemV2
    view: Views,

    onRedo?: () => void
    showRedo?: boolean
    loading?: boolean,
    error?: string,

    locked?: boolean
    showLocked?: boolean
    onToggleLock?: () => void
    showQA?: () => void
}

export function MoveableObject(props: MoveableObjectProps) {
    const { token } = useToken();
    const dispatch = useDispatch();


    const dropdown: { show: boolean, item: any }[] = [
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
                danger: true,
            }
        }
    ];

    const contentStyle: React.CSSProperties = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
    };

    const menuStyle: React.CSSProperties = {
        boxShadow: 'none',
    };
    return (
        <div className="moveableObject">
            <div className="toolbar">
                <div className="buttonBar">
                    <Button
                        type="text"
                        size="small"
                        onClick={() => {
                            dispatch(createNewItem({ idx: props.index, type: "PARAGRAPH" }))
                        }}
                        icon={< PlusOutlined />} />
                    {props.showRedo ? <Button
                        type="text"
                        size="small"
                        style={{ visibility: props.showRedo ? "visible" : "hidden" }}
                        disabled={!props.showRedo}
                        onClick={() => { if (props.onRedo) props.onRedo() }}
                        icon={!!props.error ?
                            <Tooltip title={props.error} color="#FF3333">
                                <WarningFilled style={{ color: 'red' }} />
                            </Tooltip>
                            :
                            <RedoOutlined spin={props.loading} />} /> : ""}
                    <Popover
                        content={<p>By locking your paragraph, the AI will only create a new paragraph when manually triggered.</p>}
                        title="Lock your paragraph!"
                        mouseEnterDelay={0.7}>
                        <Button
                            type="text"
                            danger={props.locked}
                            size="small"
                            className={props.locked ? "lockedIcon" : ""}
                            onClick={() => props.onToggleLock && props.onToggleLock()}
                            icon={props.locked ? <LockFilled style={{ color: "red" }} /> : <UnlockOutlined />}>
                        </Button>

                    </Popover>
                    <Dropdown destroyPopupOnHide
                        menu={{ items: dropdown.filter((i) => i.show).map(i => i.item) }}
                        trigger={['click']}
                        dropdownRender={(menu) => (
                            <div style={contentStyle}>
                                {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
                            </div>
                        )}>
                        <Button
                            type="text"
                            size="small"
                            icon={<HolderOutlined />} />
                    </Dropdown>

                </div>
            </div>
            <div className="textContent" >
                {props.loading ?
                    <div className="moveableContent loadingOverlay">
                        <LoadingOutlined spin={true} />
                    </div> : ""}
                <div className="moveableContent">{props.children}</div>
            </div>
        </ div >)
}