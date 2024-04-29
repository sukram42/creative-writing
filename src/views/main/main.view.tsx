
import { TextOutlinePane } from "../../components/text-outline-pane/text-outline-pane.component"
import "./main.view.scss"
import { Navigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setActiveProject } from "../../app/ui.slice/ui.slice.async";
import { AppDispatch } from "../../app/store";
import { getActiveProject } from "../../app/ui.slice/ui.slice.selectors";
import { Drawer } from "antd";
import { ProjectUpdateForm } from "../../components/project-update-form/project-update-form.component";

export function MainView() {
    const { id: activeProjectId } = useParams();
    const dispatch = useDispatch<AppDispatch>()
    const activeProject = useSelector(getActiveProject)

    useEffect(
        ()=>{
            if(!!activeProjectId) dispatch(setActiveProject(activeProjectId))
        }
    )

    if (activeProjectId) {
        // supabase.channel('custom-update-channel')
        //     .on(
        //         'postgres_changes',
        //         { event: 'UPDATE', schema: 'public', table: 'items' },
        //         (payload) => {
        //             dispatch(getChaptersByProject(activeProject))
        //         }
        //     )
        //     .subscribe()
    }
    console.log(activeProjectId)

    return (
        <div className="mainView">
            {!activeProjectId ? <Navigate to={"/"}></Navigate> : ""}
            {/* <div className="notesPane">
                <NotesPaneComponent />
            </div> */}
            {!!activeProject ?
                <Drawer open={true} placement="left" size="large" title={activeProject.name}>
                    <ProjectUpdateForm project={activeProject}></ProjectUpdateForm>
                </Drawer> : ""}
            <div className="contentPane">
                <TextOutlinePane />
                {/* <EditorPaneComponent></EditorPaneComponent> */}
            </div>
        </div>)
}