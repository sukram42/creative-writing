
import { Outlet, useNavigate } from "react-router-dom"

import "./layout.css"

export function Layout() {
    const history = useNavigate()
    const setRouteActive = (value: string) => {
        history(value)
    }
    console.log("test")
    return (
        <div className="test">
            <div className="layoutContainer">
                <div className="content">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}