import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../app/store"
import { useEffect } from "react"
import { DividerComponent } from "../divider/divider.component"
import { v4 } from "uuid"
import { Navigate, useParams } from "react-router-dom"
import { LoadingOutlined } from "@ant-design/icons"

import "./text-outline-pane.component.scss"
import { Item } from "../newItemTest/item/item.component"
import { getItemsV2 } from "../../app/items.slice/item.slice.selectors"
import { loadItemsV2, upsertNewItem } from "../../app/items.slice/item.slice.async"
import { ItemV2 } from "../../app/supabaseClient"
import { NoItemsYetComponent } from "../no-items-yet/no-items-yet.component"
import { getActiveProject, getLoadProject } from "../../app/ui.slice/ui.slice.selectors"
import { ProjectHeader } from "../project-header/project-header.component"
import { Divider } from "antd"

export function TextOutlinePane() {

  const { id: activeProjectId } = useParams();
  const items = useSelector(getItemsV2)
  const loadingProject = useSelector(getLoadProject)
  const activeProject = useSelector(getActiveProject)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (activeProjectId) {
      dispatch(loadItemsV2(activeProjectId))
      window.scrollTo(0, 0)
    }
  }, [dispatch, activeProjectId])

  const createNewItem = (idx: number, type?: "PARAGRAPH" | "H1") => {

    const item = {
      version: 0,
      item_id: v4(),
      rank: idx,
      type: type || "PARAGRAPH"
    } as ItemV2

    dispatch(upsertNewItem(item))
  }

  return <div className="textOutlinePaneComponent">
    {!!activeProject ? <ProjectHeader project={activeProject} /> : ""}
    <Divider style={{ margin: 0 }}></Divider>
    {items.length === 0 && !loadingProject ? <NoItemsYetComponent
      onNewParagraph={() => createNewItem(0, "PARAGRAPH")}
      onNewHeader={() => createNewItem(0, "H1")}></NoItemsYetComponent> : ""}
    {loadingProject ? <div className="loadingBar"><LoadingOutlined color="green" spin={true}></LoadingOutlined></div> : ""}
    {!activeProjectId ? <Navigate to={"/"}></Navigate> : ""}
    {items.length > 0 ?
      <DividerComponent
        buttonCaption={"Paragraph"}
        index={0}
        onButtonClick={(index: number) => createNewItem(index, "PARAGRAPH")} /> : ""}

    {items?.map((i, idx) =>
      <div key={idx + 1}>
        <Item item={i} onNew={createNewItem} index={idx} className={!i.outline||i.outline==="<p><br></p>"?"emptyItem":""} />
        <DividerComponent
          buttonCaption={"Paragraph"}
          index={idx + 1}
          onButtonClick={(index: number) => createNewItem(index, "PARAGRAPH")} />
      </div>
    )}
  </div>
}