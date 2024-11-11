
import { Outlet } from "react-router-dom"

import "./layout.view.css"
import Sidebar from "../../components/sidebar/sidebar.component"
import { isShowSidebar } from "../../app/ui.slice/ui.slice.selectors";
import { useSelector } from "react-redux";
import { Splitter } from 'antd';
import { useEffect, useState } from "react";

export function Layout() {
    const sidebarVisible = useSelector(isShowSidebar)

    const [sizes, setSizes] = useState<(number | string)[]>(['20%', '80%']);

    useEffect(()=>{
        if (!sidebarVisible){
            setSizes(["0%", "100%"])
        }
        if (sidebarVisible){
            setSizes(['20%', '80%'])
        }
    },[sidebarVisible])

    return (<div className="newRoot">
        {/* // <div className={"layoutContainer " + (sidebarVisible ? "layoutWithSidebar" : "layoutWithoutSidebar")} > */}
        <Splitter  onResize={setSizes}>
            <Splitter.Panel className="sidebar"
                min="15%"
                resizable={sidebarVisible}
                size={sizes[0]}
                max="30%">
                <Sidebar></Sidebar>
            </Splitter.Panel>
            <Splitter.Panel
                size={sizes[1]}
            >
                <Outlet />
            </Splitter.Panel>
        </Splitter>

        {/* <div className="content">
                <Outlet />
            </div>
            {sidebarVisible && (
                <div className="sidebar">
                    <Sidebar></Sidebar>
                </div>)}
            {!sidebarVisible &&
                <div className="smallSidebar">
                    <UserAvatar smallVersion={true}></UserAvatar>
                </div>
            } */}
        {/* <div className="footer">
                <FooterComponent></FooterComponent>
            </div> */}
    </div>
    )
}