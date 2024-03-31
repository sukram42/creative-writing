import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../app/supabaseClient";

export function FooterComponent() {
    const navigate = useNavigate();
    const logOut = () => {
        supabase.auth.signOut()
        navigate("/login")
    }
    return <Button onClick={()=>logOut()}>LogOut</Button>
}