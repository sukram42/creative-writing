import { useDispatch } from "react-redux"
import { Project } from "../../app/supabaseClient"
import "./project-header.component.scss"
import { Badge, Button, Popover, Typography } from "antd"
import { updateProjectField, updateProjectNameAsync } from "../../app/ui.slice/ui.slice.async"
import { AppDispatch } from "../../app/store"
import { FileOutlined, SettingOutlined } from "@ant-design/icons"
import { setDocumentDrawerOpen, setRawDrawerOpen } from "../../app/ui.slice/ui.slice"

interface ProjectHeaderProps {
    project: Project
}

export function ProjectHeader(props: ProjectHeaderProps) {

    const dispatch = useDispatch<AppDispatch>()

    return <div className="projectHeaderComponent">
        <div className="parent" >
            <Typography.Title className={"header"} level={1} editable={{
                onChange: (value) => dispatch(updateProjectNameAsync(value)),
                triggerType: ["text"],
            }}>{props.project.name}</Typography.Title>
            <Typography.Paragraph
                className={"description"}
                editable={{
                    onChange: (value) => {
                        dispatch(updateProjectField({
                            field: "description",
                            projectId: props.project.project_id,
                            newValue: value
                        }))
                    },
                    triggerType: ["text"],
                }}>{props.project.description}</Typography.Paragraph>
            <Popover mouseEnterDelay={1} title="Configure your text" content={<p>To be able to generate the perfect paragraphs we need more information on the text! <br /> This information you can fill in here. <br /> <br />{!props.project.description && "You see this red dot, because you did not yet provide a description."}</p>}>
                <Badge dot={!props.project.description}>
                    <Button icon={<SettingOutlined />} type="text" onClick={() => dispatch(setDocumentDrawerOpen(true))}>
                        Configure
                    </Button>
                </Badge>
            </Popover>
            <Button icon={<FileOutlined />} type="text" onClick={() => dispatch(setRawDrawerOpen(true))}>
                View
            </Button>
        </div>
    </div >
}
