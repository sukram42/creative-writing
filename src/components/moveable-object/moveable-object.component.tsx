
import "./moveable-object.component.scss"
import { BulbOutlined, DeleteOutlined, HolderOutlined, LoadingOutlined, LockFilled, LockOutlined, PlusOutlined, RedoOutlined, UnlockOutlined, WarningFilled } from "@ant-design/icons"
import { Button, Divider, Dropdown, MenuProps, Popover, Tooltip, theme } from "antd"
import React from "react"
import { useDispatch } from "react-redux";
import { createNewItem, deleteItemAsyncV2 } from "../../app/items.slice/item.slice.async";
import { ItemV2 } from "../../app/supabaseClient";
import { Views } from "../../app/ui.slice/view.states";
import { Description } from "../description/description.component";
import { ViewDescriptionMapping } from "../description/paragraph-description.component";
import { MoveableDropdown } from "./dropdown.component";
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
                {/* <div className="viewDescription">Paragraph</div> */}
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
                    {props.view == "final" && <Popover
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
                    </Popover>}
                    <MoveableDropdown
                        index={props.index}
                        item={props.item}
                        view={props.view}
                        onToggleLock={props.onToggleLock}
                        showQA={props.showQA}
                        locked={props.locked}
                        trigger={["click"]}
                    >
                        <Button
                            type="text"
                            size="small"
                            icon={<HolderOutlined />} />
                    </MoveableDropdown>

                </div>
            </div>
            <div className="textContent" >

                {props.loading ?
                    <div className="moveableContent loadingOverlay">
                        <LoadingOutlined spin={true} />
                    </div> : ""}
                <MoveableDropdown
                    trigger={["contextMenu"]}
                    index={props.index}
                    item={props.item}
                    view={props.view}
                    onToggleLock={props.onToggleLock}
                    showQA={props.showQA}
                    locked={props.locked}
                >
                    <div className="moveableContent">{props.children}</div>
                </MoveableDropdown>
            </div>
        </ div >)
}