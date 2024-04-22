
import { Outlet, useLocation, useNavigate } from "react-router-dom"

import "./layout.view.css"
import { FooterComponent } from "../../components/footer/footer.component"
import Sidebar from "../../components/sidebar/sidebar.component"

export function Layout() {
    const location = useLocation();
    console.log("loc",location)
    return (
            <div className="layoutContainer">
                <div className="content">
                    <Outlet />
                </div>
                <div className="sidebar">
                    <Sidebar showBack={location.pathname !=="/"} ></Sidebar>
                </div>
                <div className="footer">
                    <FooterComponent></FooterComponent>
                </div>
        </div>
    )
}