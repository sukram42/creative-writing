import { NotesPaneComponent } from "../../components/notes-pane/notes-pane.component"
import { TextOutlinePane } from "../../components/text-outline-pane/text-outline-pane.component"
import "./main.view.scss"

export function MainView() {
    return (
        <div className="mainView">
            <div className="notesPane">
                <NotesPaneComponent />
            </div>
            <div className="contentPane">
                <TextOutlinePane/>
            </div>
        </div>)
}