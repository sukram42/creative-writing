
import { TextOutlinePane } from "../../components/text-outline-pane/text-outline-pane.component"
import "./main.view.scss"
import { Navigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setActiveProject, updateProjectNameAsync } from "../../app/ui.slice/ui.slice.async";
import { AppDispatch } from "../../app/store";
import { getActiveProject } from "../../app/ui.slice/ui.slice.selectors";
import { Badge, Button, Drawer, Typography } from "antd";
import { ProjectUpdateForm } from "../../components/project-update-form/project-update-form.component";
import { FileOutlined, SettingOutlined } from "@ant-design/icons";
import { RawTextView } from "../../components/raw-text-view/raw-text-view.component";
import Paragraph from "antd/es/typography/Paragraph";
import { updateProjectName } from "../../app/ui.slice/ui.slice";

export function MainView() {
    const { id: activeProjectId } = useParams();
    const dispatch = useDispatch<AppDispatch>()
    const activeProject = useSelector(getActiveProject)

    const [documentDrawerOpen, setDocumentDrawerOpen] = useState<boolean>(false)
    const [rawDrawerOpen, setRawDrawerOpen] = useState<boolean>(false)
    useEffect(
        () => {
            if (!!activeProjectId) dispatch(setActiveProject(activeProjectId))
        }, []
    )

    return (
        <div className="mainView">
            {!activeProjectId ? <Navigate to={"/"}></Navigate> : ""}
            <div className="mainViewHeader">
                <div className="headerElements">
                    {!!activeProject ?
                        <Typography.Title className={"projectName"}  level={5} editable={{
                            onChange: (value) => dispatch(updateProjectNameAsync(value)),
                            triggerType: ["text"],
                        }}>{activeProject.name}</Typography.Title> : ""}
                    <div className="buttons">
                       <Button icon={<Badge dot={!activeProject?.description}><SettingOutlined /></Badge>} onClick={() => setDocumentDrawerOpen(true)} type="text" shape="round" />
                        <Button icon={<FileOutlined />} onClick={() => setRawDrawerOpen(true)} type="text" shape="round" /></div>
                </div>
            </div>
            {/* <div className="notesPane">
                <NotesPaneComponent />
            </div> */}
            <Drawer size="large" open={rawDrawerOpen} title={activeProject ? activeProject.name : ""} onClose={() => setRawDrawerOpen(false)}>
                {activeProjectId ? <RawTextView></RawTextView> : ""}
            </Drawer>
            {
                !!activeProject ?
                    <Drawer open={documentDrawerOpen} onClose={() => setDocumentDrawerOpen(false)} placement="left" size="large" title={activeProject.name}>
                        <ProjectUpdateForm project={activeProject}></ProjectUpdateForm>
                    </Drawer> : ""
            }
            <div className="contentPane">
                <TextOutlinePane />
                {/* <EditorPaneComponent></EditorPaneComponent> */}
            </div>
        </div >)
}