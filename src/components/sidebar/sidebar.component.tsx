
import { ArrowLeftOutlined, LogoutOutlined } from "@ant-design/icons"
import "./sidebar.component.scss"
import { Button } from "antd"
import { supabase } from "../../app/supabaseClient"

import { useNavigate } from "react-router-dom";

interface SidebarProps {
    showBack?: boolean
}
export default function Sidebar(props: SidebarProps) {
    const navigate = useNavigate()
    const logOut = () => {
        supabase.auth.signOut()
        navigate("/login")
    }
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
                <Button shape="circle" icon={<LogoutOutlined />}  onClick={()=>logOut()}></Button>
            </div>

        </div>)
}