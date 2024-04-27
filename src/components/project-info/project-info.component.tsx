import { Button, Card, Descriptions } from "antd";
import Meta from "antd/es/card/Meta";
import { Project } from "../../app/supabaseClient";
import { DeleteOutlined } from "@ant-design/icons";

import "./project-info.component.scss";

interface ProjectInfoProps {
    project: Project,
    onDelete: (project_id: string) => void
}


export function ProjectInfo(props: ProjectInfoProps) {

    return (<div className="projectInfoComponent">
        <Card>
            <Meta title={props.project.name} description={props.project.description} />
        </Card>
        <Card>
            <Descriptions bordered column={1} title="Project Info">
                <Descriptions.Item label="Name">{props.project.name}</Descriptions.Item>
                <Descriptions.Item label="Created">{props.project.created_at}</Descriptions.Item>
                <Descriptions.Item label="By">{props.project.created_by}</Descriptions.Item>
                <Descriptions.Item label="Target Group">{props.project.target_group}</Descriptions.Item>
            </Descriptions>
        </Card>
        <Card>
            <Button danger
                icon={<DeleteOutlined />}
                type="primary"
                onClick={() => props.onDelete(props.project.project_id)}>Delete</Button>
        </Card>
    </div>
    )
}