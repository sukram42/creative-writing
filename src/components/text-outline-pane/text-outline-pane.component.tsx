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

export function TextOutlinePane() {

  const { id: activeProject } = useParams();
  const items = useSelector(getItemsV2)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (activeProject) {
      dispatch(loadItemsV2(activeProject))
    }
  }, [dispatch, activeProject])

  const createNewItem = (idx: number) => {
    const item = {
      version: 0,
      item_id: v4(),
      rank: idx,
      type: "PARAGRAPH"
    } as ItemV2

    dispatch(upsertNewItem(item))
  }

  return <>

    {false ? <div className="loadingBar"><LoadingOutlined color="green" spin={true}></LoadingOutlined></div> : ""}
    {!activeProject ? <Navigate to={"/"}></Navigate> : ""}

    <DividerComponent
      buttonCaption={"Item"}
      index={0}
      onButtonClick={createNewItem} />

    {items?.map((i, idx) =>
      <div key={idx + 1}>
        <Item item={i} />
        <DividerComponent
          buttonCaption={"Item"}
          index={idx + 1}
          onButtonClick={createNewItem} />
      </div>
    )}
  </>
}