

import { useDispatch, useSelector } from "react-redux"
import "./project.view.scss"
import { AppDispatch } from "../../app/store"
import { Button, Drawer, Table } from "antd"
import { createProject, deleteProject, loadProjects, setActiveProject } from "../../app/ui.slice/ui.slice.async"
import { getActiveProjectId, getAreProjectsLoading, getProjects } from "../../app/ui.slice/ui.slice.selectors"
import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { EditOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons"
import { NewProjectFormValues } from "../../components/new-project-form/new-project-form.interface"
import { NewProjectForm } from "../../components/new-project-form/new-project-form.component"
import { Project } from "../../app/supabaseClient"
import { ProjectInfo } from "../../components/project-info/project-info.component"
import { setShowSidebar, setStep, updateActiveProject } from "../../app/ui.slice/ui.slice"
import moment from 'moment';

export function ProjectView() {

    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const activeProject = useSelector(getActiveProjectId)
    const projects = useSelector(getProjects)
    const areProjectsLoading = useSelector(getAreProjectsLoading)

    const [isNewProjectDrawerOpen, setNewProjectDrawerOpenState] = useState(false)
    const [activeProjectInfo, setActiveProjectInfo] = useState<Project | null>(null)

    useEffect(() => {
        dispatch(setShowSidebar(false))
        dispatch(loadProjects())

        dispatch(updateActiveProject(null))
        dispatch(setStep("outlining"))
    }, []);


    const createProjectFinish = (values: NewProjectFormValues) => {

        if (!values.name) {
            values = { ...values, name: "New Unnamed Project" }
        }
        setNewProjectDrawerOpenState(false)
        setLoading(true)

        let a = dispatch(createProject(values))
        a.then((a) => {
            setLoading(false)
            navigate(`/project/${a.payload.project_id}`)
        })
    }

    const columns = [
        {
            title: 'Name',
            sorter: (a: Project, b: Project) => a.name > b.name ? 0 : 1,
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: Project) => (
                <div>
                    <div className="projectName">
                        <a href={`#/project/${record.project_id}`}>{record.name}</a>
                    </div>
                    <div className="projectDescription">
                        {record.description}
                    </div>
                </div>
            )
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            defaultSortOrder: 'descend',
            sorter: (a: Project, b: Project) => moment(a.created_at).unix() - moment(b.created_at).unix(),
            render: (text: string) => moment(text).fromNow(),
        },
        {
            title: '',
            dataIndex: "project_id",
            render: (_: any, record: Project) => (
                <div className="projectButtonBar" key={record.project_id}>
                    <Button key="list-loadmore-edit" icon={<EditOutlined />} href={`#/project/${record.project_id}`}></Button>
                    <Button key="info" type="text" icon={<MoreOutlined />} onClick={() => setActiveProjectInfo(record)}></Button>
                </div>
            ),
        },
    ];
    return (
        <div className="projectView">
            <Drawer title="Basic Drawer" size={"large"} onClose={() => setNewProjectDrawerOpenState(false)} open={isNewProjectDrawerOpen}>
                <NewProjectForm onFinish={createProjectFinish} />
            </Drawer>
            <Drawer size={"large"}
                title="Project Overview"
                open={!!activeProjectInfo}
                onClose={() => setActiveProjectInfo(null)}>
                {
                    !!activeProjectInfo ? <ProjectInfo onDelete={() => {
                        dispatch(deleteProject(activeProjectInfo.project_id))
                        setActiveProjectInfo(null)
                    }} project={activeProjectInfo!}></ProjectInfo> : ""}
            </Drawer>

            <div className="projectToolbar">
                <Button icon={<PlusOutlined />} onClick={() => setNewProjectDrawerOpenState(true)} size="large" type="primary"> Project </Button>
            </div>

            {activeProject ? <Navigate to={`/project/${activeProject}`}></Navigate> : ""}

            <div className="projectList">
                {/* 
                //tslint ignore
                 */}
                <Table dataSource={projects}
                    loading={areProjectsLoading || loading}
                    /*// @ts-ignore */
                    columns={columns} />;
            </div>
        </div >)
}