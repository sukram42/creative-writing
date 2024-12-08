
import { ArrowLeftOutlined, DoubleLeftOutlined, LogoutOutlined, ProductOutlined } from "@ant-design/icons"
import "./sidebar.component.scss"
import { Button, Dropdown, MenuProps, Skeleton, Steps } from "antd"

import { useNavigate } from "react-router-dom";
import ChapterOverview from "../chapter-overview/chapter-overview.component";

import { HashLink } from 'react-router-hash-link';
import { useDispatch, useSelector } from "react-redux";
import { getActiveProject, getStep } from "../../app/ui.slice/ui.slice.selectors";
import { setDocumentDrawerOpen, setRawDrawerOpen, setShowSidebar, setStep } from "../../app/ui.slice/ui.slice";
import UserAvatar from "./sidebar-avatar";
import { StepMapping } from "../../app/ui.slice/view.states";

export default function Sidebar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const activeProject = useSelector(getActiveProject)

    const steps = Object.keys(StepMapping)
    const currentStep = useSelector(getStep)

    const onChangeStep = (val: number) => {
        dispatch(setStep(steps[val]))
    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Change Project',
            icon: <ProductOutlined />
        },
        {
            key: "2",
            label: "Configure Project"
        },
        {
            key: "3",
            label: "View Project"
        }
    ];
    const clickContextMenu = (e: { key: string }) => {
        switch (e.key) {
            case "1":
                navigate("/")
                break
            case "2":
                dispatch(setDocumentDrawerOpen(true))
                break
            case "3":
                dispatch(setRawDrawerOpen(true))
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
                <div className="sidebarButton">
                    <Button href="/" type={"link"} icon={<ArrowLeftOutlined />}>
                        Back to Projects
                    </Button>
                </div>
                <div className="sidebarButton">
                    <Button type="link" onClick={() => dispatch(setShowSidebar(false))} icon={<DoubleLeftOutlined />}></Button>
                </div>


            </div>
            <div className="chapters">
                <div className="projectDescription">
                    <Dropdown menu={{ items, onClick: clickContextMenu }}>
                        <div>
                            <HashLink smooth to={`/project/${activeProject?.project_id}#${activeProject?.project_id}`}>
                                <Skeleton title={false} loading={!activeProject} active paragraph={{ rows: 2 }} >
                                    <div className="projectPanel">
                                        <div className="projectName" style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            width: "15em",
                                            textOverflow: 'ellipsis',
                                        }}>{activeProject?.name}</div>
                                        <div className="projectMeta">created on {activeProject && formatDate(activeProject.created_at)}</div>
                                    </div>
                                </Skeleton >
                            </HashLink>
                        </div>
                    </Dropdown>
                </div>
                <Steps
                    direction="vertical"
                    progressDot={dot => dot}
                    size="small"
                    current={steps.indexOf(currentStep)}
                    onChange={onChangeStep}
                    className="site-navigation-steps"
                    items={steps.map((step) => ({ title: step.charAt(0).toUpperCase() + step.slice(1) }))}
                />
                <ChapterOverview></ChapterOverview>
            </div>
            <div className="bottomIcons">
                <UserAvatar smallVersion={false}></UserAvatar>
            </div>
        </div>)
}