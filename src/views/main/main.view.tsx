import { useDispatch, useSelector } from "react-redux"
import { supabase } from "../../app/supabaseClient"
import { NotesPaneComponent } from "../../components/notes-pane/notes-pane.component"
import { TextOutlinePane } from "../../components/text-outline-pane/text-outline-pane.component"
import "./main.view.scss"
import { getChaptersByProject } from "../../app/ui.slice/ui.slice.async"
import { getActiveProject } from "../../app/ui.slice/ui.slice.selectors"
import { AppDispatch } from "../../app/store"
import { Navigate, useParams } from "react-router-dom"
import { act } from "react-dom/test-utils"
import Sidebar from "../../components/sidebar/sidebar.component"

export function MainView() {
    const dispatch = useDispatch<AppDispatch>()
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
            {!activeProject? <Navigate to={"/"}></Navigate>:""}
            {/* <div className="notesPane">
                <NotesPaneComponent />
            </div> */}
            <div className="contentPane">
                <TextOutlinePane />
                {/* <EditorPaneComponent></EditorPaneComponent> */}
            </div>
        </div>)
}