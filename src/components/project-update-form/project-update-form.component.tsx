import { Card, Select } from "antd"
import { Project } from "../../app/supabaseClient"
import Meta from "antd/es/card/Meta"
import { InputTextCard } from "../input-text-card/input-text-card.component"
import { supportedLanguages } from "../../app/supportedLanguages"
import { useDispatch } from "react-redux"
import { updateProjectField } from "../../app/ui.slice/ui.slice.async"
import { AppDispatch } from "../../app/store"


interface ProjectUpdateFormProps {
    project: Project
}

export function ProjectUpdateForm(props: ProjectUpdateFormProps) {

    const dispatch = useDispatch<AppDispatch>()

    return (
        <div>
            <InputTextCard
                description="What is this document about? We will use the information to generate better fitting paragraphs."
                title="Description of the document"
                placeholder={"The description goes here!"}
                defaultValue={props.project.description!}
                onBlur={(val: string) => {
                    dispatch(updateProjectField({
                        field: "description",
                        projectId: props.project.project_id,
                        newValue: val
                    }))
                }}
                maxLength={500} />

            <InputTextCard
                title="How should a paragraph be defined?"
                description="Would you like to have concise phrases? Short bullet points? 3-4 sentences for a presentation?"
                placeholder={"Your description goes here!"}
                defaultValue={props.project.paragraph_definition!}
                onBlur={(val: string) => {
                    dispatch(updateProjectField({
                        field: "paragraph_definition",
                        projectId: props.project.project_id,
                        newValue: val
                    }))
                }}
                maxLength={500} />
            <InputTextCard
                title="Language description."
                defaultValue={props.project.language_description!}
                description="What should the language be like? Maybe direct and serious? Or more fun?"
                placeholder={"Your description goes here!"}
                onBlur={(val: string) => {
                    dispatch(updateProjectField({
                        field: "language_description",
                        projectId: props.project.project_id,
                        newValue: val
                    }))
                }}
                maxLength={500} />
            <Card>
                <Meta
                    title="Output language."
                    description="What language should the text be in"
                />
                <div style={{ padding: "1em 0", minWidth:"100%" }}>
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Select a language"
                        defaultValue={props.project.output_language}
                        onChange={(val) => { dispatch(updateProjectField({ field: "output_language", newValue: val, projectId: props.project.project_id })) }}
                        options={supportedLanguages}
                    />
                </div>
            </Card>
        </div>)
} 