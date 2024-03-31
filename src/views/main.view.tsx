import { Button } from "antd";
import { supabase } from "../app/supabaseClient";
import { useNavigate } from "react-router-dom";


export function MainView() {
    const navigate = useNavigate();
    const logOut = () => {
        supabase.auth.signOut()
        navigate("/login")
    }
    return <>
        Main stuff
        <Button onClick={() => logOut()}>LogOut</Button>
    </>
}