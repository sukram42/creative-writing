

import { useDispatch, useSelector } from "react-redux"
import "./project.view.scss"
import { AppDispatch } from "../../app/store"
import { List, Skeleton, Avatar } from "antd"
import list from "antd/es/list"
import { loadProjects } from "../../app/ui.slice/ui.slice.async"
import { getActiveProject, getAreProjectsLoading, getProjects } from "../../app/ui.slice/ui.slice.selectors"
import { useEffect } from "react"
import { Navigate } from "react-router-dom"

export function ProjectView() {

    const dispatch = useDispatch<AppDispatch>()

    const activeProject = useSelector(getActiveProject)
    const projects = useSelector(getProjects)
    const areProjectsLoading = useSelector(getAreProjectsLoading)
    useEffect(() => {
        dispatch(loadProjects())
    }, []);

    return (
        <div className="projectView">
            { activeProject?<Navigate to={`/project/${activeProject}`}></Navigate> : ""}
            <div className="projectList">
            <List
                className="projectList"
                itemLayout="horizontal"
                dataSource={projects}
                loading={areProjectsLoading}
                renderItem={(item) => (
                    <List.Item
                        actions={[<a key="list-loadmore-edit" href={`#/project/${item.project_id}`}>edit</a>, <a key="list-loadmore-more">more</a>]}
                    >
                        <Skeleton avatar title={false} loading={areProjectsLoading} active>
                            <List.Item.Meta
                                // avatar={<Avatar src={item.picture.large} />}
                                title={<a href="https://ant.design">{item.name}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                            <div>content</div>
                        </Skeleton>
                    </List.Item>
                )}
            /></div>

        </div>)
}