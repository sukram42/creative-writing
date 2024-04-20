
import { Outlet } from "react-router-dom"

import "./layout.view.css"
import { FooterComponent } from "../../components/footer/footer.component"

export function Layout() {
    //const history = useNavigate()
    //const setRouteActive = (value: string) => {
      //  history(value)
    //}
    return (
            <div className="layoutContainer">
                <div className="content">
                    <Outlet />
                </div>
                <div className="footer">
                    <FooterComponent></FooterComponent>
                </div>
        </div>
    )
}