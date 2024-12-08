
import { TextOutlinePane } from "../../components/text-outline-pane/text-outline-pane.component"
import "./main.view.scss"
import { Navigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setActiveProject } from "../../app/ui.slice/ui.slice.async";
import { AppDispatch } from "../../app/store";
import { getActiveProject, getDocumentDrawerState, getRawDrawerState, getStep, getViews, isShowSidebar } from "../../app/ui.slice/ui.slice.selectors";
import { Badge, Button, Drawer, Popover, theme } from "antd";
import { ProjectUpdateForm } from "../../components/project-update-form/project-update-form.component";
import { DoubleRightOutlined, FileOutlined, SettingOutlined } from "@ant-design/icons";
import { RawTextView } from "../../components/raw-text-view/raw-text-view.component";
import { setDocumentDrawerOpen, setRawDrawerOpen, setShowSidebar, setStep } from "../../app/ui.slice/ui.slice";
import { Rect } from "../../components/description/rect.image";
import { Views } from "../../app/ui.slice/view.states";

const { useToken } = theme

export function MainView() {
    const { id: activeProjectId } = useParams();
    const dispatch = useDispatch<AppDispatch>()
    const activeProject = useSelector(getActiveProject)
    const documentDrawerOpen = useSelector(getDocumentDrawerState)
    const rawDrawerOpen = useSelector(getRawDrawerState)



    useEffect(
        () => {
            dispatch(setShowSidebar(true))
            if (!!activeProjectId) dispatch(setActiveProject(activeProjectId))
        }, []
    )
    const { token } = useToken()

    const sidebarVisible = useSelector(isShowSidebar)
    const views = useSelector(getViews)
    const step = useSelector(getStep)

    const onClickStep = (view: Views) => {
        if (step === "outlining" && view === "final") {
            dispatch(setStep("finalizing"))
            return
        }
        if (step === "finalizing" && view === "idea") {
            dispatch(setStep("outlining"))
        }
    }

    return (
        <div className="mainView" id={activeProject?.project_id}>
            {!activeProjectId ? <Navigate to={"/"}></Navigate> : ""}
            <div className="mainViewHeader">
                <div className="headerElements">
                    <div className="topRow">
                        <div className="sidebarButton">
                            {!sidebarVisible &&
                                <Button type="link" onClick={() => dispatch(setShowSidebar(true))} icon={<DoubleRightOutlined />}></Button>}
                        </div>
                        <div className="viewIndicator">
                            <Popover mouseEnterDelay={0.7} title="The different steps!" content={
                                <p>Outlaine allows you to work in the three main steps:
                                    <ul><li> Idiation</li>
                                        <li>Outlining</li>
                                        <li>Finalizing</li>
                                    </ul>Each step has one rectangle. If the rectangle is blue, then you can see it on the screen</p>}>
                                <a onClick={() => onClickStep("idea")}>
                                    <Rect width={20}
                                        fill={views.includes("idea") ? token.colorPrimary : token.colorBgContainer}
                                    />
                                </a>
                                <a onClick={() => onClickStep("outline")}>
                                    <Rect width={20} fill={views.includes("outline") ? token.colorPrimary : token.colorBgContainer} />
                                </a>
                                <a onClick={() => onClickStep("final")}>
                                    <Rect width={20} fill={views.includes("final") ? token.colorPrimary : token.colorBgContainer} />
                                </a>
                            </Popover>

                        </div>
                        <div className="buttons">
                            <Button icon={<Badge dot={!activeProject?.description}><SettingOutlined /></Badge>} onClick={() => dispatch(setDocumentDrawerOpen(true))} type="text" />
                            <Button icon={<FileOutlined />} onClick={() => dispatch(setRawDrawerOpen(true))} type="text" /></div>
                    </div>
                    {/* <div className="StepIndicator">
                        {views.map(view => <div className={view + " view"} />)}
                    </div> */}
                </div>

            </div>
            <Drawer size="large" open={rawDrawerOpen} title={activeProject ? activeProject.name : ""} onClose={() => dispatch(setRawDrawerOpen(false))}>
                {activeProjectId ? <RawTextView></RawTextView> : ""}
            </Drawer>
            {
                !!activeProject ?
                    <Drawer open={documentDrawerOpen} onClose={() => dispatch(setDocumentDrawerOpen(false))} placement="left" size="large" title={activeProject.name}>
                        <ProjectUpdateForm project={activeProject}></ProjectUpdateForm>
                    </Drawer> : ""
            }
            <div className="contentPane">
                <TextOutlinePane />
            </div>
        </div >)
}