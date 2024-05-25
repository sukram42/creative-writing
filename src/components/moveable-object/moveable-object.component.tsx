
import "./moveable-object.component.scss"
import { DeleteOutlined, HolderOutlined, LoadingOutlined, PlusOutlined, RedoOutlined } from "@ant-design/icons"
import { Button, Dropdown, MenuProps } from "antd"

interface MoveableObjectProps {
    children: JSX.Element | JSX.Element[]
    type: string
    onDelete?: () => void
    onRedo?: () => void
    showRedo?: boolean
    loading?: boolean,
    onNew: () => void
}

export function MoveableObject(props: MoveableObjectProps) {

    console.log("propssss", props)

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
            label: <a href="https://www.antgroup.com">Delete</a>,
            key: '1',
            icon: <DeleteOutlined />,
            danger: true,
        }
    ];

    return (
        <div className="moveableObject">
            {/* <div className="objectName">
                {props.type}
                <Button
                    type="text"
                    shape="circle"
                    size="small"
                    onClick={() => { if (!!props.onDelete) props.onDelete() }}
                    icon={<DeleteOutlined />} />

                {props.showRedo ? <Button
                    type="text"
                    size="small"
                    shape="circle"
                    onClick={() => { if (props.onRedo) props.onRedo() }}
                    icon={<RedoOutlined />} /> : ""}


            </div> */}
            <div className="buttonBar">
                <Button
                    type="text"
                    size="small"
                    onClick={() => { if (!!props.onDelete) props.onDelete() }}
                    icon={<DeleteOutlined />} />
                {props.showRedo ? <Button
                    type="text"
                    size="small"
                    shape="circle"
                    onClick={() => { if (props.onRedo) props.onRedo() }}
                    icon={<RedoOutlined />} /> : ""}

                <Dropdown menu={{ items: dropdown }} trigger={['click']}>
                    <Button
                        type="text"
                        size="small"
                        // onClick={() => { if (!!props.onDelete) props.onDelete() }}
                        icon={<HolderOutlined />} />
                </Dropdown>
            </div>
            <div className="textContent">
                {props.loading ?
                    <div className="moveableContent loadingOverlay">
                        <LoadingOutlined spin={true} />
                    </div> : ""}
                <div className="moveableContent">{props.children}</div>
            </div>
        </ div>)
}