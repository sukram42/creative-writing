
import { ArrowLeftOutlined, LogoutOutlined } from "@ant-design/icons"
import "./sidebar.component.scss"
import { Button } from "antd"


interface SidebarProps {
    showBack?: boolean
}
export default function Sidebar(props: SidebarProps) {

    return (
        <div className="sidebarComponent">
            <div className="topIcons">
                {props.showBack ? <Button shape="circle" href="/" icon={<ArrowLeftOutlined />}>
                </Button> : ""}
            </div>
            <div className="middleIcons">
                mid
            </div>
            <div className="bottomIcons">
                <LogoutOutlined></LogoutOutlined>
            </div>

        </div>)
}