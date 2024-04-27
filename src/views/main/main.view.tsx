import { TextOutlinePane } from "../../components/text-outline-pane/text-outline-pane.component"
import "./main.view.scss"
import { Navigate, useParams } from "react-router-dom"

export function MainView() {
    const { id: activeProject } = useParams();
    console.log("Active", activeProject)

    if (activeProject) {
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

    return (
        <div className="mainView">
            {!activeProject ? <Navigate to={"/"}></Navigate> : ""}
            {/* <div className="notesPane">
                <NotesPaneComponent />
            </div> */}
            <div className="contentPane">
                <TextOutlinePane />
                {/* <EditorPaneComponent></EditorPaneComponent> */}
            </div>
        </div>)
}