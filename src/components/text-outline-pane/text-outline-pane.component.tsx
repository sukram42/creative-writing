import { useDispatch, useSelector } from "react-redux"
import { getActiveProject, getChapters, getItems } from "../../app/ui.slice/ui.slice.selectors"
import { AppDispatch } from "../../app/store"
import { getChaptersByProject,  upsertNewChapter } from "../../app/ui.slice/ui.slice.async"
import { useEffect } from "react"
import { ChapterComponent } from "../chapter/chapter.component"
import { DividerComponent } from "../divider/divider.component"
import { v4 } from "uuid"

export function TextOutlinePane() {

  const activeProject = useSelector(getActiveProject)

  const items = useSelector(getItems)
  const chapters = useSelector(getChapters)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getChaptersByProject(activeProject))
  }, [dispatch, activeProject])

  return <>
    {chapters.map((c, idx) =>
      <div>
        <ChapterComponent chapter={c} items={items[c.chapter_id]} />
        <DividerComponent
          buttonCaption={"Chapter" + idx}
          index={idx}
          onButtonClick={() => {
            const newChapter = {
              title: "",
              chapter_id: v4(),
              descriptions: "",
              project: activeProject,
              index: idx+1
            }
            dispatch(upsertNewChapter({ index: idx+1, chapter: newChapter }))
            // dispatch(locallyAddChapterAtIndex({ index: idx, projectId: activeProject }))
          }} />
      </div>
    )}
  </>
}