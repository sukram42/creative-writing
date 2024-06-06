import { useDispatch } from "react-redux"
import { Project } from "../../app/supabaseClient"
import "./project-header.component.scss"
import { Typography } from "antd"
import { updateProjectField, updateProjectNameAsync } from "../../app/ui.slice/ui.slice.async"
import { AppDispatch } from "../../app/store"

interface ProjectHeaderProps {
    project: Project
}

export function ProjectHeader(props: ProjectHeaderProps) {

    const dispatch = useDispatch<AppDispatch>()

    return <div className="projectHeaderComponent">
        <div className="parent">
            <Typography.Title className={"header"} level={1} editable={{
                onChange: (value) => dispatch(updateProjectNameAsync(value)),
                triggerType: ["text"],
            }}>{props.project.name}</Typography.Title>
            <Typography.Paragraph
                className={"description"}
                editable={{
                    onChange: (value) =>
                        dispatch(updateProjectField({
                            field: "description",
                            projectId: props.project.project_id,
                            newValue: value
                        })),
                    triggerType: ["text"],
                }}>{props.project.description || "   "}</Typography.Paragraph>
        </div>
    </div >
}
