import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../app/store"
import { useEffect } from "react"
import { DividerComponent } from "../divider/divider.component"
import { Navigate, useParams } from "react-router-dom"
import { LoadingOutlined } from "@ant-design/icons"

import "./text-outline-pane.component.scss"
import { getItemsV2 } from "../../app/items.slice/item.slice.selectors"
import { createNewItem, loadItemsV2 } from "../../app/items.slice/item.slice.async"
import { ItemType, ItemV2 } from "../../app/supabaseClient"
import { NoItemsYetComponent } from "../no-items-yet/no-items-yet.component"
import { getActiveProject, getLoadProject, getStep, getViews } from "../../app/ui.slice/ui.slice.selectors"
import { ProjectHeader } from "../project-header/project-header.component"
import { Divider } from "antd"
import { Item } from "../newItemTest/item/item.component"
import { OneItemAlready } from "../one-item-already/one-item-already.component"



export function TextOutlinePane() {

  const { id: activeProjectId } = useParams();
  const items = useSelector(getItemsV2)
  const loadingProject = useSelector(getLoadProject)
  const activeProject = useSelector(getActiveProject)
  const dispatch = useDispatch<AppDispatch>()

  const step = useSelector(getStep)
  const views = useSelector(getViews)
  const itemEmpty = (item: ItemV2) => {
    for (let view of views) {
      if (![null, "", "<p><br></p>"].includes(item[view])) {
        return false
      }
      return true
    }

  }

  useEffect(() => {
    if (activeProjectId) {
      dispatch(loadItemsV2(activeProjectId))
      window.scrollTo(0, 0)
    }
  }, [dispatch, activeProjectId])


  return <div className="textOutlinePaneComponent">
    {!!activeProject ? <ProjectHeader project={activeProject} /> : ""}
    <Divider style={{ margin: 0 }}></Divider>
    {items.length === 0 && !loadingProject ?
      <NoItemsYetComponent
        onNewParagraph={() => dispatch(createNewItem({ idx: 0, type: "PARAGRAPH" }))}
        onNewHeader={() => dispatch(createNewItem({ idx: 0, type: "H1" }))}>
      </NoItemsYetComponent> : ""}
    {loadingProject ? <div className="loadingBar"><LoadingOutlined color="green" spin={true}></LoadingOutlined></div> : ""}
    {!activeProjectId ? <Navigate to={"/"}></Navigate> : ""}
    {items.length > 0 ?
      <DividerComponent
        buttonCaptionHeader={"Header"}
        buttonCaptionParagraph={"Paragraph"}
        index={0}
        onButtonClick={(idx: number, type: ItemType) => dispatch(createNewItem({ idx, type }))} /> : ""}

    {items?.map((i, idx) =>
      <div key={idx + 1}>
        <Item item={i} index={idx} className={itemEmpty(i) ? " emptyItem" : ""} />
        <DividerComponent
          buttonCaptionHeader="Header"
          buttonCaptionParagraph={"Paragraph"}
          index={idx + 1}
          onButtonClick={(index: number, type: ItemType) => dispatch(createNewItem({ idx: index, type }))} />
      </div>
    )}
    {items.length === 1 && !loadingProject && <OneItemAlready step={step} />}
  </div>
}