import { Button, Space } from "antd";

import "./no-items-yet.component.scss"
import { PlusOutlined } from "@ant-design/icons";

interface NoItemsYetComponentProps {
    onNewParagraph: () => void,
    onNewHeader: () => void
}

export function NoItemsYetComponent(props: NoItemsYetComponentProps) {
    return <div className="noItemsYetComponent">
        <h1>Looks like you do have a new Project</h1>
        <p>Let's start with creating a new header or paragraph</p>
        <Space className="buttonList">
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => props.onNewHeader()}>
                Header
            </Button>
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => props.onNewParagraph()}>
                Paragraph
            </Button>
        </Space>
    </div>
}