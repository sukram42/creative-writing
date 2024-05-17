import { Button, Form, Input } from "antd";
import { useState } from "react";
import { supabase } from "../../app/supabaseClient";
import { Navigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import "./login.view.scss";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";

interface LoginInformation {
    username: string,
    password: string
}

export function LoginView() {
    const [user, setUser] = useState<User>()
    const [_0, setLoginError] = useState<Error>()
    async function logIn(values: LoginInformation) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: values.username,
            password: values.password
        })
        if (error) {
            setLoginError(error)
            return
        }
        setUser(data.user)
    }
    const formItemLayout = {
        labelCol: { span: 0 },
        wrapperCol: { span: 2},
        };

    return (
        <div className="loginView">
            <div>{user ? <Navigate to={"/"}></Navigate> : ""}</div>
            <div className="img"></div>
            <div className="loginForm">
                <div className="textInfo">
                    <div className="appName">Welcome to WrAIter!</div>
                    <div className="appDescription">
                        The app which makes you fall in love with texts.</div>
                </div>
                <Form
                    className="formElement"
                    name="basic"
                    variant="filled"
                    size="large"
                    initialValues={{ remember: true }}
                    onFinish={logIn}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input autoComplete="username" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}

                    >
                        <Input.Password prefix={<KeyOutlined className="site-form-item-icon" />} placeholder="Username" autoComplete="current-password" />
                    </Form.Item>
                    <Form.Item {...formItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}