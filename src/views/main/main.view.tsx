
import { TextOutlinePane } from "../../components/text-outline-pane/text-outline-pane.component"
import "./main.view.scss"
import { Navigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setActiveProject } from "../../app/ui.slice/ui.slice.async";
import { AppDispatch } from "../../app/store";
import { getActiveProject, getDocumentDrawerState, getRawDrawerState, getViewFinal, getViewIdea, getViewOutline, getViews, isShowSidebar } from "../../app/ui.slice/ui.slice.selectors";
import { Badge, Button, Drawer, Steps } from "antd";
import { ProjectUpdateForm } from "../../components/project-update-form/project-update-form.component";
import { AlignCenterOutlined, DoubleRightOutlined, DownloadOutlined, FileOutlined, SettingOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { RawTextView } from "../../components/raw-text-view/raw-text-view.component";
import { setDocumentDrawerOpen, setFinalView, setIdeaView, setOutlineView, setRawDrawerOpen, setShowSidebar } from "../../app/ui.slice/ui.slice";
import { current } from "@reduxjs/toolkit";

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

    const sidebarVisible = useSelector(isShowSidebar)
    const views = useSelector(getViews)

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

                        <div className="buttons">
                            <Button icon={<Badge dot={!activeProject?.description}><SettingOutlined /></Badge>} onClick={() => dispatch(setDocumentDrawerOpen(true))} type="text" />
                            <Button icon={<FileOutlined />} onClick={() => dispatch(setRawDrawerOpen(true))} type="text" /></div>
                    </div>
                    <div className="StepIndicator">
                        {views.map(view => <div className={view + " view"} />)}
                    </div>
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