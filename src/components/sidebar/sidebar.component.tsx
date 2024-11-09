
import { ArrowLeftOutlined, LogoutOutlined } from "@ant-design/icons"
import "./sidebar.component.scss"
import { Button, Dropdown, MenuProps } from "antd"
import { supabase } from "../../app/supabaseClient"

import { Link, useNavigate } from "react-router-dom";
import Avatar from "antd/es/avatar/avatar";
import ChapterOverview from "../chapter-overview/chapter-overview.component";

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
                {props.showBack ? <Button type="link" href="/" icon={<ArrowLeftOutlined />}>Back to projects
                </Button> : ""}
            </div>
            <div className="chapters">
                <ChapterOverview></ChapterOverview>
            </div>
            <div className="bottomIcons">
                <Dropdown menu={{ items, onClick: clickContextMenu }}>
                    <div className="avatar">
                        <Avatar style={{ backgroundColor: '#87d068', color: '#ffffff' }}>U</Avatar>
                        user1@testuiser.com
                    </div>
                </Dropdown>
            </div>
        </div>)
}