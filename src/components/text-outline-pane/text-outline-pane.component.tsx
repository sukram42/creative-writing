import { useDispatch, useSelector } from "react-redux"
import { getActiveProject, getChapters, getItems, getLoadChapter } from "../../app/ui.slice/ui.slice.selectors"
import { AppDispatch } from "../../app/store"
import { getChaptersByProject, upsertNewChapter } from "../../app/ui.slice/ui.slice.async"
import { useEffect } from "react"
import { ChapterComponent } from "../chapter/chapter.component"
import { DividerComponent } from "../divider/divider.component"
import { v4 } from "uuid"
import { Navigate, useParams } from "react-router-dom"
import { Button } from "antd"
import { PlusCircleOutlined } from "@ant-design/icons"

import "./text-outline-pane.component.scss"

export function TextOutlinePane() {

  const { id: activeProject } = useParams();

  const items = useSelector(getItems)
  const chapters = useSelector(getChapters)
  const isLoadingChapters = useSelector(getLoadChapter)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (activeProject) {
      dispatch(getChaptersByProject(activeProject))
    }
  }, [dispatch, activeProject])

  const createNewChapter = (idx: number) => {
    const newChapter = {
      title: "",
      chapter_id: v4(),
      descriptions: "",
      project: activeProject,
      index: idx
    }
    dispatch(upsertNewChapter({ index: idx, chapter: newChapter }))

  }
  return <>
    {isLoadingChapters?"Loading Loading Loading":""}
    {chapters.length == 0 && !isLoadingChapters ? <div className="noChapterPlaceholder">
      <div>Hey there! This seems to be a new project! So start by adding a new chapter</div>
      <Button size={"large"} icon={<PlusCircleOutlined />} shape="round" onClick={() => createNewChapter(0)}>Chapter</Button>
    </div> : ""}
    {chapters.map((c, idx) =>
      <div key={idx}>
        {!activeProject ? <Navigate to={"/"}></Navigate> : ""}
        {idx==0?<DividerComponent
          buttonCaption={"Chapter"}
          index={idx}
          onButtonClick={() => createNewChapter(idx + 1)} />:""}
        <ChapterComponent chapter={c} items={items[c.chapter_id]} />
        <DividerComponent
          buttonCaption={"Chapter"}
          index={idx}
          onButtonClick={() => createNewChapter(idx + 1)} />
      </div>
    )}
  </>
}