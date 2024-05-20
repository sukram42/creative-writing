import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Button } from "antd";
import { NewProjectFormValues } from "./new-project-form.interface";


interface NewProjectFormProps {
    onFinish: (values: NewProjectFormValues) => void
}

export function NewProjectForm(props: NewProjectFormProps) {
 
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    return (
        <div>
            <Form
                {...formItemLayout}
                onFinish={props.onFinish}
            >
                <Form.Item
                    label="Project Name"
                    name="name"
                    >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Target Group"
                    tooltip="We will use this description to create better paragraphs"
                    extra="Who will read this text?"
                    name="target_group"
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Description"
                    tooltip="We will use this description to create better paragraphs"
                    extra="What is this text for? What should it show? What is the goal of this text?"
                    name="description"
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                        Create new Project
                    </Button>
                </Form.Item>
            </Form>
        </div >)
}