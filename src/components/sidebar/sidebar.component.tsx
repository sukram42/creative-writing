
import { ArrowLeftOutlined, LogoutOutlined } from "@ant-design/icons"
import "./sidebar.component.scss"
import { Button, Dropdown, MenuProps } from "antd"
import { supabase } from "../../app/supabaseClient"

import { useNavigate } from "react-router-dom";
import Avatar from "antd/es/avatar/avatar";

interface SidebarProps {
    showBack?: boolean
}
export default function Sidebar(props: SidebarProps) {
    const navigate = useNavigate()
    const logOut = () => {
        supabase.auth.signOut()
        navigate("/login")
    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Logout',
            icon: <LogoutOutlined />
        },
    ];
    const clickContextMenu = (e) => {
        switch (e.key) {
            case "1": 
                logOut()
                break
        }
    }

    return (
        <div className="sidebarComponent">
            <div className="topIcons">
                {props.showBack ? <Button shape="circle" href="/" icon={<ArrowLeftOutlined />}>
                </Button> : ""}
            </div>
            <div className="middleIcons">
            </div>
            <div className="bottomIcons">
                {/* <Button shape="circle" icon={<LogoutOutlined />} onClick={() => logOut()}></Button> */}
                <Dropdown menu={{ items, onClick: clickContextMenu }}>
                    <Avatar style={{ backgroundColor: '#87d068', color: '#ffffff' }}>U</Avatar>
                </Dropdown>
            </div>

        </div>)
}