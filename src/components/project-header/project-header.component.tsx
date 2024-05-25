import { Project } from "../../app/supabaseClient"
import "./project-header.component.scss"

interface ProjectHeaderProps {
    project: Project
}

export function ProjectHeader(props: ProjectHeaderProps) {
    return <div className="projectHeaderComponent">
        <div className="parent">
            <div className="child1">Ich bin das child1 {props.project.name}</div>
            <div className="child2">Child2</div>
        </div>
    </div>
}
