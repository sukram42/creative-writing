
import { ArrowLeftOutlined, DoubleLeftOutlined, LogoutOutlined } from "@ant-design/icons"
import "./sidebar.component.scss"
import { Button, Dropdown, MenuProps } from "antd"
import { supabase } from "../../app/supabaseClient"

import { useNavigate } from "react-router-dom";
import Avatar from "antd/es/avatar/avatar";
import ChapterOverview from "../chapter-overview/chapter-overview.component";

import { HashLink } from 'react-router-hash-link';
import useSelection from "antd/es/table/hooks/useSelection";
import { useDispatch, useSelector } from "react-redux";
import { isShowSidebar } from "../../app/ui.slice/ui.slice.selectors";
import { setShowSidebar } from "../../app/ui.slice/ui.slice";
interface SidebarProps {
    showBack?: boolean
}
export default function Sidebar(props: SidebarProps) {
    const navigate = useNavigate()
    const logOut = () => {
        supabase.auth.signOut()
        navigate("/login")
    }

    const dispatch = useDispatch()


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
                <div>
                    <HashLink smooth to={`/project/7e6183ec-bc0d-4b0d-89cb-2290f1992a95#introduction`}>Travelsickness in Trains</HashLink>
                </div>
                <div className="sidebarButton">
                    <Button type="link" onClick={() => dispatch(setShowSidebar(false))} icon={<DoubleLeftOutlined />}></Button>
                </div>

                {/* {props.showBack ? <Button type="link" href="/" icon={<ArrowLeftOutlined />}>
                Back to projects
                </Button> : ""} */}
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