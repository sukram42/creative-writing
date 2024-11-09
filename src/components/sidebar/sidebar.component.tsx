
import { DoubleLeftOutlined, LogoutOutlined, ProductOutlined } from "@ant-design/icons"
import "./sidebar.component.scss"
import { Button, Dropdown, MenuProps, Skeleton } from "antd"
import { supabase } from "../../app/supabaseClient"

import { useNavigate } from "react-router-dom";
import ChapterOverview from "../chapter-overview/chapter-overview.component";

import { HashLink } from 'react-router-hash-link';
import { useDispatch, useSelector } from "react-redux";
import { getActiveProject } from "../../app/ui.slice/ui.slice.selectors";
import { setShowSidebar } from "../../app/ui.slice/ui.slice";
import UserAvatar from "./sidebar-avatar";

export default function Sidebar() {
    const navigate = useNavigate()
    const logOut = () => {
        supabase.auth.signOut()
        navigate("/login")
    }

    const activeProject = useSelector(getActiveProject)

    const dispatch = useDispatch()


    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Change Project',
            icon: <ProductOutlined />
        },
        {
            key: '2',
            label: 'Logout',
            icon: <LogoutOutlined />
        }
    ];
    const clickContextMenu = (e: {key: string}) => {
        switch (e.key) {
            case "1":
                navigate("/")
                break
            case "2":
                logOut()
                break
        }
    }
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('default', { dateStyle: 'short', timeStyle: 'short' }).format(date);
    };

    return (
        <div className="sidebarComponent">

            <div className="topIcons">
                <div className="projectDescription">
                    <Dropdown menu={{ items, onClick: clickContextMenu }}>
                        <HashLink smooth to={`/project/${activeProject?.project_id}#${activeProject?.project_id}`}>
                            <Skeleton title={false} loading={!activeProject} active paragraph={{ rows: 2 }} >

                                <div className="projectPanel">
                                    <div className="projectName">{activeProject?.name}</div>
                                    <div className="projectMeta">created on {activeProject && formatDate(activeProject.created_at)}</div>
                                </div>
                            </Skeleton >
                        </HashLink>
                    </Dropdown>
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
                <UserAvatar smallVersion={false}></UserAvatar>
            </div>
        </div>)
}