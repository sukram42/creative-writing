import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { Input, Button, Form, Card, Checkbox, Alert, Space } from "antd";

import "./first-login-check.view.scss"
import { useDispatch, useSelector } from "react-redux";
import { getProfile, getUser } from "../../app/ui.slice/ui.slice.selectors";
import { supabase } from "../../app/supabaseClient";
import { useEffect, useState } from "react";
import { fetchProfile } from "../../app/ui.slice/ui.slice.async";
import { AppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";

interface FormValues {
    password?: string;
    privacyPolicy?: string;
}

export function FirstLoginCheck() {

    const user = useSelector(getUser)
    const [form] = Form.useForm();

    const navigate = useNavigate()
    const [error, setError] = useState<String | null>(null)

    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(fetchProfile())
    }, [])

    const profile = useSelector(getProfile)
    const onRegister = (values: FormValues) => {
        if (values.privacyPolicy !== undefined && !values.privacyPolicy) {
            form.setFields([
                {
                    name: 'privacyPolicy',
                    errors: ['To be able to use the platform you need to accept the privacy policy. Feel free to reach out to us in case you have any questions!'],
                },
            ]);
        } else {

            //Update mail
            if (!!values.password) {
                const updatedProfie = {
                    password_set: true,
                    is_onboarded: profile?.is_onboarded ? true : !!values.privacyPolicy
                }
                supabase.auth.updateUser({ password: values.password })
                    .then((data) => { if (data.error) throw (data.error) })
                    .then(() => supabase.from("profiles")
                        .update(updatedProfie)
                        .eq("user_id", profile?.user_id))
                    .then(() => navigate("/"))
                    .catch((error) => { setError(error.message) })
                return
            }
            // only the privacy Policy update
            if (!!values.privacyPolicy && !error) {
                supabase.from("profiles")
                    .update({ is_onboarded: true })
                    .eq("user_id", profile?.user_id)
                    .select()
                    .then(() => navigate("/"))
            }
            // Handle form submission logic here
        }
    }

    const forgetMe = () => {
        // sign out the user
        supabase.auth.signOut()
            .then(() => supabase.from("profiles").delete().eq("user_id", profile?.user_id))
            .then(() => supabase.auth.signOut())
            .then(() => navigate("/login"))
    }

    // Redirect in case everything is set
    if (profile?.is_onboarded && profile?.password_set) {
        navigate("/")
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
                    <h1>Welcome to Outl<b>ai</b>ne!</h1>
                    <div className="subheader text">
                        This platform should help you creating amazing texts based on the underlying ideas!
                        Let's get you started directly. For this we would need you to choose a secure password and accept our privacy policy as well as our terms of services. After this you are ready to create!
                    </div>
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
                        {!profile?.password_set ?
                            <Form.Item
                                name="username"
                            >
                                <Input disabled={true}
                                    autoComplete="username"
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    placeholder={user?.email}
                                />
                            </Form.Item> : ""}
                        {!profile?.password_set ?
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}

                            >
                                <Input.Password prefix={<KeyOutlined className="site-form-item-icon" />} placeholder="password" autoComplete="current-password" />
                            </Form.Item> : ""}
                        {!profile?.is_onboarded ? <div><div className="text">
                            To be able to understand how we can improve this plattform, we need you to accept our privacy policy. We will track some meta information about the way you are using the app! For more information check it out! <i>(We are still creating it, so for now just trust me for now)</i></div>
                            <Form.Item
                                name={"privacyPolicy"}
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please accept the privacy policy",
                                    },
                                ]}>
                                <Checkbox
                                >I accept the usage of my personal data as described in the Privacy Policy.</Checkbox>
                            </Form.Item></div> : ""}
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Register
                                </Button>
                                <Button type="dashed" onClick={() => forgetMe()}>
                                    Please forget me. :(
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div >)
}