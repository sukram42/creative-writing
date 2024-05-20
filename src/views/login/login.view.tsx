import { Button, Card, Form, Input } from "antd";
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

    const showLoginError = () => {
        form.setFields([
            {
                name: 'password',
                errors: ['Oh no appearently there was an issue with the password! Maybe wrong?'],
            },
        ]);
    }

    const formItemLayout = {
        labelCol: { span: 0 },
        wrapperCol: { span: 2 },
    };

    return (
        <div className="loginView">
            <div>{user ? <Navigate to={"/"}></Navigate> : ""}</div>

            <div className="loginForm">
                <Card className="loginCard">
                    <div className="textInfo">
                        <div className="appName">Welcome to Outl<b>ai</b>ne!</div>
                        <div className="appDescription">
                            The app which makes you fall in love with texts.</div>
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
                        <Form.Item {...formItemLayout}>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
            <div className="img">
                <h1>What is it all about?</h1>
                <div className="paragraph">
                    <div className="text">
                        <p>
                            This platform is designed for text creation, but it's not your typical note-taking app. You don't have to worry about how your thoughts are initially organized or appear, as long as you get your ideas down. The main focus is on the content you want to convey. Once you've jotted down your thoughts, the app takes over and does the rest of the work for you.
                        </p>
                    </div>
                    <div className="outline">
                        <ul>
                            <li>This is a platform to create texts</li>
                            <ul>
                                <li >Other then normally u just dump down ur thoughts</li>
                                <li >Doesnt even matter how it looks like </li>
                                <li>Its just important that the content is in u need.</li>
                                <li >This app will then do the rest</li>
                            </ul></ul>
                    </div>
                </div>
                <div className="paragraph">
                    <div className="text">
                        <p>
                            We're just getting started on this exciting journey! As we speak, we're busily setting everything up for you. Currently, access to our app is by invitation only, but we're hopeful that soon we'll be able to open it up to everyone. Once we do, you'll be able to create fantastic texts, just like this one.
                        </p>
                    </div>
                    <div className="outline">
                        <ul>
                            <li>We are still in the beginning</li>
                            <ul><li >We are currently working on setting all up </li>
                                <li>Hence, right now we only allow invitations to the app</li>
                                <li>But hopefully soon we can open it up</li><li>And allow creating amazing texts</li>
                                <li>like this one here</li></ul></ul>
                    </div>
                </div>
            </div>
        </div >
    );
}