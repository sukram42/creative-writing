import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { Input, Button, Form, Card, Alert, Space } from "antd";

import "./reset-password.view.scss"
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../app/ui.slice/ui.slice.selectors";
import { supabase } from "../../app/supabaseClient";
import { useEffect, useState } from "react";
import { fetchProfile } from "../../app/ui.slice/ui.slice.async";
import { AppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";

interface FormValues {
    password1: string;
    password2?: string;
}

export function ResetPassword() {

    const user = useSelector(getUser)
    const [form] = Form.useForm();

    const navigate = useNavigate()
    const [error, setError] = useState<String | null>(null)

    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(fetchProfile())
    }, [])

    const onRegister = (values: FormValues) => {
        console.log(values)
        if (values.password1 !== values.password2) {
            alert("ohn no")
            return
        }
        supabase.auth.updateUser({ password: values.password1 })
            .then((data) => { if (data.error) throw (data.error) })
            .then(() => {
                navigate("/")
            })
            .catch((error) => {
                setError(error.message)
            })
    }

    return (
        <div className="firstLoginCheckView">
            <div className="content">
                {error && <Alert
                    message={error}
                    type="warning"
                    showIcon
                    onClose={() => setError(null)}
                    closable
                />}
                <Card>
                    <h1>Reset your password!</h1>
                    <Form
                        form={form}
                        className="formElement"
                        name="basic"
                        variant="filled"
                        size="large"
                        initialValues={{ remember: true }}
                        onFinish={onRegister}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="username"
                        >
                            <Input disabled={true}
                                autoComplete="username"
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder={user?.email}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password1"
                            rules={[{ required: true, message: 'Please input your new password!' }]}
                        >
                            <Input.Password prefix={<KeyOutlined className="site-form-item-icon" />} placeholder="password" autoComplete="current-password" />
                        </Form.Item>
                        <Form.Item
                            name="password2"
                            rules={[{ required: true, message: 'Please repeat your password again!' }]}
                        >
                            <Input.Password prefix={<KeyOutlined className="site-form-item-icon" />} placeholder="And the password once again!" autoComplete="current-password" />
                        </Form.Item>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Reset Password
                                </Button>

                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div >)
}