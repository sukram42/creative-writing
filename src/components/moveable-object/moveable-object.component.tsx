
import "./moveable-object.component.scss"
import { DeleteOutlined, HolderOutlined, LoadingOutlined, LockOutlined, PlusOutlined, RedoOutlined, UnlockOutlined } from "@ant-design/icons"
import { Button, Dropdown, MenuProps, Tooltip, theme } from "antd"
import React from "react"
const { useToken } = theme;
interface MoveableObjectProps {
    children: JSX.Element | JSX.Element[]
    type: string
    onDelete?: () => void
    onRedo?: () => void
    showRedo?: boolean
    loading?: boolean,
    onNew: () => void
    locked?: boolean
    showLocked?: boolean
    onToggleLock?: () => void
}

export function MoveableObject(props: MoveableObjectProps) {

    const { token } = useToken();
    const dropdown: MenuProps['items'] = [
        {
            label: <a onClick={() => props.onNew()}>New Paragraph</a>,
            key: "0",
            icon: <PlusOutlined />
        },
        {
            type: 'divider',
        },
        {
            label: <a onClick={() => props.onDelete && props.onDelete()}>Delete</a>,
            key: '1',
            icon: <DeleteOutlined />,
            danger: true,
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
                {props.showLocked &&
                    <Tooltip title="When you lock the paragraph, we do not generate new versions of it.">
                        <div className={"lockingToolbar " + (props.locked ? "currentlyLocked" : "")}>
                            {props.locked ? <LockOutlined onClick={() => props.onToggleLock && props.onToggleLock()}></LockOutlined> : <UnlockOutlined onClick={() => props.onToggleLock && props.onToggleLock()}></UnlockOutlined>}
                        </div>
                    </Tooltip>
                }
                <div className="buttonBar">
                    {/* I am not proud of this: */}
                    {!props.showRedo ? <Button
                        type="text"
                        size="small"
                        style={{ visibility: props.showRedo ? "visible" : "hidden" }}
                        disabled={!props.showRedo}
                        onClick={() => { if (props.onRedo) props.onRedo() }}
                        icon={<RedoOutlined />} /> : ""}
                    <Button
                        type="text"
                        size="small"
                        onClick={() => { if (!!props.onNew) props.onNew() }}
                        icon={<PlusOutlined />} />
                    <Dropdown menu={{ items: dropdown }} trigger={['click']} dropdownRender={(menu) => (
                        <div style={contentStyle}>
                            {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
                        </div>
                    )}>
                        <Button
                            type="text"
                            size="small"
                            icon={<HolderOutlined />} />
                    </Dropdown>
                    {props.showRedo ? <Button
                        type="text"
                        size="small"
                        style={{ visibility: props.showRedo ? "visible" : "hidden" }}
                        disabled={!props.showRedo}
                        onClick={() => { if (props.onRedo) props.onRedo() }}
                        icon={<RedoOutlined />} /> : ""}
                </div>
            </div>
            <div className="textContent">
                {props.loading ?
                    <div className="moveableContent loadingOverlay">
                        <LoadingOutlined spin={true} />
                    </div> : ""}
                <div className="moveableContent">{props.children}</div>
            </div>
        </ div >)
}