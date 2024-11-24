import { Button, Card, Divider, Form, Input } from "antd";
import { useState } from "react";
import { supabase } from "../../app/supabaseClient";
import { Navigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import "./login.view.scss";

import { GoogleOutlined, KeyOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import logo from "../../assets/outlaine_o.svg"


interface LoginInformation {
    username: string,
    password: string
}

export function LoginView() {
    const [user, setUser] = useState<User>()

    const [form] = Form.useForm();

    async function logIn(values: LoginInformation) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: values.username,
            password: values.password
        })
        if (error) {
            showLoginError()
            return
        }
        setUser(data.user)
    }

    async function logInWithOAuth(provider: "google") {
        supabase.auth.signInWithOAuth({
            provider,
        })
    }

    const showLoginError = () => {
        form.setFields([
            {
                name: 'password',
                errors: ['Oh no appearently there was an issue with the password! Maybe wrong?'],
            },
        ]);
    }

    return (
        <div className="loginView">
            <div>{user ? <Navigate to={"/"}></Navigate> : ""}</div>

            <div className="loginForm">
                <Card className="loginCard">
                    <div className="textInfo">
                        <a href="http://www.outlaine.com">
                            <img src={logo}
                                className="logo"
                                alt="Outlaine Logo" /></a>
                        <div className="appName">Welcome to Outl<b>ai</b>ne!</div>
                        <div className="appDescription">
                            The app which makes you fall in love with texts.
                        </div>
                    </div>

                    <Form
                        form={form}
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
                            <Input.Password prefix={<KeyOutlined
                                className="site-form-item-icon" />}
                                placeholder="Your password"
                                autoComplete="current-password" />
                        </Form.Item>

                        <div className="loginButton">
                            <Button type="default" htmlType="submit" icon={<MailOutlined />}>
                                Login with Mail
                            </Button>
                        </div>
                        <Divider>or</Divider>
                        <div className="oauthLogins">
                            <Button type="default"
                                htmlType="submit"
                                icon={<GoogleOutlined />}
                                onClick={() => logInWithOAuth("google")}>
                                Mit Google fortfahren
                            </Button>
                        </div>
                    </Form>
                </Card>

            </div>
        </div >
    );
}