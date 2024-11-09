
import { Outlet, useLocation } from "react-router-dom"

import "./layout.view.css"
import { FooterComponent } from "../../components/footer/footer.component"
import Sidebar from "../../components/sidebar/sidebar.component"
import { isShowSidebar } from "../../app/ui.slice/ui.slice.selectors";
import { useSelector } from "react-redux";

export function Layout() {
    const location = useLocation();
    const sidebarVisible = useSelector(isShowSidebar)
    return (
        <div className={"layoutContainer " + (sidebarVisible ? "layoutWithSidebar" : "layoutWithoutSidebar")} >
            <div className="content">
                <Outlet />
            </div>
            {sidebarVisible && (
                <div className="sidebar">
                    <Sidebar showBack={location.pathname !== "/"} ></Sidebar>
                </div>)}
            <div className="footer">
                <FooterComponent></FooterComponent>
            </div>
        </div>
    )
}